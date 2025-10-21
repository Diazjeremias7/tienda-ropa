DROP DATABASE IF EXISTS tienda_ropa;
CREATE DATABASE tienda_ropa;
USE tienda_ropa;

-- Tabla de usuarios
CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'vendedor'
);

-- Tabla de productos
CREATE TABLE producto (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  categoria VARCHAR(50),
  color VARCHAR(30)
);

-- Tabla de ventas
CREATE TABLE venta (
  id_venta INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla de detalle de ventas
CREATE TABLE detalle_venta (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_venta INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- Usuario admin (email: admin@tienda.com, password: admin123)
INSERT INTO usuario (nombre, email, contraseña, rol) 
VALUES ('Administrador', 'admin@tienda.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Productos de ejemplo
INSERT INTO producto (nombre, descripcion, precio, stock, categoria, color) VALUES
('Remera Básica Blanca', 'Remera de algodón 100%', 5000.00, 50, 'Remeras', 'Blanco'),
('Jean Clásico', 'Jean azul oscuro', 12000.00, 30, 'Pantalones', 'Azul'),
('Buzo con Capucha', 'Buzo oversize', 8500.00, 35, 'Buzos', 'Negro'),
('Zapatillas Urbanas', 'Zapatillas deportivas', 15000.00, 20, 'Calzado', 'Blanco'),
('Campera de Jean', 'Campera clásica', 18000.00, 15, 'Camperas', 'Azul');

SELECT '✅ Base de datos creada exitosamente!' AS status;