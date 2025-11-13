FROM python:3.11-slim

WORKDIR /app

# Copiar requirements e instalar dependências Python
# psycopg2-binary não precisa de gcc para compilar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

