# 🔧 Correção do Erro "uvicorn: executable file not found"

## ✅ Solução Aplicada

Corrigi o Dockerfile para usar `python -m uvicorn` ao invés de apenas `uvicorn`.

## 🚀 Execute Agora:

```powershell
# 1. Parar containers anteriores
docker-compose down

# 2. Reconstruir e iniciar
docker-compose up --build
```

Aguarde até ver:
- `Application startup complete` (backend)
- `Local: http://localhost:5173/` (frontend)

## 📝 Em Outro Terminal (após iniciar):

```powershell
cd "D:\Documentos\Projetos_Cursor\Escala 2.0"
docker-compose exec backend python create_tables.py
docker-compose exec backend python populate_test_data.py
```

## ✅ Verificar se Funcionou:

```powershell
# Ver logs do backend
docker-compose logs backend

# Testar API
curl http://localhost:8000/health
# ou abra no navegador: http://localhost:8000/docs
```
