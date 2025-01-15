#!/bin/sh

# Función para esperar a que PostgreSQL esté listo
wait_for_postgres() {
  echo "Waiting for PostgreSQL to start..."
  while ! nc -z postgres 5432; do
    sleep 1
  done
  echo "PostgreSQL started"
}

# Instalar netcat para el check de conexión
apk add --no-cache netcat-openbsd

# Esperar a que PostgreSQL esté listo
wait_for_postgres

# Ejecutar migraciones de Prisma
echo "Running Prisma migrations..."
npx prisma db push

# Crear usuario admin si no existe
echo "Creating admin user..."
node scripts/create-admin.js

# Iniciar la aplicación
echo "Starting Next.js application..."
npm run start 