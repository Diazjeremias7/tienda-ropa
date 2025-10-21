-- Eliminar base de datos si existe
DROP DATABASE IF EXISTS tienda_ropa;

-- Crear base de datos
CREATE DATABASE tienda_ropa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tienda_ropa;

-- Tabla de usuarios
CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'vendedor'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos
CREATE TABLE producto (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  categoria VARCHAR(50),
  color VARCHAR(30)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ventas
CREATE TABLE venta (
  id_venta INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de detalle de ventas
CREATE TABLE detalle_venta (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_venta INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuario administrador
-- Email: admin@tienda.com
-- Password: admin123
INSERT INTO usuario (nombre, email, password, rol) 
VALUES ('Administrador', 'admin@tienda.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Usuarios vendedores
INSERT INTO usuario (nombre, email, password, rol) VALUES
('Juan Perez', 'juan@tienda.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendedor'),
('Maria Gonzalez', 'maria@tienda.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendedor');

-- Productos de ejemplo
INSERT INTO producto (nombre, descripcion, precio, stock, categoria, color) VALUES
('Remera Basica Blanca', 'Remera de algodon 100%', 5000.00, 50, 'Remeras', 'Blanco'),
('Remera Basica Negra', 'Remera de algodon 100%', 5000.00, 45, 'Remeras', 'Negro'),
('Jean Clasico Azul', 'Jean azul oscuro, corte recto', 12000.00, 30, 'Pantalones', 'Azul'),
('Jean Negro Skinny', 'Jean negro, corte ajustado', 13000.00, 25, 'Pantalones', 'Negro'),
('Buzo con Capucha Negro', 'Buzo oversize con capucha', 8500.00, 35, 'Buzos', 'Negro'),
('Buzo con Capucha Gris', 'Buzo oversize con capucha', 8500.00, 30, 'Buzos', 'Gris'),
('Zapatillas Urbanas Blancas', 'Zapatillas deportivas urbanas', 15000.00, 20, 'Calzado', 'Blanco'),
('Zapatillas Urbanas Negras', 'Zapatillas deportivas urbanas', 15000.00, 18, 'Calzado', 'Negro'),
('Campera de Jean', 'Campera clasica de jean', 18000.00, 15, 'Camperas', 'Azul'),
('Campera Bomber', 'Campera bomber estilo urbano', 20000.00, 12, 'Camperas', 'Verde');

-- Insertar algunas ventas de ejemplo
INSERT INTO venta (id_usuario, total, fecha) VALUES
(2, 17000.00, '2024-10-15 10:30:00'),
(3, 13500.00, '2024-10-16 14:20:00'),
(2, 35000.00, '2024-10-17 11:45:00');

-- Insertar detalles de las ventas
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 1, 5000.00),
(1, 3, 1, 12000.00),
(2, 5, 1, 8500.00),
(2, 2, 1, 5000.00),
(3, 7, 1, 15000.00),
(3, 10, 1, 20000.00);

-- Mostrar mensaje de exito
SELECT 'Base de datos creada exitosamente' AS Status;
SELECT CONCAT('Tablas creadas: ', COUNT(*), ' tablas') AS Info 
FROM information_schema.tables 
WHERE table_schema = 'tienda_ropa';
SELECT CONCAT('Productos insertados: ', COUNT(*)) AS Productos FROM producto;
SELECT CONCAT('Usuarios creados: ', COUNT(*)) AS Usuarios FROM usuario;
SELECT CONCAT('Ventas de ejemplo: ', COUNT(*)) AS Ventas FROM venta;