FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Limpiar cache de npm
RUN npm cache clean --force

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install --verbose

# Copiar archivos de configuración
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Copiar el código fuente
COPY src ./src
COPY scripts ./scripts

# Generar Prisma Client
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Dar permisos al script de entrada
RUN chmod +x scripts/docker-entrypoint.sh

# Iniciar la aplicación
ENTRYPOINT ["./scripts/docker-entrypoint.sh"] 