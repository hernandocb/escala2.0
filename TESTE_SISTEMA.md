# 🧪 Guia de Teste do Sistema Escala 2.0

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Navegador web (Chrome, Firefox, Edge, etc.)

## 🚀 Iniciando o Sistema

### 1. Iniciar os Containers

```powershell
# Navegar para o diretório do projeto
cd "D:\Documentos\Projetos_Cursor\Escala 2.0"

# Parar containers anteriores (se houver)
docker-compose down -v

# Iniciar todos os serviços
docker-compose up --build -d
```

### 2. Verificar Status dos Containers

```powershell
docker-compose ps
```

Você deve ver 3 containers rodando:
- `escala_db` (PostgreSQL)
- `escala_backend` (FastAPI)
- `escala_frontend` (React + Vite)

### 3. Verificar Logs (se necessário)

```powershell
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## 📝 Popular Dados de Teste

### Opção 1: Via Script Python (Recomendado)

```powershell
# Executar o script de população de dados
docker-compose exec backend python populate_test_data.py
```

### Opção 2: Via API (Swagger)

1. Acesse: http://localhost:8000/docs
2. Use os endpoints para criar:
   - Militares (`POST /militares`)
   - Feriados (`POST /feriados`)
   - Exceções (`POST /excecoes`)

## 🎯 Testando o Sistema

### 1. Acessar o Frontend

Abra no navegador: **http://localhost:5173**

### 2. Acessar a Documentação da API

Abra no navegador: **http://localhost:8000/docs**

### 3. Fluxo de Teste Completo

#### Passo 1: Criar Militares

Via Swagger (`POST /militares`) ou script:

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

Crie pelo menos 3-4 militares com diferentes PGs (TEN1, TEN2, ASP).

#### Passo 2: Criar Feriados (Opcional)

Via Swagger (`POST /feriados`):

```json
{
  "data": "2024-12-25",
  "descricao": "Natal"
}
```

#### Passo 3: Gerar Escala

Via Swagger (`POST /escala/gerar`):

```json
{
  "mes": 12,
  "ano": 2024
}
```

Ou via Frontend: clique em "Gerar Escala" (se implementado) ou use o Swagger.

#### Passo 4: Visualizar Escala

- No Frontend: http://localhost:5173
- O calendário deve mostrar a escala do mês
- Dias VERMELHA (fins de semana/feriados) aparecem com fundo diferente

#### Passo 5: Testar Troca de Escala

1. No calendário, clique em qualquer dia com escala
2. Modal abre mostrando detalhes
3. Selecione um militar substituto no dropdown
4. Preencha a justificativa
5. Clique em "Salvar Troca"
6. Verifique se o ícone 🔁 aparece (indicando troca)

### 4. Endpoints para Testar

#### Backend (http://localhost:8000)

- `GET /` - Status da API
- `GET /health` - Health check
- `GET /militares` - Lista militares (ordenados por antiguidade)
- `POST /militares` - Criar militar
- `PUT /militares/{id}` - Atualizar militar
- `GET /feriados` - Lista feriados
- `POST /feriados` - Criar feriado
- `DELETE /feriados/{id}` - Deletar feriado
- `GET /excecoes` - Lista exceções
- `POST /excecoes` - Criar exceção (férias, missão)
- `DELETE /excecoes/{id}` - Deletar exceção
- `GET /escala?mes=12&ano=2024` - Buscar escala do mês
- `POST /escala/gerar` - Gerar escala do mês
- `PUT /escala/troca` - Trocar quem executa o serviço

## 🔍 Verificações Importantes

### 1. Ordenação por Antiguidade

Ao listar militares (`GET /militares`), verifique:
- TEN1 vem antes de TEN2
- TEN2 vem antes de ASP
- Dentro do mesmo PG, mais antiga promoção vem primeiro

### 2. Regra D+2

- Um militar não pode tirar serviço se executou serviço nos últimos 2 dias
- Teste tentando gerar escala e verifique se a regra é respeitada

### 3. Round-Robin Duplo

- Escala PRETA e VERMELHA têm filas separadas
- Cada tipo mantém seu próprio ponteiro

### 4. Fins de Semana e Feriados

- Sábados e domingos = VERMELHA
- Feriados cadastrados = VERMELHA
- Dias úteis = PRETA

## 🐛 Troubleshooting

### Containers não iniciam

```powershell
# Ver logs detalhados
docker-compose logs

# Reconstruir do zero
docker-compose down -v
docker-compose up --build
```

### Backend não conecta ao banco

- Verifique se o container `escala_db` está rodando
- Verifique a variável `DATABASE_URL` no docker-compose.yml
- Aguarde alguns segundos após iniciar (banco precisa inicializar)

### Frontend não carrega

- Verifique se o container `escala_frontend` está rodando
- Verifique os logs: `docker-compose logs frontend`
- Limpe o cache do navegador

### Erro ao popular dados

- Certifique-se de que o banco está rodando
- Execute: `docker-compose exec backend python populate_test_data.py`
- Se já existem dados, o script não sobrescreve (seguro)

## 📊 Dados de Teste Sugeridos

### Militares (mínimo 4-5)

1. TEN1 - Silva (promoção 2020-01-15)
2. TEN1 - Oliveira (promoção 2020-06-20)
3. TEN2 - Almeida (promoção 2022-03-10)
4. ASP - Eduardo (promoção 2024-01-08)
5. ASP - Fernanda (promoção 2024-01-15)

### Feriados

- 25/12/2024 - Natal
- 01/01/2025 - Ano Novo

## ✅ Checklist de Teste

- [ ] Containers iniciados com sucesso
- [ ] Backend acessível em http://localhost:8000
- [ ] Frontend acessível em http://localhost:5173
- [ ] Swagger funcionando em http://localhost:8000/docs
- [ ] Militares criados e listados corretamente
- [ ] Escala gerada para um mês
- [ ] Calendário mostra a escala no frontend
- [ ] Dias VERMELHA aparecem com cor diferente
- [ ] Troca de escala funciona
- [ ] Ícone de troca aparece quando há substituição
- [ ] Regra D+2 funciona (tentar trocar para militar que executou serviço recente)

## 🎉 Pronto para Testar!

Agora você pode testar o sistema completo. Use o Swagger para testar a API e o frontend para visualizar e interagir com a escala.

