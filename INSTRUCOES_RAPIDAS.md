# ⚡ Instruções Rápidas - Escala 2.0

## 🚀 Iniciar o Sistema

```powershell
# 1. Navegar para o diretório
cd "D:\Documentos\Projetos_Cursor\Escala 2.0"

# 2. Parar containers anteriores
docker-compose down -v

# 3. Iniciar tudo
docker-compose up --build -d

# 4. Aguardar ~30 segundos para inicialização completa
```

## 📝 Popular Dados de Teste

```powershell
# Executar script de população
docker-compose exec backend python populate_test_data.py
```

## 🌐 Acessar o Sistema

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Swagger (Documentação)**: http://localhost:8000/docs

## 🧪 Teste Rápido

1. **Criar Militares** (via Swagger ou script)
2. **Gerar Escala** (POST /escala/gerar com mes=12 e ano=2024)
3. **Visualizar** no frontend (http://localhost:5173)
4. **Trocar Escala** clicando em um dia no calendário

## 📋 Endpoints Principais

- `GET /militares` - Lista militares
- `POST /militares` - Criar militar
- `GET /escala?mes=12&ano=2024` - Buscar escala
- `POST /escala/gerar` - Gerar escala do mês
- `PUT /escala/troca` - Trocar quem executa

## 🔍 Verificar Status

```powershell
# Ver containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down
```

