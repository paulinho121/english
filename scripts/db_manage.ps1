param (
    [string]$Action,
    [string]$File
)

$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "DATABASE_URL=(.*)") {
            $env:DATABASE_URL = $matches[1]
        }
    }
}

if (-not $env:DATABASE_URL) {
    Write-Host "DATABASE_URL naoo encontrada no arquivo .env." -ForegroundColor Red
    Write-Host "Por favor, adicione DATABASE_URL=postgres://... ao seu arquivo .env para backup/restore do banco."
    exit 1
}

# Tenta encontrar PostgreSQL se nao estiver no PATH
if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
    $pgPaths = @(
        "C:\Program Files\PostgreSQL\18\bin",
        "C:\Program Files\PostgreSQL\17\bin",
        "C:\Program Files\PostgreSQL\16\bin",
        "C:\Program Files\PostgreSQL\15\bin",
        "C:\Program Files\PostgreSQL\14\bin"
    )
    
    foreach ($path in $pgPaths) {
        if (Test-Path $path) {
            Write-Host "PostgreSQL encontrado em: $path" -ForegroundColor Cyan
            $env:PATH = "$path;$env:PATH"
            break
        }
    }
}

$dumpFile = "restore/factory_dump.sql"

if ($Action -eq "backup") {
    Write-Host "Iniciando backup do banco de dados para $dumpFile..."
    if (Get-Command pg_dump -ErrorAction SilentlyContinue) {
        $env:PGPASSWORD = ($env:DATABASE_URL -split ":")[2].Split("@")[0] # Extract password roughly, better parse properly if possible
        # Actually easier to let pg_dump handle connection string directly
        pg_dump $env:DATABASE_URL -f $dumpFile
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Backup realizado com sucesso!" -ForegroundColor Green
        }
        else {
            Write-Host "Falha ao realizar backup via pg_dump." -ForegroundColor Red
        }
    }
    else {
        Write-Host "pg_dump não encontrado. Instale PostgreSQL tools ou adicione ao PATH." -ForegroundColor Red
    }
}
elseif ($Action -eq "restore") {
    Write-Host "Restaurando banco de dados a partir de $dumpFile..."
    if (Test-Path $dumpFile) {
        if (Get-Command psql -ErrorAction SilentlyContinue) {
            # Reset schema public
            echo "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" | psql $env:DATABASE_URL
            psql $env:DATABASE_URL -f $dumpFile
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Restore realizado com sucesso!" -ForegroundColor Green
            }
            else {
                Write-Host "Falha ao restaurar via psql." -ForegroundColor Red
            }
        }
        else {
            Write-Host "psql não encontrado. Instale PostgreSQL tools ou adicione ao PATH." -ForegroundColor Red
        }
    }
    else {
        Write-Host "Arquivo de backup $dumpFile não encontrado!" -ForegroundColor Red
    }
}
elseif ($Action -eq "exec") {
    # Valida se o arquivo SQL foi passado
    if (-not $File) {
        Write-Host "Erro: Você precisa especificar um arquivo SQL. Use: -Action exec -File caminho/para/arquivo.sql" -ForegroundColor Red
        exit 1
    }

    Write-Host "Executando arquivo SQL: $File..."
    if (Test-Path $File) {
        if (Get-Command psql -ErrorAction SilentlyContinue) {
            psql $env:DATABASE_URL -f $File
            if ($LASTEXITCODE -eq 0) {
                Write-Host "SQL executado com sucesso!" -ForegroundColor Green
            }
            else {
                Write-Host "Falha na execução do SQL via psql." -ForegroundColor Red
            }
        }
        else {
            Write-Host "psql não encontrado. Instale PostgreSQL tools ou adicione ao PATH." -ForegroundColor Red
        }
    }
    else {
        Write-Host "Arquivo SQL $File não encontrado!" -ForegroundColor Red
    }
}
else {
    Write-Host "Uso: db_manage.ps1 -Action [backup|restore|exec] [-File migration.sql]"
}
