---
description: Como restaurar para a Versão de Fábrica (Código + Banco de Dados)
---

Este workflow restaura completamente o sistema para a "versão de fábrica" definida (tag `v_fabrica` e backup do banco).

### Pré-requisitos
1. **Ferramentas de Banco de Dados**: Você precisa ter `psql` e `pg_dump` instalados e acessíveis no terminal via PATH (normalmente parte da instalação do PostgreSQL).
2. **Configuração**: O arquivo `.env` deve conter a variável `DATABASE_URL` com a string de conexão do seu banco Supabase (postgres://...).
   - Você pode obter isso no Supabase em: `Settings > Database > Connection String > URI`.

### 1. Criar/Atualizar a Versão de Fábrica (Salvar estado atual)
Se você deseja atualizar o ponto de restauração para o estado ATUAL:

```powershell
# 1. Backup do código
git tag -f v_fabrica
git push origin v_fabrica --force

# 2. Backup do banco de dados
./scripts/db_manage.ps1 -Action backup
```

### 2. Restaurar para a Versão de Fábrica
Para apagar tudo e voltar ao estado original:

> [!CAUTION]
> Isso irá destruir todos os dados atuais do banco de dados e reverter o código.

```powershell
# 1. Restaurar código
git checkout v_fabrica
# Limpar arquivos não rastreados se necessário: git clean -fd

# 2. Restaurar banco de dados
./scripts/db_manage.ps1 -Action restore
```

### Notas
- O arquivo de dump do banco é salvo em `restore/factory_dump.sql`.
- Certifique-se de que a `DATABASE_URL` corresponde ao banco correto.
