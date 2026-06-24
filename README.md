# PoolTech - Sistema de Gestión de Mantención de Piscinas

Sistema web para la gestión de servicios técnicos de mantención de piscinas. Permite administrar clientes, piscinas, visitas técnicas, reportes de calidad, inventario de insumos químicos y costos por servicio.

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, React Router 7, Tailwind CSS 3, Vite 6 |
| Backend | Node.js 20, Express 4, JWT, bcryptjs |
| Base de datos | PostgreSQL 16 (Alpine) |
| Infraestructura | Docker, Docker Compose |

## Requisitos previos

- [Docker Desktop](https://docs.docker.com/get-docker/) (incluye Docker Compose v2)
- Git

> No necesitas instalar Node.js, PostgreSQL ni ninguna otra dependencia. Docker se encarga de todo.

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

La primera ejecución descarga las imágenes base y construye los contenedores (~2-3 minutos). Las siguientes veces arranca en segundos.

### Verificar que todo está corriendo

```bash
docker compose ps
```

Deberías ver tres servicios con estado `running`:

| Servicio | Puerto | Estado esperado |
|----------|--------|-----------------|
| db | 5432 | running (healthy) |
| backend | 3000 | running |
| frontend | 5173 | running |

### Acceder a la aplicación

| Recurso | URL |
|---------|-----|
| Aplicación web | http://localhost:5173 |
| API REST | http://localhost:3000/api |
| Health check | http://localhost:3000/api/health |

### Credenciales de acceso

| Campo | Valor |
|-------|-------|
| Usuario | `Admin` |
| Contraseña | `admin123` |

## Comandos Docker

Todos se ejecutan desde la raíz del proyecto:

| Acción | Comando |
|--------|---------|
| Levantar la app | `docker compose up` |
| Levantar en segundo plano | `docker compose up -d` |
| Levantar y reconstruir | `docker compose up --build` |
| Ver logs en tiempo real | `docker compose logs -f` |
| Ver logs de un servicio | `docker compose logs -f backend` |
| Ver estado de contenedores | `docker compose ps` |
| Reiniciar un servicio | `docker compose restart frontend` |
| Apagar (conserva datos) | `docker compose down` |
| Apagar y borrar datos (reset completo) | `docker compose down -v` |

## Solución de problemas

### "No se pudieron cargar los datos" en el Dashboard

El backend o la base de datos no están listos. Verifica con:

```bash
docker compose ps
docker compose logs -f backend
```

Si el backend se reinicia en loop, la base de datos puede estar tardando en iniciar. Espera unos segundos y recarga la página.

### Puerto ocupado (address already in use)

Si los puertos 5173, 3000 o 5432 están en uso por otro proceso:

```bash
# Ver qué proceso usa el puerto (ejemplo: 3000)
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

Detén el proceso conflictivo o cambia los puertos en `docker-compose.yml`.

### Reset completo (empezar de cero)

```bash
docker compose down -v
docker compose up --build
```

Esto borra los volúmenes (datos de la DB) y reconstruye todo desde cero. El `init.sql` vuelve a ejecutarse con los datos semilla.

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

### Resumen y costos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/resumen/piscinas/:id` | Resumen de piscina con visitas, insumos y costos |
| GET | `/api/resumen/visitas/:id/insumos` | Insumos utilizados en una visita |
| POST | `/api/resumen/insumos-utilizados` | Registrar uso de insumo (descuenta stock) |
| DELETE | `/api/resumen/insumos-utilizados/:id` | Eliminar registro (restaura stock) |

## Usuarios semilla (desarrollo)

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
├── .env
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js                  # Entry point
│       ├── server.js                 # Configuración Express
│       ├── config/database.js        # Pool de conexión PostgreSQL
│       ├── models/userModel.js       # Modelo de usuarios
│       ├── controllers/              # Lógica de negocio
│       ├── routes/                   # Definición de rutas
│       ├── services/                 # Consultas a base de datos
│       └── db/init.sql               # Schema y datos semilla
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── main.jsx                  # Entry point + AuthProvider
        ├── App.jsx                   # Rutas protegidas
        ├── index.css                 # Animaciones y estilos globales
        ├── context/
        │   └── AuthContext.jsx       # Estado de autenticación (session)
        ├── components/
        │   ├── Layout.jsx            # Sidebar colapsable + logout
        │   ├── Logo.jsx              # Logo SVG animado (sol + agua)
        │   ├── PoolBackground.jsx    # Fondo SVG cartoon del login
        │   └── FormularioReporte.jsx # Reporte de calidad de agua
        ├── pages/
        │   ├── Login.jsx             # Pantalla de inicio de sesión
        │   ├── Dashboard.jsx         # Panel interactivo con modales
        │   ├── ResumenPiscina.jsx    # Resumen con costos por piscina
        │   ├── Clientes.jsx
        │   ├── Piscinas.jsx
        │   ├── Visitas.jsx
        │   └── Inventario.jsx
        └── services/api.js           # Cliente HTTP (Axios)
```

## Desarrollo local (sin Docker)

Requiere Node.js 20+ y PostgreSQL 16+ instalados localmente.

```bash
# 1. Crear la base de datos
psql -U postgres -c "CREATE USER pool_admin WITH PASSWORD 'pool_secret_2024';"
psql -U postgres -c "CREATE DATABASE pool_management OWNER pool_admin;"
psql -U postgres -d pool_management -c "GRANT ALL ON SCHEMA public TO pool_admin;"
psql -U pool_admin -d pool_management -f backend/src/db/init.sql

# 2. Backend (terminal 1)
cd backend
npm install
npm run dev

# 3. Frontend (terminal 2)
cd frontend
npm install
npm run dev
```

## Licencia

Proyecto académico - DuocUC.
