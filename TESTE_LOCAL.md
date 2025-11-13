# 🧪 Teste Local (Sem Docker)

Como há problemas de rede no Docker, vamos testar localmente.

## 📋 Pré-requisitos

- Python 3.11+ instalado
- Node.js 20+ instalado
- PostgreSQL instalado (ou usar Docker apenas para o banco)

## 🚀 Opção 1: PostgreSQL via Docker (Recomendado)

### 1. Iniciar apenas o PostgreSQL

```powershell
docker run -d --name escala_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=escala_db -p 5432:5432 postgres:15-alpine
```

### 2. Configurar Backend Local

```powershell
# Navegar para backend
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual (Windows)
venv\Scripts\Activate.ps1

# Instalar dependências
pip install -r requirements.txt

# Executar backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Configurar Frontend Local

```powershell
# Em outro terminal, navegar para frontend
cd frontend

# Instalar dependências
npm install

# Executar frontend
npm run dev
```

## 🚀 Opção 2: Tudo Local (PostgreSQL instalado)

Se você tem PostgreSQL instalado localmente:

1. Criar database: `CREATE DATABASE escala_db;`
2. Ajustar `DATABASE_URL` no `backend/main.py` ou criar `.env`
3. Seguir passos 2 e 3 da Opção 1

## 🧪 Testar Sistema

### 1. Verificar Backend

- Acesse: http://localhost:8000
- Swagger: http://localhost:8000/docs

### 2. Popular Dados

```powershell
# No diretório backend, com venv ativado
python populate_test_data.py
```

### 3. Testar Endpoints

Via Swagger (http://localhost:8000/docs):

1. **Listar Militares**: `GET /militares`
2. **Gerar Escala**: `POST /escala/gerar` com `{"mes": 12, "ano": 2024}`
3. **Buscar Escala**: `GET /escala?mes=12&ano=2024`
4. **Visualizar no Frontend**: http://localhost:5173

## 🔧 Troubleshooting

### Backend não conecta ao banco

Verifique a `DATABASE_URL`:
- Docker: `postgresql://postgres:postgres@localhost:5432/escala_db`
- Local: `postgresql://usuario:senha@localhost:5432/escala_db`

### Frontend não conecta ao backend

Verifique se o backend está rodando na porta 8000 e se o CORS está configurado.

### Erro ao popular dados

Certifique-se de que:
- O banco está rodando
- A `DATABASE_URL` está correta
- As tabelas foram criadas (o backend cria automaticamente na primeira execução)

