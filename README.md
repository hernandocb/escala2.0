# Escala 2.0

Sistema de escalas desenvolvido com FastAPI (backend) e React + Vite (frontend).

## Estrutura do Projeto

```
.
├── backend/          # API FastAPI com SQLModel
├── frontend/         # Aplicação React com Vite
└── docker-compose.yml
```

## Tecnologias

- **Backend**: FastAPI, SQLModel, PostgreSQL
- **Frontend**: React, Vite
- **Banco de Dados**: PostgreSQL 15
- **Orquestração**: Docker Compose

## Como Executar

### Pré-requisitos

- Docker e Docker Compose instalados

### Executar com Docker Compose

```bash
# Iniciar todos os serviços
docker-compose up --build

# Executar em background
docker-compose up -d --build

# Parar os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

### Acessar as aplicações

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

### Variáveis de Ambiente

O projeto usa variáveis de ambiente padrão. Para personalizar, crie um arquivo `.env` na raiz do projeto ou configure diretamente no `docker-compose.yml`.

## Desenvolvimento

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Banco de Dados

O PostgreSQL é iniciado automaticamente pelo Docker Compose. As credenciais padrão são:

- **Usuário**: postgres
- **Senha**: postgres
- **Database**: escala_db
- **Porta**: 5432

