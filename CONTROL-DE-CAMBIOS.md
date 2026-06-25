# Planilla de Control de Cambios — PoolTech

**Proyecto:** PoolTech - Sistema de Gestion de Mantencion de Piscinas  
**Version:** 1.0  
**Fecha:** 2026-06-25  
**Responsable:** Felipe Sepulveda

---

## Registro de cambios

| ID | Fecha | Commit | Descripcion del cambio | Modulos afectados | Tipo de cambio | Responsable | Estado | Justificacion |
|----|-------|--------|----------------------|-------------------|---------------|-------------|--------|---------------|
| CC-01 | 2026-06-22 | `46513eb` | Commit inicial del repositorio | Todo el proyecto | Creacion | Felipe Sepulveda | Implementado | Inicio del proyecto, estructura base del repositorio |
| CC-02 | 2026-06-22 | `f4b9bf1` | Setup inicial del proyecto: estructura de carpetas, Docker Compose, backend Express, frontend React, base de datos PostgreSQL con schema y datos semilla | Backend, Frontend, DB, Docker | Creacion | Felipe Sepulveda | Implementado | Establecer la arquitectura base del sistema con todos los servicios containerizados |
| CC-03 | 2026-06-22 | `9f68a91` | Actualizacion del README con documentacion completa: tech stack, instrucciones de instalacion, endpoints API, estructura de proyecto | Documentacion | Documentacion | Felipe Sepulveda | Implementado | Documentar el proyecto para facilitar onboarding y uso por parte del equipo |
| CC-04 | 2026-06-22 | `345ab6e` | Rediseno del Dashboard con tarjetas interactivas y creacion del componente FormularioReporte para reportes de calidad del agua | Frontend (Dashboard, FormularioReporte) | Mejora | Felipe Sepulveda | Implementado | Mejorar la experiencia del usuario en el panel principal con visualizacion de datos mas clara |
| CC-05 | 2026-06-22 | `e8402ff` | Correccion del hash bcrypt en datos semilla y healthcheck de PostgreSQL en Docker | Backend, DB, Docker | Correccion | Felipe Sepulveda | Implementado | Los datos semilla tenian hashes bcrypt invalidos que impedian el login, y el healthcheck de la DB no funcionaba correctamente |
| CC-06 | 2026-06-22 | `3b386e9` | Implementacion del modulo de resumen de piscina con insumos utilizados y costos por visita. Nuevos endpoints API: resumen de piscina, insumos por visita, registro/eliminacion de insumos utilizados | Backend (API, servicios), Frontend (ResumenPiscina) | Nueva funcionalidad | Felipe Sepulveda | Implementado | Permitir al administrador ver el historial de insumos y costos asociados a cada piscina |
| CC-07 | 2026-06-22 | `2359373` | Creacion del logo SVG animado (sol + agua), animaciones CSS globales y branding visual del sistema | Frontend (Logo, index.css) | Mejora | Felipe Sepulveda | Implementado | Establecer la identidad visual del sistema con branding profesional |
| CC-08 | 2026-06-22 | `4b2233f` | Actualizacion del README con comandos Docker y documentacion de endpoints de resumen | Documentacion | Documentacion | Felipe Sepulveda | Implementado | Documentar los nuevos endpoints de resumen y los comandos Docker mas comunes |
| CC-09 | 2026-06-22 | `4cae978` | Agregar tabla de comandos esenciales al README | Documentacion | Documentacion | Felipe Sepulveda | Implementado | Facilitar la referencia rapida de comandos Docker para el equipo |
| CC-10 | 2026-06-23 | `359916a` | Implementacion del login con validacion, Dashboard interactivo con modales de detalle (piscinas activas, visitas pendientes, alertas de stock con recomendacion de compra), sidebar colapsable y README definitivo | Frontend (Login, Dashboard, Layout, PoolBackground), Documentacion | Nueva funcionalidad + Mejora | Felipe Sepulveda | Implementado | Completar la interfaz del sistema con autenticacion, panel interactivo y navegacion profesional |

---

## Resumen por tipo de cambio

| Tipo | Cantidad |
|------|----------|
| Creacion | 2 |
| Nueva funcionalidad | 2 |
| Mejora | 2 |
| Correccion | 1 |
| Documentacion | 3 |
| **Total** | **10** |

---

## Resumen por modulo afectado

| Modulo | Cambios relacionados |
|--------|---------------------|
| Frontend - Login | CC-10 |
| Frontend - Dashboard | CC-04, CC-10 |
| Frontend - Layout / Sidebar | CC-10 |
| Frontend - Logo / Branding | CC-07 |
| Frontend - ResumenPiscina | CC-06 |
| Frontend - FormularioReporte | CC-04 |
| Frontend - PoolBackground | CC-10 |
| Backend - API | CC-02, CC-06 |
| Backend - Servicios | CC-06 |
| Base de datos | CC-02, CC-05 |
| Docker | CC-02, CC-05 |
| Documentacion | CC-03, CC-08, CC-09, CC-10 |

---

## Control de versiones

| Version | Fecha | Descripcion | Commits incluidos |
|---------|-------|-------------|-------------------|
| 0.1.0 | 2026-06-22 | Setup inicial con estructura base | CC-01, CC-02 |
| 0.2.0 | 2026-06-22 | Dashboard, reportes y correccion de datos semilla | CC-03, CC-04, CC-05 |
| 0.3.0 | 2026-06-22 | Resumen de piscinas con costos y branding visual | CC-06, CC-07, CC-08, CC-09 |
| 1.0.0 | 2026-06-23 | Login, Dashboard interactivo con modales, sidebar colapsable | CC-10 |
