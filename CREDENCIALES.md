}
## Usuarios de la Aplicación

### Administrador
- **Email:** admin@tienda.com
- **Contraseña:** admin123
- **Rol:** admin

### Vendedor 1
- **Email:** juan@tienda.com
- **Contraseña:** admin123
- **Rol:** vendedor

### Vendedor 2
- **Email:** maria@tienda.com
- **Contraseña:** admin123
- **Rol:** vendedor

## Base de Datos MySQL

### Usuario Root
- **Usuario:** root
- **Contraseña:** root123
- **Puerto:** 3306

### Usuario de Aplicación
- **Usuario:** tienda_user
- **Contraseña:** tienda_pass
- **Base de datos:** tienda_ropa
- **Puerto:** 3306

## Conexión desde el host

```bash
# Usando MySQL CLI
mysql -h localhost -P 3306 -u tienda_user -ptienda_pass tienda_ropa

# O usando el script de utilidades
./docker.sh db
```

## Conexión desde Docker

```bash
# Acceder al contenedor de MySQL
docker exec -it tienda_mysql bash

# Conectar a MySQL
mysql -u tienda_user -ptienda_pass tienda_ropa
```

## JWT Secret

- **JWT_SECRET:** mi_super_secreto_jwt_para_produccion_cambiar
  
⚠️ **IMPORTANTE:** Cambiar este secreto en producción por uno aleatorio y seguro.

## URLs de la Aplicación

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Base de datos:** localhost:3306

## Generar nuevo JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---