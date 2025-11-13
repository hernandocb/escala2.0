FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm install

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 5173

# Comando para iniciar em modo desenvolvimento
CMD ["npm", "run", "dev"]

