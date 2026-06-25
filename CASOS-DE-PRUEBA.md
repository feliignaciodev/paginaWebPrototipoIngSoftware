# Planilla de Casos de Prueba — PoolTech

**Proyecto:** PoolTech - Sistema de Gestion de Mantencion de Piscinas  
**Version:** 1.0  
**Fecha:** 2026-06-25  
**Responsable:** Felipe Sepulveda

---

## 1. Modulo: Login

### Casos de prueba

| ID | Caso de prueba | Precondiciones | Pasos | Datos de prueba | Resultado esperado |
|----|---------------|----------------|-------|-----------------|-------------------|
| CP-01 | Login exitoso con credenciales validas | App corriendo en localhost:5173, usuario no autenticado | 1. Abrir http://localhost:5173 2. Ingresar usuario 3. Ingresar contrasena 4. Clic en "Ingresar" | Usuario: `Admin`, Contrasena: `admin123` | Redirige al Dashboard, sesion activa en sessionStorage |
| CP-02 | Login fallido con usuario incorrecto | App corriendo, usuario no autenticado | 1. Abrir login 2. Ingresar usuario invalido 3. Ingresar contrasena 4. Clic en "Ingresar" | Usuario: `user_falso`, Contrasena: `admin123` | Muestra mensaje "Usuario o contrasena incorrectos" |
| CP-03 | Login fallido con contrasena incorrecta | App corriendo, usuario no autenticado | 1. Abrir login 2. Ingresar usuario correcto 3. Ingresar contrasena incorrecta 4. Clic en "Ingresar" | Usuario: `Admin`, Contrasena: `wrongpass` | Muestra mensaje "Usuario o contrasena incorrectos" |
| CP-04 | Login con campos vacios | App corriendo, usuario no autenticado | 1. Abrir login 2. Dejar campos vacios 3. Intentar clic en "Ingresar" | Usuario: (vacio), Contrasena: (vacio) | Boton "Ingresar" deshabilitado (disabled) |
| CP-05 | Toggle mostrar/ocultar contrasena | App corriendo, usuario en pantalla login | 1. Escribir contrasena 2. Clic en icono ojo | Contrasena: `admin123` | Alterna entre type="password" y type="text" |
| CP-06 | Redireccion si ya esta autenticado | Sesion activa en sessionStorage | 1. Navegar a /login | N/A | Redirige automaticamente al Dashboard |

### Registro de resultados

| ID | Fecha ejecucion | Ejecutor | Estado | Observaciones |
|----|----------------|----------|--------|---------------|
| CP-01 | 2026-06-25 | Felipe Sepulveda | APROBADO | Login correcto, redireccion inmediata al Dashboard |
| CP-02 | 2026-06-25 | Felipe Sepulveda | APROBADO | Mensaje de error se muestra correctamente |
| CP-03 | 2026-06-25 | Felipe Sepulveda | APROBADO | Mensaje de error se muestra correctamente |
| CP-04 | 2026-06-25 | Felipe Sepulveda | APROBADO | Boton deshabilitado cuando campos estan vacios |
| CP-05 | 2026-06-25 | Felipe Sepulveda | APROBADO | Toggle funciona correctamente |
| CP-06 | 2026-06-25 | Felipe Sepulveda | APROBADO | Redireccion automatica funciona |

---

## 2. Modulo: Dashboard

### Casos de prueba

| ID | Caso de prueba | Precondiciones | Pasos | Datos de prueba | Resultado esperado |
|----|---------------|----------------|-------|-----------------|-------------------|
| CP-07 | Carga de datos del dashboard | Usuario autenticado, backend y DB activos | 1. Navegar al Dashboard | Datos semilla en DB | Muestra 4 tarjetas con contadores: Piscinas Activas, Visitas Pendientes, En Progreso, Alertas Quimicos |
| CP-08 | Modal de piscinas activas | Dashboard cargado con piscinas | 1. Clic en tarjeta "Piscinas Activas" | Piscinas activas en DB | Abre modal con lista de piscinas activas, ubicacion, tipo agua, capacidad y resumen de ingresos |
| CP-09 | Modal de visitas pendientes | Dashboard cargado con visitas pendientes | 1. Clic en tarjeta "Visitas Pendientes" | Visitas con estado "pendiente" | Abre modal con lista de visitas pendientes, tecnico asignado, fecha y ubicacion |
| CP-10 | Modal de alertas de stock | Dashboard cargado con alertas | 1. Clic en tarjeta "Alertas Quimicos" | Insumos con stock bajo | Abre modal con barra de progreso, recomendacion de compra y costo estimado |
| CP-11 | Dashboard sin datos | Backend activo, DB sin registros | 1. Navegar al Dashboard | DB vacia (sin piscinas, visitas, insumos) | Muestra contadores en 0, mensaje "Sin visitas registradas" y "Todos los insumos con stock normal" |
| CP-12 | Error de conexion al backend | Backend apagado | 1. Navegar al Dashboard | N/A | Muestra "No se pudieron cargar los datos" |

### Registro de resultados

| ID | Fecha ejecucion | Ejecutor | Estado | Observaciones |
|----|----------------|----------|--------|---------------|
| CP-07 | 2026-06-25 | Felipe Sepulveda | APROBADO | Tarjetas cargan con datos correctos de la DB |
| CP-08 | 2026-06-25 | Felipe Sepulveda | APROBADO | Modal muestra piscinas activas con resumen de ingresos |
| CP-09 | 2026-06-25 | Felipe Sepulveda | APROBADO | Modal muestra detalle de visitas pendientes |
| CP-10 | 2026-06-25 | Felipe Sepulveda | APROBADO | Barra de progreso y recomendacion de compra funcionan |
| CP-11 | 2026-06-25 | Felipe Sepulveda | APROBADO | Contadores en 0, mensajes informativos visibles |
| CP-12 | 2026-06-25 | Felipe Sepulveda | APROBADO | Mensaje de error se muestra correctamente |

---

## 3. Modulo: Clientes

### Casos de prueba

| ID | Caso de prueba | Precondiciones | Pasos | Datos de prueba | Resultado esperado |
|----|---------------|----------------|-------|-----------------|-------------------|
| CP-13 | Crear cliente con datos completos | Usuario autenticado, modulo Clientes | 1. Clic "Nuevo Cliente" 2. Llenar formulario 3. Clic "Crear" | Nombre: `Empresa Test SpA`, Telefono: `+56912345678`, Direccion: `Av. Test 123, Santiago`, Correo: `test@empresa.cl` | Cliente aparece en la tabla, formulario se cierra |
| CP-14 | Crear cliente solo con nombre (campo obligatorio) | Usuario autenticado | 1. Clic "Nuevo Cliente" 2. Llenar solo nombre 3. Clic "Crear" | Nombre: `Cliente Minimo` | Cliente se crea con campos opcionales vacios |
| CP-15 | Crear cliente sin nombre (validacion) | Usuario autenticado | 1. Clic "Nuevo Cliente" 2. Dejar nombre vacio 3. Clic "Crear" | Nombre: (vacio) | Formulario no se envia (campo required del HTML) |
| CP-16 | Editar cliente existente | Cliente existente en la tabla | 1. Clic icono editar en un cliente 2. Modificar campos 3. Clic "Actualizar" | Telefono nuevo: `+56987654321` | Datos actualizados visibles en la tabla |
| CP-17 | Eliminar cliente | Cliente existente sin piscinas asociadas | 1. Clic icono eliminar 2. Confirmar en dialogo | Cliente a eliminar | Cliente desaparece de la tabla |
| CP-18 | Cancelar eliminacion de cliente | Cliente existente | 1. Clic icono eliminar 2. Cancelar en dialogo | N/A | Cliente permanece en la tabla |
| CP-19 | Listado vacio de clientes | DB sin clientes registrados | 1. Navegar a Clientes | N/A | Muestra mensaje "No hay clientes registrados" |

### Registro de resultados

| ID | Fecha ejecucion | Ejecutor | Estado | Observaciones |
|----|----------------|----------|--------|---------------|
| CP-13 | 2026-06-25 | Felipe Sepulveda | APROBADO | Cliente creado y visible en tabla |
| CP-14 | 2026-06-25 | Felipe Sepulveda | APROBADO | Campos opcionales aceptan valores vacios |
| CP-15 | 2026-06-25 | Felipe Sepulveda | APROBADO | Validacion HTML required funciona |
| CP-16 | 2026-06-25 | Felipe Sepulveda | APROBADO | Datos actualizados correctamente |
| CP-17 | 2026-06-25 | Felipe Sepulveda | APROBADO | Cliente eliminado exitosamente |
| CP-18 | 2026-06-25 | Felipe Sepulveda | APROBADO | Cancelar conserva el registro |
| CP-19 | 2026-06-25 | Felipe Sepulveda | APROBADO | Mensaje informativo se muestra |

---

## 4. Modulo: Piscinas

### Casos de prueba

| ID | Caso de prueba | Precondiciones | Pasos | Datos de prueba | Resultado esperado |
|----|---------------|----------------|-------|-----------------|-------------------|
| CP-20 | Crear piscina con datos completos | Al menos 1 cliente en DB | 1. Clic "Nueva Piscina" 2. Seleccionar cliente 3. Llenar formulario 4. Clic "Crear" | Cliente: `Empresa Test SpA`, Capacidad: `25000`, Tipo: `dulce`, Ubicacion: `Patio trasero, casa principal` | Piscina aparece en la tabla con datos correctos |
| CP-21 | Crear piscina tipo agua salada | Al menos 1 cliente en DB | 1. Crear piscina con tipo "Salada" | Tipo: `salada`, Capacidad: `40000` | Badge muestra "Salada" en la tabla |
| CP-22 | Crear piscina tipo agua climatizada | Al menos 1 cliente en DB | 1. Crear piscina con tipo "Climatizada" | Tipo: `climatizada`, Capacidad: `15000` | Badge muestra "Climatizada" en la tabla |
| CP-23 | Editar piscina existente | Piscina existente en tabla | 1. Clic icono editar 2. Modificar capacidad 3. Clic "Actualizar" | Capacidad nueva: `30000` | Capacidad actualizada en la tabla |
| CP-24 | Eliminar piscina | Piscina sin visitas asociadas | 1. Clic icono eliminar 2. Confirmar | N/A | Piscina eliminada de la tabla |
| CP-25 | Ver resumen de piscina | Piscina con visitas registradas | 1. Clic icono resumen (grafico) | N/A | Navega a /piscinas/:id/resumen con informacion de la piscina |
| CP-26 | Crear piscina sin seleccionar cliente | Formulario de nueva piscina abierto | 1. Dejar selector de cliente vacio 2. Clic "Crear" | Cliente: (vacio) | Formulario no se envia (campo required) |

### Registro de resultados

| ID | Fecha ejecucion | Ejecutor | Estado | Observaciones |
|----|----------------|----------|--------|---------------|
| CP-20 | 2026-06-25 | Felipe Sepulveda | APROBADO | Piscina creada con todos los datos |
| CP-21 | 2026-06-25 | Felipe Sepulveda | APROBADO | Tipo "Salada" se muestra con badge cyan |
| CP-22 | 2026-06-25 | Felipe Sepulveda | APROBADO | Tipo "Climatizada" se muestra correctamente |
| CP-23 | 2026-06-25 | Felipe Sepulveda | APROBADO | Capacidad actualizada en tabla |
| CP-24 | 2026-06-25 | Felipe Sepulveda | APROBADO | Piscina eliminada correctamente |
| CP-25 | 2026-06-25 | Felipe Sepulveda | APROBADO | Navegacion a resumen funciona |
| CP-26 | 2026-06-25 | Felipe Sepulveda | APROBADO | Validacion required funciona |

---

## 5. Modulo: Visitas Tecnicas

### Casos de prueba

| ID | Caso de prueba | Precondiciones | Pasos | Datos de prueba | Resultado esperado |
|----|---------------|----------------|-------|-----------------|-------------------|
| CP-27 | Crear visita tecnica | Al menos 1 piscina en DB | 1. Clic "Nueva Visita" 2. Seleccionar piscina 3. Ingresar tecnico, fecha y notas 4. Clic "Crear" | Piscina: seleccionar primera, Tecnico ID: `2`, Fecha: `2026-07-01 10:00`, Notas: `Revision mensual de cloro` | Visita aparece en tabla con estado "Pendiente" |
| CP-28 | Cambiar estado de visita a "En Progreso" | Visita existente con estado "Pendiente" | 1. Clic icono editar 2. Cambiar estado a "En Progreso" 3. Clic "Actualizar" | Estado: `en_progreso` | Badge cambia a azul "En Progreso" |
| CP-29 | Cambiar estado de visita a "Completada" | Visita existente | 1. Clic icono editar 2. Cambiar estado a "Completada" 3. Clic "Actualizar" | Estado: `completada` | Badge cambia a verde "Completada" |
| CP-30 | Eliminar visita | Visita existente en tabla | 1. Clic icono eliminar 2. Confirmar | N/A | Visita eliminada de la tabla |
| CP-31 | Crear visita sin seleccionar piscina | Formulario de nueva visita | 1. Dejar piscina sin seleccionar 2. Clic "Crear" | Piscina: (vacio) | Formulario no se envia (campo required) |
| CP-32 | Editar notas de visita | Visita existente | 1. Clic editar 2. Modificar notas 3. Clic "Actualizar" | Notas nuevas: `Se ajusto pH y se agrego cloro` | Notas actualizadas en la visita |

### Registro de resultados

| ID | Fecha ejecucion | Ejecutor | Estado | Observaciones |
|----|----------------|----------|--------|---------------|
| CP-27 | 2026-06-25 | Felipe Sepulveda | APROBADO | Visita creada con estado pendiente por defecto |
| CP-28 | 2026-06-25 | Felipe Sepulveda | APROBADO | Estado cambia correctamente, badge actualizado |
| CP-29 | 2026-06-25 | Felipe Sepulveda | APROBADO | Transicion de estado funciona correctamente |
| CP-30 | 2026-06-25 | Felipe Sepulveda | APROBADO | Visita eliminada tras confirmacion |
| CP-31 | 2026-06-25 | Felipe Sepulveda | APROBADO | Validacion HTML funciona |
| CP-32 | 2026-06-25 | Felipe Sepulveda | APROBADO | Notas se actualizan correctamente |

---

## 6. Modulo: Inventario de Insumos

### Casos de prueba

| ID | Caso de prueba | Precondiciones | Pasos | Datos de prueba | Resultado esperado |
|----|---------------|----------------|-------|-----------------|-------------------|
| CP-33 | Crear insumo quimico completo | Usuario autenticado, modulo Inventario | 1. Clic "Nuevo Insumo" 2. Llenar formulario 3. Clic "Crear insumo" | Nombre: `Cloro granulado`, Unidad: `kg`, Stock actual: `50`, Stock minimo: `10`, Precio: `8500` | Tarjeta del insumo aparece con estado "Normal" y barra verde |
| CP-34 | Crear insumo liquido | Usuario autenticado | 1. Crear insumo con unidad "litros" | Nombre: `Acido muriatico`, Unidad: `litros`, Stock: `20`, Min: `5`, Precio: `12000` | Tarjeta muestra icono de liquido (gota azul) |
| CP-35 | Crear insumo con stock bajo | Usuario autenticado | 1. Crear insumo con stock <= 1.5x del minimo | Nombre: `Sulfato de cobre`, Stock: `8`, Min: `6`, Precio: `15000` | Tarjeta muestra estado "Bajo" con barra amarilla |
| CP-36 | Crear insumo con stock critico | Usuario autenticado | 1. Crear insumo con stock <= minimo | Nombre: `Floculante`, Stock: `2`, Min: `5`, Precio: `9000` | Tarjeta muestra estado "Critico" con barra roja y borde rojo |
| CP-37 | Editar stock de insumo | Insumo existente | 1. Clic "Editar" en tarjeta 2. Modificar stock 3. Clic "Actualizar" | Stock nuevo: `100` | Stock actualizado, barra de progreso cambia |
| CP-38 | Eliminar insumo | Insumo existente | 1. Clic "Eliminar" 2. Confirmar | N/A | Tarjeta desaparece del grid |
| CP-39 | Inventario vacio | DB sin insumos | 1. Navegar a Inventario | N/A | Muestra icono de paquete y "No hay insumos registrados" |

### Registro de resultados

| ID | Fecha ejecucion | Ejecutor | Estado | Observaciones |
|----|----------------|----------|--------|---------------|
| CP-33 | 2026-06-25 | Felipe Sepulveda | APROBADO | Insumo creado, tarjeta con estado normal |
| CP-34 | 2026-06-25 | Felipe Sepulveda | APROBADO | Icono de liquido (gota azul) se muestra |
| CP-35 | 2026-06-25 | Felipe Sepulveda | APROBADO | Estado "Bajo" con barra amarilla |
| CP-36 | 2026-06-25 | Felipe Sepulveda | APROBADO | Estado "Critico" con barra roja y borde |
| CP-37 | 2026-06-25 | Felipe Sepulveda | APROBADO | Stock y barra actualizados |
| CP-38 | 2026-06-25 | Felipe Sepulveda | APROBADO | Insumo eliminado correctamente |
| CP-39 | 2026-06-25 | Felipe Sepulveda | APROBADO | Mensaje de inventario vacio visible |

---

## 7. Modulo: Resumen de Piscina

### Casos de prueba

| ID | Caso de prueba | Precondiciones | Pasos | Datos de prueba | Resultado esperado |
|----|---------------|----------------|-------|-----------------|-------------------|
| CP-40 | Ver resumen con visitas e insumos | Piscina con visitas completadas y insumos asociados | 1. Ir a Piscinas 2. Clic icono resumen | Piscina con datos de visitas | Muestra info de piscina, totales (visitas, costo) e historial expandible |
| CP-41 | Expandir detalle de visita | Resumen cargado con visitas | 1. Clic en una visita del historial | N/A | Se expande tabla de insumos con cantidad, precio unitario y subtotal |
| CP-42 | Resumen sin visitas | Piscina sin visitas asociadas | 1. Ver resumen de piscina nueva | N/A | Muestra "Sin visitas registradas para esta piscina" |
| CP-43 | Resumen con piscina inexistente | URL con ID invalido | 1. Navegar a /piscinas/99999/resumen | ID: 99999 | Muestra mensaje de error y enlace "Volver a piscinas" |
| CP-44 | Verificar totales de costos | Piscina con multiples visitas e insumos | 1. Ver resumen 2. Verificar suma de costos | N/A | Costo total coincide con la suma de subtotales de todas las visitas |

### Registro de resultados

| ID | Fecha ejecucion | Ejecutor | Estado | Observaciones |
|----|----------------|----------|--------|---------------|
| CP-40 | 2026-06-25 | Felipe Sepulveda | APROBADO | Resumen carga con datos correctos |
| CP-41 | 2026-06-25 | Felipe Sepulveda | APROBADO | Expansion y contraccion funcionan |
| CP-42 | 2026-06-25 | Felipe Sepulveda | APROBADO | Mensaje informativo visible |
| CP-43 | 2026-06-25 | Felipe Sepulveda | APROBADO | Error controlado con enlace de retorno |
| CP-44 | 2026-06-25 | Felipe Sepulveda | APROBADO | Totales coinciden con suma de subtotales |

---

## 8. Modulo: Navegacion y Layout

### Casos de prueba

| ID | Caso de prueba | Precondiciones | Pasos | Datos de prueba | Resultado esperado |
|----|---------------|----------------|-------|-----------------|-------------------|
| CP-45 | Navegacion por sidebar | Usuario autenticado | 1. Clic en cada opcion del sidebar | N/A | Cada enlace navega a la pagina correcta |
| CP-46 | Colapsar sidebar | Usuario autenticado | 1. Clic en boton de colapsar sidebar | N/A | Sidebar se reduce a iconos, contenido principal se expande |
| CP-47 | Logout | Usuario autenticado | 1. Clic en boton "Cerrar sesion" | N/A | Sesion se elimina de sessionStorage, redirige a Login |
| CP-48 | Proteccion de rutas | Usuario no autenticado | 1. Navegar directamente a /clientes | N/A | Redirige a /login |

### Registro de resultados

| ID | Fecha ejecucion | Ejecutor | Estado | Observaciones |
|----|----------------|----------|--------|---------------|
| CP-45 | 2026-06-25 | Felipe Sepulveda | APROBADO | Todas las rutas funcionan correctamente |
| CP-46 | 2026-06-25 | Felipe Sepulveda | APROBADO | Sidebar colapsa y se expande |
| CP-47 | 2026-06-25 | Felipe Sepulveda | APROBADO | Logout limpia sesion y redirige |
| CP-48 | 2026-06-25 | Felipe Sepulveda | APROBADO | Ruta protegida redirige a login |

---

## Resumen de ejecucion

| Metrica | Valor |
|---------|-------|
| Total de casos de prueba | 48 |
| Casos aprobados | 48 |
| Casos fallidos | 0 |
| Porcentaje de exito | 100% |
| Fecha de ejecucion | 2026-06-25 |
| Ambiente | Docker (localhost) |
