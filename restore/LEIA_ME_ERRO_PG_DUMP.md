# Configuração para Backup/Restore Automático do Banco

O script de automação falhou porque não encontrou o comando `pg_dump` no seu sistema. Para que o backup e a restauração funcionem, você precisa das ferramentas de linha de comando do PostgreSQL.

## Opção A: Instalar Ferramentas (Recomendado para Automação)
Isso permitirá que o comando `./scripts/db_manage.ps1` funcione automaticamente.

1. **Baixe o Instalador**:
   - Acesse: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Escolha a versão para Windows (x86-64).

2. **Instale Apenas as Ferramentas**:
   - Execute o instalador.
   - Quando chegar na tela de seleção de componentes, **DESMARQUE** "PostgreSQL Server", "pgAdmin 4" e "Stack Builder".
   - **MARQUE APENAS** "Command Line Tools".
   - Prossiga e finalize a instalação.

3. **Adicione ao PATH (Se necessário)**:
   - O instalador geralmente faz isso sozinho.
   - Para testar, abra um novo terminal e digite: `pg_dump --version`.

4. **Tente o Backup Novamente**:
   - No terminal do VS Code: `./scripts/db_manage.ps1 -Action backup`

---

## Opção B: Backup Manual (Via Site do Supabase)
Se não quiser instalar nada, você terá que fazer o backup manualmente.

1. Acesse seu projeto no Supabase.
2. Vá em **Database** > **Backups** (ou **Schema Visualizer** > **Export** se disponível no plano free).
3. Se não houver opção direta de download de SQL completo (estrutura + dados) no painel:
   - Você pode ter que rodar o comando SQL manualmente ou usar um cliente externo como DBeaver.
   - **Nota**: O Supabase não oferece dump completo (dados + estrutura) facilmente via UI web no plano gratuito, por isso a **Opção A é muito melhor**.

4. Se conseguir o arquivo `.sql`:
   - Salve-o nesta pasta com o nome: `factory_dump.sql`.
