# 📋 Informações para Testar o Sistema Escala 2.0

## ⚠️ Status Atual

O build do Docker falhou devido a problema de conexão de rede ao baixar pacotes do Debian. Isso é temporário e pode ser resolvido:

1. **Verificar conexão com internet**
2. **Tentar novamente** (o problema pode ser temporário)
3. **Usar proxy/VPN** se necessário

## 🚀 Comandos para Iniciar

### 1. Iniciar o Sistema

```powershell
# Navegar para o diretório
cd "D:\Documentos\Projetos_Cursor\Escala 2.0"

# Parar containers anteriores
docker-compose down -v

# Iniciar tudo (aguarde ~2-3 minutos na primeira vez)
docker-compose up --build -d
```

### 2. Verificar Status

```powershell
# Ver containers
docker-compose ps

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 3. Popular Dados de Teste

```powershell
# Executar script Python
docker-compose exec backend python populate_test_data.py
```

## 🌐 URLs de Acesso

Após os containers iniciarem:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Swagger (Documentação)**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

## 📝 Dados de Teste (via Swagger)

### Criar Militar

**POST** `/militares`

```json
{
  "pg": "TEN1",
  "nome_completo": "João Silva Santos",
  "nome_guerra": "Silva",
  "data_ultima_promocao": "2020-01-15",
  "data_inicio_escala": "2020-01-01",
  "status": "ATIVO"
}
```

Crie pelo menos 4-5 militares com diferentes PGs.

### Criar Feriado

**POST** `/feriados`

```json
{
  "data": "2024-12-25",
  "descricao": "Natal"
}
```

### Gerar Escala

**POST** `/escala/gerar`

```json
{
  "mes": 12,
  "ano": 2024
}
```

### Buscar Escala

**GET** `/escala?mes=12&ano=2024`

### Trocar Escala

**PUT** `/escala/troca`

```json
{
  "escala_dia_id": 1,
  "militar_substituto_id": 2,
  "justificativa": "Troca com Fulano"
}
```

## 🧪 Fluxo de Teste Completo

1. ✅ Iniciar containers: `docker-compose up --build -d`
2. ✅ Aguardar ~30 segundos para inicialização
3. ✅ Popular dados: `docker-compose exec backend python populate_test_data.py`
4. ✅ Acessar Swagger: http://localhost:8000/docs
5. ✅ Verificar militares: `GET /militares`
6. ✅ Gerar escala: `POST /escala/gerar` (mes=12, ano=2024)
7. ✅ Visualizar no frontend: http://localhost:5173
8. ✅ Testar troca: clicar em um dia no calendário

## 🔧 Troubleshooting

### Problema de Rede no Build

Se o build falhar com erro de rede:

1. Verifique sua conexão com internet
2. Tente novamente: `docker-compose up --build -d`
3. Se persistir, pode ser necessário configurar proxy DNS no Docker

### Backend não conecta ao banco

```powershell
# Verificar se o banco está rodando
docker-compose ps

# Ver logs do banco
docker-compose logs db

# Reiniciar apenas o backend
docker-compose restart backend
```

### Frontend não carrega

```powershell
# Ver logs
docker-compose logs frontend

# Reconstruir frontend
docker-compose up --build frontend
```

### Limpar tudo e recomeçar

```powershell
# Parar e remover tudo
docker-compose down -v

# Remover imagens (opcional)
docker system prune -a

# Reconstruir do zero
docker-compose up --build -d
```

## 📊 Estrutura do Banco de Dados

O banco será criado automaticamente quando o backend iniciar. As tabelas são:

- `militar` - Militares cadastrados
- `escaladia` - Escalas geradas (o "cérebro")
- `excecao` - Afastamentos (férias, missões)
- `feriado` - Feriados cadastrados

## ✅ Checklist de Teste

- [ ] Containers iniciados (`docker-compose ps`)
- [ ] Backend acessível (http://localhost:8000)
- [ ] Frontend acessível (http://localhost:5173)
- [ ] Swagger funcionando (http://localhost:8000/docs)
- [ ] Militares criados
- [ ] Escala gerada
- [ ] Calendário mostra escala
- [ ] Troca de escala funciona

## 🎯 Próximos Passos

1. **Resolver problema de rede** (se houver)
2. **Iniciar containers** com `docker-compose up --build -d`
3. **Popular dados** com o script ou via Swagger
4. **Testar funcionalidades** no frontend e backend

## 📞 Informações Importantes

- **Porta Backend**: 8000
- **Porta Frontend**: 5173
- **Porta PostgreSQL**: 5432
- **Usuário BD**: postgres
- **Senha BD**: postgres
- **Database**: escala_db

---

**Nota**: Se o problema de rede persistir, você pode tentar:
- Reiniciar o Docker Desktop
- Verificar configurações de firewall
- Tentar em outro horário (pode ser problema temporário do repositório Debian)

