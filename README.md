# 🛍️ Tienda de Ropa - Sistema de Gestión

Sistema web completo para gestión de tienda de ropa con control de inventario, ventas y usuarios.

## 📋 Descripción

Plataforma web que permite administrar productos de ropa, registrar ventas y gestionar usuarios con diferentes roles (admin/vendedor). Incluye autenticación JWT, filtros avanzados y reportes de ventas.

## 🚀 Tecnologías

### Backend
- Node.js 18+
- Express 5.1
- MySQL 8.0
- JWT para autenticación
- Bcrypt para encriptación

### Frontend
- React 19
- React Router DOM 7
- Axios
- CSS3

## 📦 Instalación

### Prerequisitos
- Node.js 18 o superior
- MySQL 8.0 o superior
- npm o yarn

### 1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/tienda-ropa.git
cd tienda-ropa
```

### 2. Configurar Base de Datos

```bash
# Conectarse a MySQL
mysql -u root -p

# Ejecutar el script de creación
mysql -u root -p < database/schema.sql
```

### 3. Instalar dependencias

```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 4. Configurar variables de entorno

Crear archivo `backend/.env`:

```env
PORT=3001

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tienda_ropa

JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
```

### 5. Iniciar aplicación

#### Opción A: Iniciar todo junto (recomendado)
```bash
# Desde la raíz del proyecto
npm run dev
```

#### Opción B: Iniciar por separado
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 👤 Usuarios de Prueba

### Administrador
- **Email:** admin@tienda.com
- **Password:** admin123
- **Permisos:** Acceso completo

### Vendedor
- **Email:** juan@tienda.com
- **Password:** admin123
- **Permisos:** Ventas y consulta de productos

## 🗄️ Estructura de Base de Datos

### Tablas

#### usuario
- id_usuario (PK)
- nombre
- email (UNIQUE)
- password (hash)
- rol (admin/vendedor)

#### producto
- id_producto (PK)
- nombre
- descripcion
- precio
- stock
- categoria
- color

#### venta
- id_venta (PK)
- id_usuario (FK)
- fecha
- total

#### detalle_venta
- id_detalle (PK)
- id_venta (FK)
- id_producto (FK)
- cantidad
- precio_unitario

### Diagrama ER

```
┌─────────────┐         ┌──────────────┐
│   usuario   │────1:N──│    venta     │
└─────────────┘         └──────────────┘
                              │ 1:N
                              │
                        ┌─────┴──────────┐
                        │ detalle_venta  │
                        └────────┬───────┘
                                 │ N:1
                                 │
                          ┌──────┴────┐
                          │ producto  │
                          └───────────┘
```

## 📁 Estructura del Proyecto

```
tienda-ropa/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── usuario.model.js
│   │   │   ├── producto.model.js
│   │   │   └── venta.model.js
│   │   └── routes/
│   │       ├── auth.routes.js
│   │       ├── usuarios.routes.js
│   │       ├── productos.routes.js
│   │       └── ventas.routes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   └── ProductoModal.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Registro.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Productos.js
│   │   │   ├── Ventas.js
│   │   │   └── Usuarios.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.js
│   └── package.json
├── database/
│   └── schema.sql
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Autenticación
```
POST /api/auth/login       - Iniciar sesión
POST /api/auth/registro    - Registrar usuario
```

### Usuarios (requiere token)
```
GET    /api/usuarios       - Listar usuarios (admin)
GET    /api/usuarios/:id   - Obtener usuario
PUT    /api/usuarios/:id   - Actualizar usuario
DELETE /api/usuarios/:id   - Eliminar usuario (admin)
```

### Productos
```
GET    /api/productos              - Listar productos (público)
GET    /api/productos/categorias   - Listar categorías
GET    /api/productos/:id          - Obtener producto
POST   /api/productos              - Crear producto (admin)
PUT    /api/productos/:id          - Actualizar producto (admin)
DELETE /api/productos/:id          - Eliminar producto (admin)
```

### Ventas (requiere token)
```
GET    /api/ventas                 - Listar ventas
GET    /api/ventas/estadisticas    - Estadísticas (admin)
GET    /api/ventas/:id             - Obtener venta
POST   /api/ventas                 - Crear venta
```

## 🎨 Funcionalidades

### Para todos los usuarios
- ✅ Login y registro
- ✅ Ver catálogo de productos
- ✅ Filtrar productos por categoría, color y precio
- ✅ Buscar productos por nombre
- ✅ Realizar ventas
- ✅ Ver historial de ventas propias

### Para administradores
- ✅ CRUD completo de productos
- ✅ CRUD completo de usuarios
- ✅ Ver todas las ventas del sistema
- ✅ Estadísticas y reportes
- ✅ Control de stock automático



## 📊 Scripts Disponibles

### Raíz del proyecto
```bash
npm run dev              # Inicia backend y frontend juntos
npm run install:all      # Instala dependencias de todo
npm run start:backend    # Solo backend
npm run start:frontend   # Solo frontend
```

### Backend
```bash
npm start               # Producción
npm run dev            # Desarrollo con nodemon
```

### Frontend
```bash
npm start              # Desarrollo
npm run build          # Build para producción
npm test               # Tests
```

## 🚀 Deploy

### Backend (Render/Heroku)

1. Configurar variables de entorno en la plataforma
2. Conectar repositorio
3. Configurar comando de inicio: `cd backend && npm start`

### Frontend (Vercel/Netlify)

1. Build command: `cd frontend && npm run build`
2. Publish directory: `frontend/build`
3. Configurar variable: `REACT_APP_API_URL=https://tu-api.com/api`

### Base de Datos (PlanetScale/ClearDB)

1. Crear base de datos MySQL
2. Ejecutar script `database/schema.sql`
3. Actualizar variables de entorno con credenciales
