import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const port = process.env.PORT || 8080;
const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const MODEL = "models/gemini-2.0-flash-exp";

if (!API_KEY) {
    console.error("ERRO: GEMINI_API_KEY não encontrada no .env");
    process.exit(1);
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Simple health check endpoint for Cloud Run
app.get('/', (req, res) => {
    res.send('LinguistAI Proxy is running');
});

wss.on('connection', (clientWs: WebSocket) => {
    console.log('Cliente conectado ao Proxy');

    // Conectar ao Gemini
    const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

    let geminiWs: WebSocket | null = new WebSocket(geminiUrl);

    geminiWs.on('open', () => {
        console.log('Proxy conectado ao Gemini API');

        // Initial setup message if needed, or just ready to pipe
        // clientWs.send(JSON.stringify({ type: 'STATUS', text: 'Connected to AI' }));
    });

    geminiWs.on('message', (data: any) => {
        // Forward message from Gemini to Client
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(data);
        }
    });

    geminiWs.on('close', () => {
        console.log('Gemini fechou a conexão');
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close();
        }
    });

    geminiWs.on('error', (err) => {
        console.error('Erro no Gemini WS:', err);
    });

    // Handle Client Messages
    clientWs.on('message', (data: any) => {
        // Forward message from Client to Gemini
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
    console.log(`LinguistAI Proxy rodando na porta ${port}`);
});
