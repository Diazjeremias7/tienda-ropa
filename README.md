# 🛍️ Tienda de Ropa - Sistema de Gestión

## 👥 Integrantes del Proyecto

- **Jessica Pellegrini**
- **Jeremias Diaz**
- **Pedro Crowley**
- **Dario Colantonio**




Sistema completo de gestión para tienda de ropa con frontend React, backend Node.js/Express y base de datos MySQL.

## 📋 Características

- 🔐 Sistema de autenticación con JWT
- 👥 Gestión de usuarios (Admin y Vendedores)
- 📦 Gestión de productos
- 💰 Sistema de ventas
- 🎨 Interfaz moderna con React

## 🐳 Instalación con Docker (Recomendado)

### Prerrequisitos
- Docker instalado
- Docker Compose instalado

### Pasos para iniciar

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd tienda-ropa
```

2. **Iniciar los contenedores**
```bash
docker-compose up -d
```

Esto iniciará:
- ✅ MySQL en el puerto 3306
- ✅ Backend API en el puerto 3001
- ✅ Frontend React en el puerto 3000

3. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Base de datos: localhost:3306

4. **Ver logs**
```bash
# Ver todos los logs
docker-compose logs -f

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

5. **Detener los contenedores**
```bash
docker-compose down
```

6. **Detener y eliminar volúmenes (borra la base de datos)**
```bash
docker-compose down -v
```

### Reconstruir después de cambios en el código

```bash
docker-compose up -d --build
```

### Script de utilidades

Puedes usar el script `docker.sh` para gestionar los contenedores más fácilmente:

```bash
./docker.sh start    # Iniciar contenedores
./docker.sh stop     # Detener contenedores
./docker.sh restart  # Reiniciar contenedores
./docker.sh logs     # Ver logs (opcional: especificar servicio)
./docker.sh status   # Ver estado de contenedores
./docker.sh build    # Reconstruir imágenes
./docker.sh clean    # Limpiar todo (incluye BD)
./docker.sh db       # Conectar a MySQL
./docker.sh test     # Probar la API
```

## 🔑 Credenciales por defecto

**Usuario Administrador:**
- Email: `admin@tienda.com`
- Password: `admin123`

**Usuario Vendedor:**
- Email: `jere@hotmail.com`
- Password: `1234`


## 📦 Scripts disponibles

### Proyecto raíz
```bash
npm run install:all      # Instala todas las dependencias
npm run dev             # Inicia frontend y backend
npm run start:backend   # Solo backend
npm run start:frontend  # Solo frontend
```

### Backend
```bash
npm start              # Producción
npm run dev           # Desarrollo con nodemon
```

### Frontend
```bash
npm start             # Desarrollo
npm run build         # Build de producción
npm test              # Tests
```

## 🗄️ Base de Datos

### Tablas principales
- `usuario` - Usuarios del sistema
- `producto` - Catálogo de productos
- `venta` - Registro de ventas
- `detalle_venta` - Detalles de cada venta

### Conexión a MySQL con Docker

```bash
# Desde la línea de comandos
docker exec -it tienda_mysql mysql -u tienda_user -ptienda_pass tienda_ropa

# O usando un cliente MySQL
Host: localhost
Port: 3306
User: tienda_user
Password: tienda_pass
Database: tienda_ropa
```

## 🛠️ Tecnologías

### Backend
- Node.js
- Express.js
- MySQL2
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- cors

### Frontend
- React 19
- React Router DOM
- Axios
- CSS3

### DevOps
- Docker
- Docker Compose

## 📁 Estructura del proyecto

```
tienda-ropa/
├── backend/
│   ├── src/
│   │   ├── config/       # Configuraciones
│   │   ├── controllers/  # Controladores
│   │   ├── middlewares/  # Middlewares
│   │   ├── models/       # Modelos
│   │   └── routes/       # Rutas
│   ├── server.js         # Entrada principal
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/        # Páginas
│   │   ├── services/     # Servicios (API)
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── schema.sql        # Esquema de BD
├── docker-compose.yml
└── package.json
```

## 🔧 Configuración

### Variables de entorno - Backend

```env
PORT=3001
DB_HOST=localhost  # o 'mysql' en Docker
DB_USER=tienda_user
DB_PASSWORD=tienda_pass
DB_NAME=tienda_ropa
JWT_SECRET=tu_secreto_jwt
```

### Variables de entorno - Frontend

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🐛 Solución de problemas

### Docker

**Problema:** Los contenedores no inician
```bash
# Ver logs detallados
docker-compose logs

# Reconstruir imágenes
docker-compose build --no-cache
docker-compose up
```

**Problema:** Error de conexión a MySQL
```bash
# Verificar que MySQL esté saludable
docker-compose ps

# Reiniciar solo MySQL
docker-compose restart mysql
```

**Problema:** Puerto en uso
```bash
# Cambiar puertos en docker-compose.yml
# O detener otros servicios en esos puertos
```

### Desarrollo local

**Problema:** Error de conexión backend-MySQL
- Verificar que MySQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos exista

**Problema:** Error CORS
- Verificar configuración de CORS en `backend/server.js`
- Verificar URL del API en frontend

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Ventas
- `GET /api/ventas` - Listar ventas
- `POST /api/ventas` - Crear venta
- `GET /api/ventas/:id` - Detalle de venta

