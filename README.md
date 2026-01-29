<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ge-qH88NS34JD7z53oGzG8Oynuyo2aFl

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## 🔐 Proteção de Propriedade Intelectual (IP)

Este projeto implementa múltiplas camadas de proteção para o currículo pedagógico e código:

1.  **Server-Side Prompt Injection:** Todas as instruções de sistema (prompts) detalhadas foram movidas para o servidor proxy. O cliente nunca tem acesso ao texto completo das metodologias.
2.  **UI Hardening:** Proteções contra clique direito, inspeção de elementos (F12) e seleção de texto estão ativas.
3.  **No Source Maps:** O build de produção está configurado para não gerar arquivos `.map`, dificultando a engenharia reversa.
4.  **Database Security (RLS):** Supabase RLS está configurado para garantir que dados de premium e progresso não sejam manipulados via console.

Copyright (c) 2026 Paulinho Fernando. Todos os direitos reservados.
