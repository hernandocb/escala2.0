# 🚀 Como Iniciar o Sistema de Escalas

## Opção 1: Usando Docker Compose (Recomendado)

```bash
# 1. Parar containers anteriores (se houver)
docker-compose down -v

# 2. Iniciar todos os serviços
docker-compose up --build

# 3. Em outro terminal, popular dados de teste
docker-compose exec backend python populate_test_data.py

# 4. Acessar:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:8000
# - Swagger: http://localhost:8000/docs
```

## Opção 2: Sem Docker (Desenvolvimento Local)

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- PostgreSQL rodando na porta 5432

### Backend

```bash
cd backend

# Criar ambiente virtual (opcional)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variável de ambiente
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/escala_db"
# Windows PowerShell:
# $env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/escala_db"

# Criar tabelas
python create_tables.py

# Popular dados de teste
python populate_test_data.py

# Iniciar servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🧪 Testar o Sistema

1. **Acessar Swagger**: http://localhost:8000/docs
2. **Testar endpoints**:
   - GET `/militares` - Listar militares
   - POST `/escala/gerar` - Gerar escala (mes=12, ano=2024)
   - GET `/escala?mes=12&ano=2024` - Ver escala gerada
3. **Acessar Frontend**: http://localhost:5173
4. **Gerar escala** pelo botão no calendário
5. **Trocar escala** clicando em um dia

## ✅ Checklist

- [ ] PostgreSQL rodando
- [ ] Tabelas criadas
- [ ] Dados de teste populados
- [ ] Backend rodando na porta 8000
- [ ] Frontend rodando na porta 5173
- [ ] Testar geração de escala
- [ ] Testar troca de escala
