# 📋 Comandos para Executar o Sistema

## 🐳 Opção 1: Docker Compose (Recomendado)

### Iniciar tudo de uma vez:
```bash
docker-compose up --build
```

### Em outro terminal, preparar banco:
```bash
# Criar tabelas
docker-compose exec backend python create_tables.py

# Popular dados de teste
docker-compose exec backend python populate_test_data.py
```

### Comandos úteis:
```bash
# Ver logs
docker-compose logs -f

# Ver logs apenas do backend
docker-compose logs -f backend

# Ver logs apenas do frontend
docker-compose logs -f frontend

# Parar tudo
docker-compose down

# Parar e remover volumes (limpar banco)
docker-compose down -v

# Reiniciar apenas um serviço
docker-compose restart backend
docker-compose restart frontend
```

### Acessos:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Swagger (Documentação)**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

---

## 💻 Opção 2: Execução Local (Sem Docker)

### Pré-requisitos:
- Python 3.11+
- Node.js 20+
- PostgreSQL rodando na porta 5432

### Backend:

```bash
# 1. Navegar para o backend
cd backend

# 2. Criar ambiente virtual (opcional)
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# Windows PowerShell: venv\Scripts\activate

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Configurar variável de ambiente
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/escala_db"
# Windows PowerShell:
# $env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/escala_db"

# 5. Criar tabelas
python create_tables.py

# 6. Popular dados de teste (opcional)
python populate_test_data.py

# 7. Iniciar servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend estará em**: http://localhost:8000

---

### Frontend:

```bash
# 1. Navegar para o frontend
cd frontend

# 2. Instalar dependências (apenas na primeira vez)
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

**Frontend estará em**: http://localhost:5173

---

## 🔧 Comandos de Desenvolvimento

### Backend:
```bash
# Rodar testes (se houver)
pytest

# Verificar código
flake8 backend/
black --check backend/

# Formatar código
black backend/
```

### Frontend:
```bash
# Build para produção
npm run build

# Preview do build
npm run preview

# Verificar dependências desatualizadas
npm outdated
```

---

## 🐛 Troubleshooting

### Backend não conecta ao banco:
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps db

# Ver logs do banco
docker-compose logs db

# Testar conexão manualmente
docker-compose exec backend python -c "from sqlmodel import create_engine; engine = create_engine('postgresql://postgres:postgres@db:5432/escala_db'); print('OK')"
```

### Frontend não carrega:
```bash
# Limpar cache do npm
rm -rf node_modules package-lock.json
npm install

# Verificar se backend está rodando
curl http://localhost:8000/health
```

### Porta já em uso:
```bash
# Ver o que está usando a porta
lsof -i :8000  # Backend
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL

# Matar processo (substitua PID pelo número do processo)
kill -9 PID
```

---

## 📝 Resumo Rápido

### Docker (Mais Fácil):
```bash
docker-compose up --build
# Em outro terminal:
docker-compose exec backend python create_tables.py
docker-compose exec backend python populate_test_data.py
```

### Local:
```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/escala_db"
python create_tables.py
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```
