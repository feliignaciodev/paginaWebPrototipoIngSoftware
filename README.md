# PoolTech - Sistema de Gestión de Mantención de Piscinas

Sistema web para la gestión de servicios técnicos de mantención de piscinas. Permite administrar clientes, piscinas, visitas técnicas, reportes de calidad e inventario de insumos químicos.

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, React Router, Tailwind CSS, Vite |
| Backend | Node.js, Express 4, JWT, bcryptjs |
| Base de datos | PostgreSQL 16 |
| Infraestructura | Docker, Docker Compose |

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) y Docker Compose
- (Opcional) Node.js 18+ para desarrollo local sin Docker

## Inicio rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/feliignaciodev/paginaWebPrototipoIngSoftware.git
cd paginaWebPrototipoIngSoftware

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Levantar todos los servicios
docker compose up --build
```

La aplicación estará disponible en:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| Health check | http://localhost:3000/api/health |

## Variables de entorno

Configurables en el archivo `.env`:

| Variable | Descripción | Default |
|----------|-------------|---------|
| `DB_USER` | Usuario de PostgreSQL | `pool_admin` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `pool_secret_2024` |
| `DB_NAME` | Nombre de la base de datos | `pool_management` |
| `JWT_SECRET` | Clave secreta para tokens JWT | `dev_jwt_secret_change_in_prod` |

## API Endpoints

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |

### Recursos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/clientes` | Listar / crear clientes |
| GET/PUT/DELETE | `/api/clientes/:id` | Obtener / actualizar / eliminar cliente |
| GET/POST | `/api/piscinas` | Listar / crear piscinas |
| GET/PUT/DELETE | `/api/piscinas/:id` | Obtener / actualizar / eliminar piscina |
| GET/POST | `/api/visitas` | Listar / crear visitas técnicas |
| GET/PUT/DELETE | `/api/visitas/:id` | Obtener / actualizar / eliminar visita |
| GET/POST | `/api/inventario` | Listar / crear insumos |
| GET/PUT/DELETE | `/api/inventario/:id` | Obtener / actualizar / eliminar insumo |

## Roles de usuario

| Rol | Descripción |
|-----|-------------|
| `administrador` | Acceso completo al sistema |
| `tecnico` | Gestión de visitas y reportes |
| `cliente` | Consulta de sus piscinas y visitas |

### Usuarios semilla (desarrollo)

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| admin@pooltech.cl | admin123 | administrador |
| carlos@pooltech.cl | admin123 | tecnico |
| maria@pooltech.cl | admin123 | tecnico |

## Estructura del proyecto

```
pool-management/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js              # Entry point
│       ├── server.js             # Configuración Express
│       ├── config/database.js    # Pool de conexión PostgreSQL
│       ├── models/userModel.js   # Modelo de usuarios
│       ├── controllers/          # Lógica de negocio
│       ├── routes/               # Definición de rutas
│       ├── services/             # Consultas a base de datos
│       └── db/init.sql           # Schema y datos semilla
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/           # Componentes reutilizables
        ├── pages/                # Vistas principales
        └── services/api.js       # Cliente HTTP (Axios)
```

## Desarrollo local (sin Docker)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

Requiere una instancia de PostgreSQL corriendo con el schema de `backend/src/db/init.sql`.

## Licencia

Proyecto académico - DuocUC.
