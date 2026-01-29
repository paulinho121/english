import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const port = process.env.PORT || 8080;
const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025";

if (!API_KEY) {
    console.error("ERRO: GEMINI_API_KEY não encontrada no .env");
    process.exit(1);
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Simple health check endpoint for Cloud Run
app.get('/', (req, res) => {
    res.send('LinguaFlow Proxy is running');
});

const PROXY_SECRET = process.env.PROXY_SECRET;

import { TEACHERS, TOPICS, SYSTEM_INSTRUCTION_BASE, LEVEL_PROTOCOLS, KIDS_MODE_ADDITION } from './constants';

wss.on('connection', (clientWs: WebSocket, req) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    // IP Protection Params
    const teacherId = url.searchParams.get('teacherId');
    const topicId = url.searchParams.get('topicId');
    const level = url.searchParams.get('level') || 'B1';
    const isKidsMode = url.searchParams.get('kids') === 'true';

    if (PROXY_SECRET && token !== PROXY_SECRET) {
        console.warn('Conexão recusada: Token inválido');
        clientWs.close(4001, 'Unauthorized');
        return;
    }

    console.log(`Cliente conectado [T:${teacherId}, L:${topicId}, Lvl:${level}]`);

    // Prepare System Instruction on Server (IP protection)
    const teacher = TEACHERS.find(t => t.id === teacherId) || TEACHERS[0];
    const topic = TOPICS.find(t => t.id === topicId) || TOPICS[0];

    let instruction = SYSTEM_INSTRUCTION_BASE
        .replace('{{TEACHER_NAME}}', teacher.name)
        .replace('{{TEACHER_LANGUAGE}}', teacher.language)
        .replace('{{LEVEL}}', level)
        .replace('{{LEVEL_PROTOCOL}}', LEVEL_PROTOCOLS[level] || LEVEL_PROTOCOLS['B1'])
        .replace('{{TOPIC_NAME}}', topic.name)
        .replace('{{TOPIC_PROMPT}}', topic.prompt)
        .replace('{{KIDS_MODE_ADDITION}}', isKidsMode ? KIDS_MODE_ADDITION : '');

    // Conectar ao Gemini
    const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${API_KEY}`;
    let geminiWs: WebSocket | null = null;
    let setupSentToGemini = false;

    const connectToGemini = () => {
        geminiWs = new WebSocket(geminiUrl);

        geminiWs.on('open', () => {
            console.log('Proxy conectado ao Gemini API');
        });

        geminiWs.on('message', (data: any) => {
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(data);
            }
        });

        geminiWs.on('close', (code, reason) => {
            console.log(`Gemini fechou a conexão: ${code} - ${reason}`);
            if (clientWs.readyState === WebSocket.OPEN) {
                if (code !== 1000) {
                    console.log('Tentando reconectar ao Gemini...');
                    setTimeout(connectToGemini, 1000);
                } else {
                    clientWs.close();
                }
            }
        });

        geminiWs.on('error', (err) => {
            console.error('Erro no Gemini WS:', err);
        });
    };

    connectToGemini();

    // Handle Client Messages
    clientWs.on('message', (data: any) => {
        if (!geminiWs || geminiWs.readyState !== WebSocket.OPEN) return;

        try {
            const message = JSON.parse(data.toString());

            // Intercept Setup Message to inject the protected instruction
            if (message.setup && !setupSentToGemini) {
                console.log('Injetando SystemInstruction protegida...');
                message.setup.systemInstruction = {
                    parts: [{ text: instruction }]
                };
                // Ensure the voice matches the server-side teacher config
                if (message.setup.generationConfig?.speechConfig?.voiceConfig?.prebuiltVoiceConfig) {
                    message.setup.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName = teacher.voice;
                }

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
});
