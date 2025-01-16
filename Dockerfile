# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies required for Prisma
RUN apk add --no-cache openssl1.1-compat

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3003

# Start application
CMD ["npm", "start"] 