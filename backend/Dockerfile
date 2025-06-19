# Dockerfile para o backend usando Node.js e pnpm
# Base image com Node.js 20
FROM node:20

# Instale o pnpm globalmente
RUN npm install -g pnpm

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json pnpm-lock.yaml tsconfig.json ./

# Instala as dependências
RUN pnpm install --frozen-lockfile

# Copia o restante dos arquivos do projeto
COPY . .

# Constrói o projeto para produção
RUN pnpm run build

# Expõe a porta 3000W
EXPOSE 3000

# Comando para rodar o servidor
CMD ["pnpm", "start"]
