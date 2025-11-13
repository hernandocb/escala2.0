# 🧪 Teste Sem Docker (Alternativa)

Se o Docker estiver com problemas de rede, você pode testar localmente:

## 📋 Pré-requisitos

- Python 3.11+ instalado
- Node.js 20+ instalado
- PostgreSQL instalado (ou usar apenas o Docker para o banco)

## 🚀 Opção 1: Apenas Banco no Docker

```powershell
# Iniciar apenas o banco de dados
docker-compose up db -d

# Aguardar inicialização
Start-Sleep -Seconds 10
```

## 🐍 Backend Local

```powershell
# Navegar para backend
cd backend

# Criar ambiente virtual (opcional mas recomendado)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Instalar dependências
pip install -r requirements.txt

# Configurar variável de ambiente
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/escala_db"

# Executar backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## ⚛️ Frontend Local

```powershell
# Navegar para frontend
cd frontend

# Instalar dependências
npm install

# Executar frontend
npm run dev
```

## 🧪 Testar

1. **Backend**: http://localhost:8000
2. **Swagger**: http://localhost:8000/docs
3. **Frontend**: http://localhost:5173

## 📝 Popular Dados

```powershell
# Com backend rodando localmente
cd backend
python populate_test_data.py
```

