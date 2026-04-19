import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { AUDIO_MODELS, isDeprecationError } from './model-config';

dotenv.config();

const port = process.env.PORT || 8080;
const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("ERRO: GEMINI_API_KEY não encontrada no .env");
    process.exit(1);
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Simple health check endpoint for Cloud Run
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        service: 'LinguaFlow Proxy',
        activeModel: currentAudioModelIndex < AUDIO_MODELS.length
            ? AUDIO_MODELS[currentAudioModelIndex]
            : 'unknown',
    });
});

const PROXY_SECRET = process.env.PROXY_SECRET;

import { TEACHERS, TOPICS, SYSTEM_INSTRUCTION_BASE, LEVEL_PROTOCOLS, KIDS_MODE_ADDITION } from './constants';

// ─── Model Fallback State ─────────────────────────────────────────────────────
// Tracks which audio model is currently active across all connections.
// When a deprecation error is detected, this index increments globally so
// all future connections automatically use the newer fallback.
let currentAudioModelIndex = 0;

const getActiveAudioModel = (): string => {
    if (currentAudioModelIndex >= AUDIO_MODELS.length) {
        console.error('🚨 ALL audio models exhausted! Resetting to index 0.');
        currentAudioModelIndex = 0;
    }
    return AUDIO_MODELS[currentAudioModelIndex];
};

const advanceToNextAudioModel = (): boolean => {
    const next = currentAudioModelIndex + 1;
    if (next >= AUDIO_MODELS.length) {
        console.error('🚨 No more audio model fallbacks available.');
        return false;
    }
    const deprecated = AUDIO_MODELS[currentAudioModelIndex];
    currentAudioModelIndex = next;
    console.warn(`⚠️  Model deprecated: "${deprecated}"`);
    console.log(`✅ Auto-advanced to: "${AUDIO_MODELS[currentAudioModelIndex]}"`);
    return true;
};

// ─── WebSocket Connections ────────────────────────────────────────────────────
wss.on('connection', (clientWs: WebSocket, req) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    // IP Protection Params
    const teacherId = url.searchParams.get('teacherId');
    const topicId = url.searchParams.get('topicId');
    const level = url.searchParams.get('level') || 'B1';
    const isKidsMode = url.searchParams.get('kids') === 'true';

    if (!PROXY_SECRET || !token || token !== PROXY_SECRET) {
        console.warn('Conexão recusada: Token inválido ou ausente no Proxy');
        clientWs.close(4001, 'Unauthorized');
        return;
    }

    console.log(`Cliente conectado [T:${teacherId}, L:${topicId}, Lvl:${level}] → Model: ${getActiveAudioModel()}`);

    // Prepare System Instruction on Server (IP protection)
    const teacher = TEACHERS.find(t => t.id === teacherId) || TEACHERS[0];
    const topic = TOPICS.find(t => t.id === topicId) || TOPICS[0];

    const levelProtocol = (LEVEL_PROTOCOLS[level] || LEVEL_PROTOCOLS['B1'])
        .replaceAll('{{TEACHER_LANGUAGE}}', teacher.language);

    let instruction = SYSTEM_INSTRUCTION_BASE
        .replaceAll('{{TEACHER_NAME}}', teacher.name)
        .replaceAll('{{TEACHER_LANGUAGE}}', teacher.language)
        .replace('{{LEVEL}}', level)
        .replace('{{LEVEL_PROTOCOL}}', levelProtocol)
        .replace('{{TOPIC_NAME}}', topic.name)
        .replace('{{TOPIC_PROMPT}}', topic.prompt)
        .replace('{{KIDS_MODE_ADDITION}}', isKidsMode ? KIDS_MODE_ADDITION : '');

    // ─── Gemini Connection with Model Fallback ────────────────────────────────
    let geminiWs: WebSocket | null = null;
    let setupSentToGemini = false;
    let lastSetupMessage: any = null; // Stored for replay on model switch
    let modelFallbackAttempts = 0;
    const MAX_FALLBACK_ATTEMPTS = AUDIO_MODELS.length;

    const buildGeminiUrl = () =>
        `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

    const connectToGemini = (isModelFallback = false) => {
        if (isModelFallback) {
            setupSentToGemini = false; // Allow setup to be replayed with new model
        }

        const geminiUrl = buildGeminiUrl();
        geminiWs = new WebSocket(geminiUrl);

        geminiWs.on('open', () => {
            const model = getActiveAudioModel();
            console.log(`Proxy conectado ao Gemini API [model: ${model}]`);

            // If this is a fallback reconnect, replay the setup message with the new model
            if (isModelFallback && lastSetupMessage) {
                console.log(`🔄 Replaying setup with fallback model: ${model}`);
                lastSetupMessage.setup.model = model;
                lastSetupMessage.setup.systemInstruction = { parts: [{ text: instruction }] };
                if (lastSetupMessage.setup.generationConfig?.speechConfig?.voiceConfig?.prebuiltVoiceConfig) {
                    lastSetupMessage.setup.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName = teacher.voice;
                }
                geminiWs!.send(JSON.stringify(lastSetupMessage));
                setupSentToGemini = true;
            }
        });

        geminiWs.on('message', (data: any) => {
            // Inspect messages for deprecation signals embedded in responses
            try {
                const text = data.toString();
                if (isDeprecationError(text) && modelFallbackAttempts < MAX_FALLBACK_ATTEMPTS) {
                    console.warn('⚠️  Deprecation signal detected in Gemini message. Attempting model fallback...');
                    if (advanceToNextAudioModel()) {
                        modelFallbackAttempts++;
                        geminiWs?.close();
                        setTimeout(() => connectToGemini(true), 500);
                        return;
                    }
                }
            } catch (_) { /* non-parseable binary — ignore */ }

            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(data);
            }
        });

        geminiWs.on('close', (code, reason) => {
            const reasonStr = reason?.toString() || '';
            console.log(`Gemini fechou a conexão: ${code} - ${reasonStr}`);

            // Detect model deprecation in close reason
            if (isDeprecationError(reasonStr) || isDeprecationError(String(code))) {
                if (modelFallbackAttempts < MAX_FALLBACK_ATTEMPTS && advanceToNextAudioModel()) {
                    modelFallbackAttempts++;
                    console.log(`🔄 Reconnecting with next model after deprecation close...`);
                    setTimeout(() => connectToGemini(true), 500);
                    return;
                }
            }

            if (clientWs.readyState === WebSocket.OPEN) {
                if (code !== 1000) {
                    // Non-clean close: simple reconnect (e.g. network glitch)
                    console.log('Tentando reconectar ao Gemini...');
                    setTimeout(connectToGemini, 1000);
                } else {
                    clientWs.close();
                }
            }
        });

        geminiWs.on('error', (err) => {
            const errMsg = err.message || String(err);
            console.error('Erro no Gemini WS:', errMsg);

            // Detect deprecation/404 in error message
            if (isDeprecationError(errMsg) && modelFallbackAttempts < MAX_FALLBACK_ATTEMPTS) {
                if (advanceToNextAudioModel()) {
                    modelFallbackAttempts++;
                    console.log(`🔄 Model error fallback triggered. Next: ${getActiveAudioModel()}`);
                    setTimeout(() => connectToGemini(true), 500);
                }
            }
        });
    };

    connectToGemini();

    // ─── Handle Client Messages ───────────────────────────────────────────────
    clientWs.on('message', (data: any) => {
        if (!geminiWs || geminiWs.readyState !== WebSocket.OPEN) return;

        try {
            const message = JSON.parse(data.toString());

            // Intercept Setup Message to inject the protected instruction + correct model
            if (message.setup && !setupSentToGemini) {
                const activeModel = getActiveAudioModel();
                console.log(`Injetando SystemInstruction protegida... [model: ${activeModel}]`);

                // Override model from client with server-authoritative model
                message.setup.model = activeModel;
                message.setup.systemInstruction = { parts: [{ text: instruction }] };

                // Ensure voice matches the server-side teacher config
                if (message.setup.generationConfig?.speechConfig?.voiceConfig?.prebuiltVoiceConfig) {
                    message.setup.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName = teacher.voice;
                }

                // Store setup message for potential model fallback replay
                lastSetupMessage = JSON.parse(JSON.stringify(message));

                geminiWs.send(JSON.stringify(message));
                setupSentToGemini = true;
                return;
            }
        } catch (e) {
            // If it's not JSON (binary audio), just forward it
        }

        geminiWs.send(data);
    });

    clientWs.on('close', () => {
        console.log('Cliente desconectou');
        if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
            geminiWs.close();
        }
    });
});

server.listen(port, () => {
    console.log(`LinguaFlow Proxy rodando na porta ${port}`);
    console.log(`🤖 Audio Model: ${getActiveAudioModel()} (${AUDIO_MODELS.length} fallbacks disponíveis)`);
});
