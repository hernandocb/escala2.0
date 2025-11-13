#!/bin/bash

echo "🚀 Iniciando Sistema de Escalas..."

# Verificar se docker-compose está disponível
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose não encontrado!"
    echo "Por favor, instale Docker e Docker Compose ou siga as instruções em INICIAR_SISTEMA.md"
    exit 1
fi

# Parar containers anteriores
echo "📦 Parando containers anteriores..."
$COMPOSE_CMD down -v

# Iniciar serviços
echo "🔨 Construindo e iniciando containers..."
$COMPOSE_CMD up --build -d

# Aguardar banco estar pronto
echo "⏳ Aguardando banco de dados estar pronto..."
sleep 10

# Criar tabelas
echo "📊 Criando tabelas..."
$COMPOSE_CMD exec -T backend python create_tables.py

# Popular dados de teste
echo "👥 Populando dados de teste..."
$COMPOSE_CMD exec -T backend python populate_test_data.py

echo ""
echo "✅ Sistema iniciado com sucesso!"
echo ""
echo "🌐 Acesse:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:8000"
echo "   - Swagger: http://localhost:8000/docs"
echo ""
echo "📋 Para ver logs: docker-compose logs -f"
echo "🛑 Para parar: docker-compose down"
