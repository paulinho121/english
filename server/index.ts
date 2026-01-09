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

wss.on('connection', (clientWs: WebSocket, req) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (PROXY_SECRET && token !== PROXY_SECRET) {
        console.warn('Conexão recusada: Token inválido');
        clientWs.close(4001, 'Unauthorized');
        return;
    }

    console.log('Cliente conectado ao Proxy');

    // Conectar ao Gemini
    const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${API_KEY}`;
    let geminiWs: WebSocket | null = null;

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
            // If the client is still open, we might want to try reconnecting gemini
            // but for Live API, a closed session usually means we need to start over.
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
        if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
            geminiWs.send(data);
        }
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
