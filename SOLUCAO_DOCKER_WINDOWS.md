# 🔧 Solução para Problemas com Docker no Windows

## ❌ Erro: "O sistema não pode encontrar o arquivo especificado"

Este erro significa que:
1. **Docker Desktop não está rodando**, OU
2. **Os containers não foram iniciados ainda**

## ✅ Solução Passo a Passo

### 1. Verificar se Docker Desktop está rodando

Abra o **Docker Desktop** e aguarde até aparecer "Docker Desktop is running" na barra de tarefas.

### 2. Iniciar os containers PRIMEIRO

Você precisa iniciar os containers antes de executar comandos dentro deles:

```powershell
# 1. Navegar para a pasta do projeto
cd "D:\Documentos\Projetos_Cursor\Escala 2.0"

# 2. Iniciar todos os serviços
docker-compose up --build
```

**Aguarde** até ver mensagens como:
- `escala_db exited with code 0`
- `escala_backend exited with code 0`
- `escala_frontend exited with code 0`

Ou melhor ainda, aguarde até ver:
- `Application startup complete` (backend)
- `Local: http://localhost:5173/` (frontend)

### 3. Em OUTRO terminal PowerShell, executar os comandos

**Mantenha o primeiro terminal rodando** e abra um **novo terminal PowerShell**:

```powershell
# Navegar para a pasta do projeto
cd "D:\Documentos\Projetos_Cursor\Escala 2.0"

# Criar tabelas
docker-compose exec backend python create_tables.py

# Popular dados de teste
docker-compose exec backend python populate_test_data.py
```

---

## 🚀 Comandos Completos (Sequência Correta)

### Terminal 1 - Iniciar Serviços:
```powershell
cd "D:\Documentos\Projetos_Cursor\Escala 2.0"
docker-compose up --build
```

### Terminal 2 - Preparar Banco (aguarde ~30 segundos após iniciar):
```powershell
cd "D:\Documentos\Projetos_Cursor\Escala 2.0"
docker-compose exec backend python create_tables.py
docker-compose exec backend python populate_test_data.py
```

---

## 🔍 Verificar se Docker está Funcionando

```powershell
# Verificar se Docker está rodando
docker ps

# Ver todos os containers (incluindo parados)
docker ps -a

# Ver logs
docker-compose logs
```

---

## 🛠️ Alternativa: Executar Sem Docker

Se o Docker continuar dando problema, você pode executar localmente:

### Backend (Terminal 1):
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/escala_db"
python create_tables.py
python populate_test_data.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Terminal 2):
```powershell
cd frontend
npm install
npm run dev
```

**Nota**: Para isso funcionar, você precisa ter PostgreSQL rodando localmente na porta 5432.

---

## ⚠️ Problemas Comuns

### Docker Desktop não inicia:
1. Reinicie o Docker Desktop
2. Verifique se a virtualização está habilitada no BIOS
3. Verifique se o WSL2 está instalado e atualizado

### Porta já em uso:
```powershell
# Ver o que está usando a porta 8000
netstat -ano | findstr :8000

# Ver o que está usando a porta 5173
netstat -ano | findstr :5173
```

### Limpar tudo e começar de novo:
```powershell
docker-compose down -v
docker-compose up --build
```
