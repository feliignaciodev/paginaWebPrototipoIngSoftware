# Prototipo Funcional — PoolTech

## Descripcion del sistema

**PoolTech** es un sistema web de gestion de servicios tecnicos de mantencion de piscinas. Permite administrar clientes, piscinas, visitas tecnicas, reportes de calidad del agua, inventario de insumos quimicos y costos por servicio.

## Acceso al prototipo

| Recurso | URL / Instruccion |
|---------|-------------------|
| Repositorio GitHub | https://github.com/feliignaciodev/paginaWebPrototipoIngSoftware |
| Aplicacion web (local) | http://localhost:5173 |
| API REST | http://localhost:3000/api |
| Health check | http://localhost:3000/api/health |

### Instrucciones para ejecutar

```bash
git clone https://github.com/feliignaciodev/paginaWebPrototipoIngSoftware.git
cd paginaWebPrototipoIngSoftware
cp .env.example .env
docker compose up --build
```

### Credenciales de acceso

| Campo | Valor |
|-------|-------|
| Usuario | `Admin` |
| Contrasena | `admin123` |

## Stack tecnologico

| Capa | Tecnologia |
|------|-----------|
| Frontend | React 18, React Router 7, Tailwind CSS 3, Vite 6 |
| Backend | Node.js 20, Express 4, JWT, bcryptjs |
| Base de datos | PostgreSQL 16 (Alpine) |
| Infraestructura | Docker, Docker Compose |

## Modulos del prototipo

### 1. Login (Autenticacion)

- Pantalla de inicio de sesion con logo animado (sol + agua) y fondo SVG
- Validacion de credenciales (usuario y contrasena)
- Toggle para mostrar/ocultar contrasena
- Feedback visual de errores y estado de carga (spinner)
- Redireccion automatica al Dashboard tras login exitoso

### 2. Dashboard (Panel principal)

- **4 tarjetas de resumen interactivas**: Piscinas Activas, Visitas Pendientes, En Progreso, Alertas Quimicos
- Cada tarjeta abre un **modal con detalle** al hacer clic
- Panel de **Ultimas Visitas** con estado (Pendiente, En Progreso, Completada)
- Panel de **Alertas de Insumos** con barra de progreso y estado (Critico, Bajo, Normal)
- Modal de alertas incluye **recomendacion de compra** con costo estimado
- Modal de piscinas incluye **resumen de ingresos** mensuales y proyeccion anual

### 3. Clientes (CRUD completo)

- Listado en tabla con nombre, telefono, direccion y correo
- Formulario para crear/editar cliente con campos: nombre empresa, telefono, direccion, correo
- Eliminacion con confirmacion
- Validacion de campo requerido (nombre empresa)

### 4. Piscinas (CRUD completo)

- Listado en tabla con cliente, capacidad, tipo de agua y ubicacion
- Formulario con selector de cliente, capacidad en litros, tipo de agua (dulce/salada/climatizada) y ubicacion
- Boton para ver **Resumen de Piscina** con historial de visitas e insumos
- Eliminacion con confirmacion

### 5. Visitas Tecnicas (CRUD completo)

- Listado en tabla con cliente, tecnico, fecha programada y estado
- Creacion con selector de piscina, ID tecnico, fecha/hora y notas
- Edicion permite cambiar estado (pendiente → en_progreso → completada) y notas
- Badges de estado con colores diferenciados

### 6. Inventario de Insumos (CRUD completo)

- Vista en **tarjetas** (cards) con indicador visual de tipo (liquido/solido)
- Barra de progreso de stock con estados: Normal (verde), Bajo (amarillo), Critico (rojo)
- Datos por tarjeta: stock actual, minimo, precio unitario, porcentaje de llenado
- Formulario con nombre, unidad de medida (kg, litros, unidades, gramos, ml), stock actual, stock minimo y precio
- Eliminacion con confirmacion

### 7. Resumen de Piscina (Vista de detalle)

- Informacion de la piscina: capacidad, tipo de agua, estado, cliente
- Tarjetas de totales: visitas realizadas, visitas pendientes, costo total de insumos
- Historial de visitas expandible con detalle de insumos utilizados por visita
- Tabla de insumos: nombre, cantidad usada, precio unitario y subtotal
- Total de costo por visita y costo general

### 8. Sidebar y Layout

- Sidebar colapsable con navegacion a todos los modulos
- Logo PoolTech con animacion
- Boton de logout
- Responsive (colapsa en pantallas pequenas)

## Usuarios semilla (datos de prueba)

| Correo | Contrasena | Rol |
|--------|-----------|-----|
| admin@pooltech.cl | admin123 | Administrador |
| carlos@pooltech.cl | admin123 | Tecnico |
| maria@pooltech.cl | admin123 | Tecnico |
