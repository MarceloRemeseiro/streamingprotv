# StreamingProTV

Plataforma de streaming para eventos en vivo.

## Desarrollo Local

Para desarrollo local, puedes ejecutar:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3003](http://localhost:3003).

## Despliegue con Docker

El proyecto está configurado para ejecutarse en contenedores Docker. Hay varios scripts disponibles para gestionar los contenedores:

### Scripts Disponibles

```bash
# Iniciar solo la base de datos
npm run docker:db:start

# Detener la base de datos
npm run docker:db:stop

# Iniciar solo la aplicación
npm run docker:app:start

# Detener la aplicación
npm run docker:app:stop

# Iniciar todo el sistema (BD + App)
npm run docker:start

# Detener todo el sistema
npm run docker:stop

# Actualizar solo la aplicación (rebuild + restart)
npm run docker:update
```

### Requisitos

- Docker
- Docker Compose
- Node.js 18 o superior

### Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```env
# Database
POSTGRES_USER=streaminguser
POSTGRES_PASSWORD=streamingpass
POSTGRES_DB=streamingdb

# NextAuth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3003

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password

# Docker Config
DB_HOST=postgres
DB_PORT=5432
NODE_ENV=production
PORT=3003
```

## Tecnologías

- Next.js 14
- Prisma ORM
- PostgreSQL
- Docker
- TailwindCSS

## Estructura del Proyecto

```
├── src/
│   ├── app/          # Rutas y páginas
│   ├── components/   # Componentes React
│   ├── lib/          # Utilidades y configuración
│   └── types/        # Tipos TypeScript
├── prisma/          # Esquema y migraciones de BD
├── scripts/         # Scripts de Docker
└── docker-compose.yml
```
