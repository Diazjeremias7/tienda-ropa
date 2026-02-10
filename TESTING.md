# 🧪 Guía de Testing - Sistema de Tallas, Reportes y Alertas de Stock

## 📋 Cambios Implementados

### 1. ✅ Sistema de Tallas
#### Base de Datos:
- ✅ Tabla `talla` con tallas estándar (XS, S, M, L, XL, XXL, Único)
- ✅ Tabla `producto_talla` para gestionar stock por talla
- ✅ Campo `id_talla` en `detalle_venta` para ventas con talla
- ✅ Campo `stock_minimo` en tabla `producto`

#### Backend:
- ✅ Rutas en `/api/tallas`:
  - GET `/` - Obtener todas las tallas
  - GET `/producto/:id` - Obtener tallas de un producto
  - POST `/` - Crear nueva talla (admin)
  - POST `/producto` - Agregar talla a producto (admin)
  - PUT `/producto/:id` - Actualizar stock de talla (admin)
  - DELETE `/producto/:id` - Eliminar talla de producto (admin)
- ✅ Actualización de `productos.routes.js` para incluir tallas
- ✅ Actualización de `ventas.routes.js` para manejo de tallas

#### Frontend:
- ✅ Componente NuevaVenta actualizado con selector de tallas
- ✅ Validación de stock por talla
- ✅ Vista de tallas disponibles en productos
- ✅ Estilos CSS para botones de tallas

### 2. ✅ Reportes y Estadísticas
#### Backend:
- ✅ Rutas en `/api/reportes`:
  - GET `/dashboard` - Estadísticas generales
  - GET `/ventas-periodo?dias=30` - Ventas por período
  - GET `/productos-mas-vendidos?limite=10` - Top productos
  - GET `/ventas-por-categoria` - Ventas por categoría
  - GET `/ventas-por-vendedor?dias=30` - Ranking vendedores
  - GET `/stock-bajo` - Productos con stock mínimo
  - GET `/tallas-mas-vendidas` - Tallas más populares
  - GET `/ventas-por-mes` - Ventas mensuales

#### Frontend:
- ✅ Nueva página `/reportes` con:
  - Gráficos de ventas por categoría
  - Ranking de vendedores con medallas
  - Gráfico de barras de ventas diarias
  - Estadísticas de tallas más vendidas
- ✅ Filtros por período (7, 30, 60, 90 días)
- ✅ Visualización con barras y porcentajes

### 3. ✅ Alertas de Stock
#### Backend:
- ✅ Campo `stock_minimo` en productos
- ✅ Endpoint `/api/reportes/stock-bajo` para productos críticos
- ✅ Flag `tiene_stock_bajo` en respuesta de productos

#### Frontend:
- ✅ Dashboard actualizado con:
  - Alerta visible cuando hay productos con stock bajo
  - Tabla expandible de productos críticos
  - Badges de estado (Sin stock, Crítico, Bajo)
- ✅ Animación de pulso en alerta
- ✅ Badges en NuevaVenta para productos con stock bajo

---

## 🚀 Instrucciones de Testing

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Levantar servicios
docker-compose up -d

# 2. Verificar que los contenedores estén corriendo
docker-compose ps

# 3. Ver logs si hay errores
docker-compose logs -f backend
docker-compose logs -f frontend

# 4. Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# MySQL: localhost:3306
```

### Opción 2: Sin Docker (Manual)

```bash
# 1. Iniciar MySQL (debe estar instalado)
# En Windows: Iniciar el servicio MySQL desde Servicios

# 2. Crear la base de datos
cd database
mysql -u root -p < schema.sql

# 3. Configurar backend
cd ../backend
cp .env.example .env
# Editar .env y cambiar DB_HOST=localhost

# 4. Instalar dependencias del backend
npm install

# 5. Iniciar backend
npm start
# Debería mostrar: 🚀 Servidor corriendo en http://localhost:3001

# 6. En otra terminal, configurar frontend
cd ../frontend
npm install

# 7. Iniciar frontend
npm start
# Se abrirá automáticamente en http://localhost:3000
```

---

## 🧪 Plan de Testing

### 1. Testing de Sistema de Tallas

#### Test 1.1: Ver tallas en productos
1. Login con admin@tienda.com / admin123
2. Ir a "Productos"
3. Seleccionar un producto (ej: Remera Blanca)
4. ✅ Verificar que se muestren las tallas disponibles con su stock

#### Test 1.2: Nueva venta con tallas
1. Ir a "Nueva Venta"
2. Buscar "Remera Basica Blanca"
3. ✅ Verificar que aparezcan botones de tallas (S, M, L, XL)
4. Clic en talla "M"
5. ✅ Verificar que se agregue al carrito con la talla especificada
6. Cambiar cantidad y confirmar venta
7. ✅ Verificar que el stock de la talla disminuya

#### Test 1.3: Stock insuficiente por talla
1. Ir a "Nueva Venta"
2. Agregar producto con talla que tenga poco stock
3. Intentar agregar más unidades de las disponibles
4. ✅ Verificar mensaje de error "No hay suficiente stock"

### 2. Testing de Reportes y Estadísticas

#### Test 2.1: Dashboard básico
1. Ir a "Dashboard"
2. ✅ Verificar que se muestren:
   - Total de productos
   - Total de ventas y monto
   - Ventas de hoy
   - Productos más vendidos

#### Test 2.2: Página de Reportes
1. Ir a "Reportes" (menú superior)
2. ✅ Verificar sección "Ventas por Categoría":
   - Tabla con categorías ordenadas por ingresos
   - Porcentajes y barras de progreso
   - Total de unidades vendidas

3. ✅ Verificar "Ranking de Vendedores":
   - Tabla con vendedores ordenados
   - Medallas 🥇🥈🥉 para top 3
   - Filtro por período (7, 30, 90 días)

4. ✅ Verificar "Ventas por Día":
   - Gráfico de barras con últimas ventas
   - Cambiar período y verificar actualización

5. ✅ Verificar "Tallas Más Vendidas":
   - Lista de tallas con barras de progreso
   - Cantidades vendidas

### 3. Testing de Alertas de Stock

#### Test 3.1: Alerta en Dashboard
1. Login como admin
2. Ir a "Dashboard"
3. ✅ Verificar banner amarillo con: "⚠️ X productos con stock bajo"
4. Hacer clic en la alerta
5. ✅ Verificar que se expanda tabla con productos críticos

#### Test 3.2: Productos con stock bajo
1. En la tabla expandida verificar:
   - ✅ Columna "Stock Actual" en rojo si está en 0
   - ✅ Badge "Sin stock" para productos agotados
   - ✅ Badge "Crítico" para stock <= stock_mínimo
   - ✅ Links a detalle de productos

#### Test 3.3: Stock bajo en Nueva Venta
1. Ir a "Nueva Venta"
2. Buscar productos con stock bajo
3. ✅ Verificar badge "⚠️ Stock bajo" en productos críticos
4. ✅ Verificar indicador "!" en botones de tallas con stock bajo

### 4. Testing de Flujo Completo (End-to-End)

#### Escenario: Venta completa con tallas
1. Login como vendedor (juan@tienda.com / admin123)
2. Ir a "Dashboard" y verificar estadísticas iniciales
3. Ir a "Nueva Venta"
4. Agregar:
   - 2x Remera Blanca talla M
   - 1x Jean Azul talla L
   - 1x Buzo Negro talla XL
5. Verificar total correcto
6. Confirmar venta
7. ✅ Verificar mensaje de éxito
8. Ir a "Ventas" y verificar la nueva venta
9. Abrir detalle de venta
10. ✅ Verificar que se muestren las tallas vendidas
11. Volver a "Dashboard"
12. ✅ Verificar que las estadísticas se actualizaron
13. ✅ Verificar si aparece alerta de stock bajo (si algún producto quedó bajo)

#### Escenario: Reportes después de ventas
1. Ir a "Reportes"
2. Verificar que la nueva venta aparezca en gráficos
3. Cambiar filtros de período
4. ✅ Verificar que los datos se actualicen

---

## 🐛 Problemas Comunes y Soluciones

### Error: "Cannot connect to MySQL"
**Solución:**
- Verificar que MySQL esté corriendo
- Revisar credenciales en `.env`
- Verificar puerto 3306 disponible

### Error: "Port 3000 already in use"
**Solución:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# O cambiar puerto
$env:PORT=3002; npm start
```

### Error: "Reference Error: obtenerDashboard is not defined"
**Solución:**
- Verificar que backend esté corriendo
- Revisar que las rutas `/api/reportes` respondan
- Verificar imports en `api.js`

### Las tallas no aparecen en productos
**Solución:**
- Verificar que se haya ejecutado el schema.sql actualizado
- Verificar tabla `producto_talla` tenga datos
- Revisar endpoint `/api/tallas/producto/:id`

---

## ✅ Checklist de Verificación

### Base de Datos
- [ ] Tabla `talla` creada con 7 tallas
- [ ] Tabla `producto_talla` creada
- [ ] Campo `stock_minimo` en tabla `producto`
- [ ] Campo `id_talla` en tabla `detalle_venta`
- [ ] Datos de ejemplo con tallas insertados

### Backend
- [ ] Servidor corriendo en puerto 3001
- [ ] Endpoint `/api/tallas` responde
- [ ] Endpoint `/api/reportes/dashboard` devuelve estadísticas
- [ ] Endpoint `/api/reportes/stock-bajo` funciona
- [ ] Ventas con tallas se registran correctamente
- [ ] Stock se descuenta tanto en producto como en producto_talla

### Frontend
- [ ] Aplicación corre en puerto 3000
- [ ] Dashboard muestra alertas de stock
- [ ] Nueva Venta muestra selector de tallas
- [ ] Página Reportes es accesible desde menú
- [ ] Todos los gráficos se muestran correctamente
- [ ] Estilos CSS aplicados correctamente

---

## 📊 Resultados Esperados

Después del testing completo, deberías ver:
1. ✅ Sistema de tallas funcional con stock independiente
2. ✅ Dashboard con estadísticas en tiempo real y alertas
3. ✅ Página de reportes con 4 secciones funcionando
4. ✅ Alertas visuales cuando stock < stock_minimo
5. ✅ Ventas registrando correctamente las tallas seleccionadas
6. ✅ Reportes actualizándose dinámicamente con nuevas ventas

---

## 📝 Notas Adicionales

- La base de datos incluye datos de ejemplo para testing
- Credenciales de prueba:
  - Admin: admin@tienda.com / admin123
  - Vendedor: juan@tienda.com / admin123
  - Vendedor: maria@tienda.com / admin123

- Stock inicial por talla varía entre 3-15 unidades
- Stock mínimo por defecto: 5 unidades
- Los reportes usan los últimos 30 días por defecto
