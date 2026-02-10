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


### Tallas
- `GET /api/tallas` - Listar todas las tallas
- `GET /api/tallas/producto/:id` - Obtener tallas de un producto  
- `POST /api/tallas` - Crear talla (admin)
- `POST /api/tallas/producto` - Agregar talla a producto (admin)
- `PUT /api/tallas/producto/:id` - Actualizar stock de talla (admin)
- `DELETE /api/tallas/producto/:id` - Eliminar talla de producto (admin)

### Reportes
- `GET /api/reportes/dashboard` - Estadísticas del dashboard
- `GET /api/reportes/ventas-periodo` - Ventas por período (query: dias)
- `GET /api/reportes/productos-mas-vendidos` - Top productos (query: limite)
- `GET /api/reportes/ventas-por-categoria` - Ventas agrupadas por categoría
- `GET /api/reportes/ventas-por-vendedor` - Ranking de vendedores (query: dias)
- `GET /api/reportes/stock-bajo` - Productos con stock bajo/crítico
- `GET /api/reportes/tallas-mas-vendidas` - Estadísticas de tallas
- `GET /api/reportes/ventas-por-mes` - Ventas mensuales (últimos 12 meses)

---

## 🎯 AGREGADOS PARA APROBACIÓN FINAL

### ✅ 1. Sistema de Tallas Completo

**Descripción:** Sistema integral para gestionar productos por tallas con stock independiente para cada una.

#### Base de Datos:
- ✅ **Tabla `talla`**: Almacena las tallas disponibles (XS, S, M, L, XL, XXL, Único)
- ✅ **Tabla `producto_talla`**: Relación muchos a muchos entre productos y tallas con stock independiente
- ✅ **Campo `id_talla` en `detalle_venta`**: Registra qué talla se vendió en cada transacción
- ✅ **Campo `stock_minimo` en tabla `producto`**: Define umbral de alerta para cada producto

#### Backend - API:
- ✅ **CRUD completo de tallas** (`/api/tallas`)
- ✅ **Gestión de tallas por producto** con validaciones de stock
- ✅ **Endpoints actualizados** en productos y ventas para soportar tallas
- ✅ **Validación de stock por talla** al realizar ventas
- ✅ **Actualización automática de stock** tanto general como por talla

#### Frontend - Interfaz:
- ✅ **Selector visual de tallas** en página Nueva Venta
- ✅ **Botones de tallas** con estados:
  - Verde/azul: Disponible
  - Gris: Sin stock (deshabilitado)
  - Indicador naranja (!): Stock bajo (≤3 unidades)
- ✅ **Visualización de tallas** en carrito de compra
- ✅ **Validación en tiempo real** de stock disponible por talla
- ✅ **Lista de tallas** con stock en detalle de productos

#### Beneficios:
- Control preciso de inventario por talla
- Evita ventas de productos sin stock
- Facilita la gestión de pedidos y reposición
- Mejora la experiencia de usuario al mostrar disponibilidad real

---

### ✅ 2. Reportes y Estadísticas Avanzadas

**Descripción:** Sistema completo de reportes con visualizaciones gráficas para análisis de negocio.

#### Backend - Nuevos Endpoints:
1. **Dashboard Estadístico** (`/api/reportes/dashboard`):
   - Total de ventas y monto acumulado
   - Total de productos en catálogo
   - Cantidad de vendedores activos
   - Ventas del día actual con monto
   - Contador de productos con stock bajo

2. **Ventas por Período** (`/api/reportes/ventas-periodo?dias=30`):
   - Ventas diarias agrupadas
   - Cantidad y monto por día
   - Configurable por período (7, 30, 60, 90 días)

3. **Productos Más Vendidos** (`/api/reportes/productos-mas-vendidos?limite=10`):
   - Top productos con mayor cantidad vendida
   - Ingresos totales por producto
   - Ranking con límite configurable

4. **Ventas por Categoría** (`/api/reportes/ventas-por-categoria`):
   - Ingresos totales por categoría
   - Cantidad de unidades vendidas
   - Porcentaje del total de ventas

5. **Ranking de Vendedores** (`/api/reportes/ventas-por-vendedor?dias=30`):
   - Cantidad de ventas por vendedor
   - Monto total vendido
   - Filtrable por período

6. **Productos con Stock Bajo** (`/api/reportes/stock-bajo`):
   - Lista de productos críticos
   - Comparación stock actual vs. stock mínimo
   - Flag de alerta crítica

7. **Tallas Más Vendidas** (`/api/reportes/tallas-mas-vendidas`):
   - Estadísticas de popularidad de tallas
   - Cantidad de ventas por talla
   - Unidades totales vendidas

8. **Ventas Mensuales** (`/api/reportes/ventas-por-mes`):
   - Resumen de últimos 12 meses
   - Cantidad y monto por mes
   - Formato YYYY-MM

#### Frontend - Nueva Página de Reportes:

**Ubicación:** `/reportes` en menú principal

**Sección 1: Ventas por Categoría** (Destacada)
- 📊 Tabla completa con todas las categorías
- 📈 Barras de progreso con porcentajes
- 💰 Total de unidades vendidas y monto general
- 🏆 Ranking numérico de categorías

**Sección 2: Ranking de Vendedores**
- 👥 Lista de todos los vendedores
- 🥇🥈🥉 Medallas para top 3 vendedores
- 📅 Selector de período (7, 30, 90 días)
- 💵 Cantidad de ventas y monto total

**Sección 3: Ventas por Día**
- 📊 Gráfico de barras vertical
- 📈 Visualización de últimas 2 semanas
- 🎨 Altura proporcional a montos
- 🔄 Selector de período (7, 30, 60 días)
- 💡 Tooltip con monto al pasar mouse

**Sección 4: Tallas Más Vendidas**
- 📏 Lista de todas las tallas
- 📊 Barras de progreso horizontales
- 🔢 Unidades vendidas por talla
- 🎨 Diseño visual atractivo

#### Estilos y UX:
- ✅ Diseño responsivo (mobile-friendly)
- ✅ Colores coherentes con tema de la aplicación
- ✅ Animaciones suaves en gráficos
- ✅ Loading states
- ✅ Grid layout adaptativo

#### Beneficios:
- Toma de decisiones basada en datos
- Identificación de productos estrella
- Evaluación de desempeño de vendedores
- Planificación de inventario informada
- Detección de tendencias de ventas

---

### ✅ 3. Sistema de Alertas de Stock Inteligente

**Descripción:** Sistema automático de notificación y seguimiento de productos con stock crítico.

#### Base de Datos:
- ✅ **Campo `stock_minimo`** en tabla `producto`:
  - Valor por defecto: 5 unidades
  - Configurable por producto
  - Umbral para activar alertas

#### Backend - Lógica:
- ✅ **Comparación automática** stock actual vs. stock mínimo
- ✅ **Flag `tiene_stock_bajo`** en respuestas de API
- ✅ **Flag `alerta_critica`** cuando stock = 0
- ✅ **Endpoint dedicado** `/api/reportes/stock-bajo`
- ✅ **Integración** en endpoint de dashboard
- ✅ **Ordenamiento** por nivel de criticidad (stock ASC)

#### Frontend - Dashboard Mejorado:

**Banner de Alerta Destacado:**
- ⚠️ **Posición superior** visible inmediatamente
- 🎨 **Color amarillo** con borde naranja
- 📊 **Contador dinámico** de productos afectados
- 💫 **Animación de pulso** para llamar la atención
- 🖱️ **Clickable** para expandir detalles

**Tabla Expandible de Productos Críticos:**
- 📋 **Listado completo** con scroll si necesario
- 🔴 **Highlight en rojo** para productos sin stock
- 🏷️ **Badges de estado**:
  - Sin stock (rojo) - 0 unidades
  - Crítico (amarillo) - stock ≤ stock_mínimo
  - Bajo (azul) - cerca del mínimo
- 📊 **Columnas informativas**:
  - Nombre del producto (con link)
  - Categoría
  - Stock actual
  - Stock mínimo
  - Estado visual
- ✖️ **Botón cerrar** para ocultar panel

**Estadística en Dashboard:**
- 📈 **Card especial** en stats-grid
- 🔢 **Contador visible** de productos críticos
- 🎯 **Link directo** a listado completo

#### Frontend - Nueva Venta Mejorada:

**Indicadores Visuales:**
- ⚠️ **Badge "Stock bajo"** en productos afectados
- 🔴 **Tallas deshabilitadas** cuando stock = 0
- ❗ **Indicador "!"** en botones de tallas con pocas unidades (≤3)
- 🎨 **Colores diferenciados**:
  - Verde/Azul: Stock normal
  - Amarillo: Stock bajo
  - Gris: Sin stock

**Validaciones:**
- ✅ **Bloqueo de compra** si no hay stock
- ✅ **Mensaje de error** claro y específico
- ✅ **Límite de cantidad** según stock real

#### Beneficios:
- ⏰ Alerta temprana de reposición necesaria
- 📉 Prevención de quiebres de stock
- 💼 Mejora en gestión de inventario
- 🎯 Priorización de pedidos a proveedores
- 📊 Dashboard más informativo y útil
- 🚫 Evita promesas de venta sin producto

---

### 📊 Resumen de Impacto

**Base de Datos:**
- ✅ 2 tablas nuevas (talla, producto_talla)
- ✅ 2 campos nuevos (stock_minimo, id_talla en detalle_venta)
- ✅ Datos de ejemplo precargados

**Backend:**
- ✅ 2 archivos de rutas nuevos (tallas.routes.js, reportes.routes.js)
- ✅ 1 archivo actualizado (server.js)
- ✅ 16 endpoints nuevos
- ✅ 4 endpoints mejorados

**Frontend:**
- ✅ 2 páginas nuevas (Reportes.js, Reportes.css)
- ✅ 4 páginas actualizadas (Dashboard, NuevaVenta, App, Layout)
- ✅ 1 servicio actualizado (api.js con 12 funciones nuevas)
- ✅ 4 archivos CSS actualizados
- ✅ Ruta nueva en navegación

**Testing:**
- ✅ Guía completa de testing (TESTING.md)
- ✅ Plan de pruebas por funcionalidad
- ✅ Instrucciones Docker y manual
- ✅ Checklist de verificación

---

### 🚀 Valor Agregado al Proyecto

1. **Profesionalismo:**
   - Sistema más completo y robusto
   - Funcionalidades de nivel empresarial
   - Código bien estructurado y documentado

2. **Funcionalidad:**
   - Control total de inventario por talla
   - Toma de decisiones basada en datos
   - Alertas proactivas de gestión

3. **Experiencia de Usuario:**
   - Interfaz más informativa
   - Visualizaciones atractivas
   - Flujo de trabajo optimizado

4. **Gestión de Negocio:**
   - Reportes ejecutivos
   - KPIs visibles
   - Herramientas de análisis

---

### 📖 Documentación Adicional

Para más detalles sobre testing y uso de las nuevas funcionalidades, consultar:
- **TESTING.md** - Guía completa de testing con escenarios paso a paso
- **database/schema.sql** - Esquema actualizado con nuevas tablas y datos

---

**Estado:** ✅ **LISTO PARA APROBACIÓN FINAL**

Todas las funcionalidades han sido implementadas, testeadas y documentadas.
