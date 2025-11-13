# 🎯 Instruções Finais para Testar o Sistema

## ✅ Status Atual

- ✅ Banco de dados PostgreSQL rodando (porta 5432)
- ✅ Tabelas criadas
- ✅ Dados de teste populados (6 militares + 2 feriados)

## 🚀 Como Iniciar o Backend

Abra um terminal PowerShell e execute:

```powershell
# Navegar para o backend
cd "D:\Documentos\Projetos_Cursor\Escala 2.0\backend"

# Configurar variável de ambiente
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/escala_db"

# Iniciar o servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O backend estará disponível em: **http://localhost:8000**

## 🌐 Acessar o Sistema

### 1. Swagger (Documentação Interativa)
Abra no navegador: **http://localhost:8000/docs**

Aqui você pode testar todos os endpoints interativamente!

### 2. Endpoints Principais

- **GET** `/health` - Verificar se está funcionando
- **GET** `/militares` - Listar militares (já ordenados por antiguidade)
- **POST** `/militares` - Criar novo militar
- **GET** `/escala?mes=12&ano=2024` - Buscar escala do mês
- **POST** `/escala/gerar` - Gerar escala do mês
- **PUT** `/escala/troca` - Trocar quem executa o serviço

## 🧪 Teste Rápido via Swagger

1. Acesse: http://localhost:8000/docs
2. Expanda `POST /escala/gerar`
3. Clique em "Try it out"
4. Digite:
   ```json
   {
     "mes": 12,
     "ano": 2024
   }
   ```
5. Clique em "Execute"
6. A escala será gerada!

## 📊 Dados de Teste Criados

### Militares (6):
1. Silva (TEN1) - promoção 2020-01-15
2. Oliveira (TEN1) - promoção 2020-06-20
3. Almeida (TEN2) - promoção 2022-03-10
4. Paula (TEN2) - promoção 2022-09-05
5. Eduardo (ASP) - promoção 2024-01-08
6. Fernanda (ASP) - promoção 2024-01-15

### Feriados (2):
- 25/12/2024 - Natal
- 01/01/2025 - Ano Novo

## 🎨 Frontend (Opcional)

Para iniciar o frontend:

```powershell
# Navegar para frontend
cd "D:\Documentos\Projetos_Cursor\Escala 2.0\frontend"

# Instalar dependências (primeira vez)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Frontend estará em: **http://localhost:5173**

## ✅ Checklist de Teste

- [x] Banco de dados rodando
- [x] Tabelas criadas
- [x] Dados de teste populados
- [ ] Backend iniciado
- [ ] Swagger acessível
- [ ] Testar GET /militares
- [ ] Testar POST /escala/gerar
- [ ] Testar GET /escala?mes=12&ano=2024
- [ ] Testar PUT /escala/troca
- [ ] Testar frontend (se iniciado)

## 🎉 Pronto para Testar!

Tudo está configurado. Basta iniciar o backend e começar a testar via Swagger!

