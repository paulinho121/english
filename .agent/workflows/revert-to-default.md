---
description: Como voltar para a versão padrão (padrão)
---

Se você precisar reverter o código para a versão marcada como "padrão", siga os passos abaixo no terminal:

1. **Garantir que não existam mudanças pendentes** (Opcional, mas recomendado para evitar conflitos):
   ```powershell
   git stash
   ```

2. **Resetar o repositório para a tag `padrão`**:
   // turbo
   ```powershell
   git reset --hard padrão
   ```

3. **(Se necessário) Forçar o push para o repositório remoto**:
   > [!WARNING]
   > Isso irá sobrescrever o histórico no GitHub/GitLab. Use com cautela.
   ```powershell
   git push origin main --force
   ```

4. **Reiniciar o servidor de desenvolvimento**:
   ```powershell
   npm run dev
   ```
