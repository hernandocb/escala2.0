# Escala 2.0

Sistema de escalas desenvolvido com FastAPI (backend) e React + Vite (frontend).

## 🚀 Início Rápido

### Usando Docker Compose (Recomendado)

```bash
# 1. Iniciar todos os serviços
docker-compose up --build

# 2. Em outro terminal, popular dados de teste
docker-compose exec backend python populate_test_data.py

# 3. Acessar:
#    - Frontend: http://localhost:5173
#    - Backend API: http://localhost:8000
#    - Swagger: http://localhost:8000/docs
```

Ou use o script de inicialização:

```bash
chmod +x iniciar.sh
./iniciar.sh
```

## 📋 Funcionalidades

- ✅ Geração automática de escala seguindo regras de antiguidade
- ✅ Regra D+2 (militar não pode ter escala em 2 dias seguidos)
- ✅ Escalas PRETAS (dias úteis) e VERMELHAS (fins de semana e feriados)
- ✅ Troca de escala com justificativa
- ✅ Gerenciamento de militares, feriados e exceções
- ✅ Interface visual com calendário

## 🏗️ Estrutura do Projeto

```
.
├── backend/          # API FastAPI com SQLModel
│   ├── main.py       # API principal
│   ├── models.py     # Modelos de dados
│   ├── schemas.py    # Schemas de validação
│   ├── create_tables.py
│   └── populate_test_data.py
├── frontend/         # Aplicação React com Vite
│   └── src/
│       ├── App.jsx
│       ├── CalendarioEscala.jsx
│       └── pages/
└── docker-compose.yml
```

## 🛠️ Tecnologias

- **Backend**: FastAPI, SQLModel, PostgreSQL
- **Frontend**: React, Vite, React Router
- **Banco de Dados**: PostgreSQL 15
- **Orquestração**: Docker Compose

## 📖 Como Usar

### 1. Gerar Escala

1. Acesse o frontend: http://localhost:5173
2. Navegue até o mês desejado
3. Clique em "⚡ Gerar Escala do Mês"
4. A escala será gerada automaticamente seguindo as regras:
   - Ordenação por antiguidade (PG e data de promoção)
   - Regra D+2 (não pode ter escala em 2 dias seguidos)
   - Fins de semana e feriados são escalas VERMELHAS

### 2. Trocar Escala

1. Clique em um dia no calendário
2. Selecione o militar substituto
3. Digite a justificativa
4. Clique em "Salvar Troca"

### 3. Gerenciar Dados

- **Militares**: Adicionar/editar militares
- **Feriados**: Cadastrar feriados
- **Exceções**: Cadastrar afastamentos (férias, missões, etc.)

## 🔧 Desenvolvimento

### Backend

```bash
cd backend
pip install -r requirements.txt
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/escala_db"
python create_tables.py
python populate_test_data.py
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🗄️ Banco de Dados

O PostgreSQL é iniciado automaticamente pelo Docker Compose. As credenciais padrão são:

- **Usuário**: postgres
- **Senha**: postgres
- **Database**: escala_db
- **Porta**: 5432

## 📚 API Endpoints

- `GET /health` - Health check
- `GET /militares` - Listar militares (ordenados por antiguidade)
- `POST /militares` - Criar militar
- `PUT /militares/{id}` - Atualizar militar
- `GET /feriados` - Listar feriados
- `POST /feriados` - Criar feriado
- `DELETE /feriados/{id}` - Deletar feriado
- `GET /excecoes` - Listar exceções
- `POST /excecoes` - Criar exceção
- `DELETE /excecoes/{id}` - Deletar exceção
- `GET /escala?mes=X&ano=Y` - Buscar escala do mês
- `POST /escala/gerar` - Gerar escala do mês
- `PUT /escala/troca` - Trocar escala
- `DELETE /escala/mes/{mes}/{ano}` - Deletar escala do mês

Acesse http://localhost:8000/docs para documentação interativa (Swagger).

## ✅ Status

✅ Backend completo e funcional
✅ Frontend completo e funcional
✅ Lógica de geração de escala implementada
✅ Todas as regras de negócio implementadas
✅ Pronto para testes!

