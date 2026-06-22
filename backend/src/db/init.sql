-- ============================================================
-- Sistema de Gestión de Servicios Técnicos - Mantención de Piscinas
-- Script de inicialización de base de datos
-- ============================================================

CREATE TYPE rol_usuario AS ENUM ('administrador', 'tecnico', 'cliente');
CREATE TYPE estado_visita AS ENUM ('pendiente', 'en_progreso', 'completada');
CREATE TYPE tipo_agua AS ENUM ('dulce', 'salada', 'climatizada');

-- ============================================================
-- Tabla: usuarios
-- ============================================================
CREATE TABLE usuarios (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(150)    NOT NULL,
    correo          VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    rol             rol_usuario     NOT NULL DEFAULT 'cliente',
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Tabla: clientes
-- ============================================================
CREATE TABLE clientes (
    id                  SERIAL PRIMARY KEY,
    nombre_empresa      VARCHAR(200)    NOT NULL,
    telefono            VARCHAR(20),
    direccion           TEXT,
    correo_contacto     VARCHAR(255),
    usuario_id          INT UNIQUE REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Tabla: piscinas
-- ============================================================
CREATE TABLE piscinas (
    id                      SERIAL PRIMARY KEY,
    cliente_id              INT             NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    capacidad_litros        NUMERIC(12,2)   NOT NULL CHECK (capacidad_litros > 0),
    tipo_agua               tipo_agua       NOT NULL DEFAULT 'dulce',
    ubicacion_detallada     TEXT,
    activa                  BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_piscinas_cliente ON piscinas(cliente_id);

-- ============================================================
-- Tabla: visitas_tecnicas
-- ============================================================
CREATE TABLE visitas_tecnicas (
    id                  SERIAL PRIMARY KEY,
    piscina_id          INT             NOT NULL REFERENCES piscinas(id) ON DELETE CASCADE,
    tecnico_id          INT             NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    fecha_programada    TIMESTAMPTZ     NOT NULL,
    fecha_completada    TIMESTAMPTZ,
    estado              estado_visita   NOT NULL DEFAULT 'pendiente',
    notas               TEXT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_visitas_piscina ON visitas_tecnicas(piscina_id);
CREATE INDEX idx_visitas_tecnico ON visitas_tecnicas(tecnico_id);
CREATE INDEX idx_visitas_estado  ON visitas_tecnicas(estado);

-- ============================================================
-- Tabla: reportes_calidad
-- ============================================================
CREATE TABLE reportes_calidad (
    id                          SERIAL PRIMARY KEY,
    visita_id                   INT             NOT NULL UNIQUE REFERENCES visitas_tecnicas(id) ON DELETE CASCADE,
    ph                          NUMERIC(4,2)    CHECK (ph >= 0 AND ph <= 14),
    cloro                       NUMERIC(6,3)    CHECK (cloro >= 0),
    nivel_agua                  VARCHAR(50),
    observaciones               TEXT,
    evidencias_fotograficas_url TEXT[],
    created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Tabla: inventario_insumos
-- ============================================================
CREATE TABLE inventario_insumos (
    id              SERIAL PRIMARY KEY,
    nombre_quimico  VARCHAR(200)    NOT NULL UNIQUE,
    stock_actual    NUMERIC(10,2)   NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    unidad_medida   VARCHAR(30)     NOT NULL,
    stock_minimo    NUMERIC(10,2)   NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Datos semilla para desarrollo
-- ============================================================

-- Password: admin123 (bcrypt hash)
INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES
    ('Administrador', 'admin@pooltech.cl', '$2a$10$B7iOP0X.8/iqhCqvlnj7g.GrcQIHnqaxh3dohO5DRdaFEGUUXm0/K', 'administrador'),
    ('Carlos Reyes',  'carlos@pooltech.cl', '$2a$10$B7iOP0X.8/iqhCqvlnj7g.GrcQIHnqaxh3dohO5DRdaFEGUUXm0/K', 'tecnico'),
    ('María López',   'maria@pooltech.cl',  '$2a$10$B7iOP0X.8/iqhCqvlnj7g.GrcQIHnqaxh3dohO5DRdaFEGUUXm0/K', 'tecnico');

INSERT INTO clientes (nombre_empresa, telefono, direccion, correo_contacto) VALUES
    ('Condominio Los Álamos',  '+56912345678', 'Av. Las Condes 1234, Santiago',   'contacto@losalamos.cl'),
    ('Hotel Paraíso',          '+56987654321', 'Costanera Norte 567, Viña del Mar', 'reservas@hotelparaiso.cl');

INSERT INTO piscinas (cliente_id, capacidad_litros, tipo_agua, ubicacion_detallada) VALUES
    (1, 50000.00, 'dulce',       'Área recreativa principal, sector oriente'),
    (1, 25000.00, 'climatizada', 'Gimnasio subterráneo, nivel -1'),
    (2, 120000.00, 'salada',     'Terraza piso 3, vista al mar');

INSERT INTO inventario_insumos (nombre_quimico, stock_actual, unidad_medida, stock_minimo) VALUES
    ('Cloro granulado',           50.00, 'kg',     10.00),
    ('Ácido muriático',           30.00, 'litros', 5.00),
    ('Alguicida concentrado',     20.00, 'litros', 5.00),
    ('Sulfato de aluminio',       15.00, 'kg',     3.00),
    ('Regulador de pH (pH+)',     25.00, 'kg',     5.00),
    ('Regulador de pH (pH-)',     25.00, 'kg',     5.00);
