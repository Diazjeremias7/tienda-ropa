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
  stock_minimo INT DEFAULT 5,
  categoria VARCHAR(50),
  color VARCHAR(30)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tallas
CREATE TABLE talla (
  id_talla INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(10) NOT NULL UNIQUE,
  orden INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla producto_talla (relación muchos a muchos con stock por talla)
CREATE TABLE producto_talla (
  id_producto_talla INT AUTO_INCREMENT PRIMARY KEY,
  id_producto INT NOT NULL,
  id_talla INT NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE,
  FOREIGN KEY (id_talla) REFERENCES talla(id_talla) ON DELETE CASCADE,
  UNIQUE KEY unique_producto_talla (id_producto, id_talla)
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
  id_talla INT,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
  FOREIGN KEY (id_talla) REFERENCES talla(id_talla)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuario administrador
-- Email: admin@tienda.com
-- Password: admin123
INSERT INTO usuario (nombre, email, password, rol) 
VALUES ('Administrador', 'admin@tienda.com', '$2b$10$xMVI1QRSnks48vpC2kBKTu0wC73uO2JO8f1pF8./qZB2qYFkQap7K', 'admin');

-- Usuarios vendedores
INSERT INTO usuario (nombre, email, password, rol) VALUES
('Juan Perez', 'juan@tienda.com', '$2b$10$xMVI1QRSnks48vpC2kBKTu0wC73uO2JO8f1pF8./qZB2qYFkQap7K', 'vendedor'),
('Maria Gonzalez', 'maria@tienda.com', '$2b$10$xMVI1QRSnks48vpC2kBKTu0wC73uO2JO8f1pF8./qZB2qYFkQap7K', 'vendedor');

-- Insertar tallas
INSERT INTO talla (nombre, orden) VALUES
('XS', 1),
('S', 2),
('M', 3),
('L', 4),
('XL', 5),
('XXL', 6),
('Único', 7);

-- Productos de ejemplo
INSERT INTO producto (nombre, descripcion, precio, stock, stock_minimo, categoria, color) VALUES
('Remera Basica Blanca', 'Remera de algodon 100%', 5000.00, 50, 10, 'Remeras', 'Blanco'),
('Remera Basica Negra', 'Remera de algodon 100%', 5000.00, 45, 10, 'Remeras', 'Negro'),
('Jean Clasico Azul', 'Jean azul oscuro, corte recto', 12000.00, 30, 8, 'Pantalones', 'Azul'),
('Jean Negro Skinny', 'Jean negro, corte ajustado', 13000.00, 25, 8, 'Pantalones', 'Negro'),
('Buzo con Capucha Negro', 'Buzo oversize con capucha', 8500.00, 35, 10, 'Buzos', 'Negro'),
('Buzo con Capucha Gris', 'Buzo oversize con capucha', 8500.00, 30, 10, 'Buzos', 'Gris'),
('Zapatillas Urbanas Blancas', 'Zapatillas deportivas urbanas', 15000.00, 20, 5, 'Calzado', 'Blanco'),
('Zapatillas Urbanas Negras', 'Zapatillas deportivas urbanas', 15000.00, 18, 5, 'Calzado', 'Negro'),
('Campera de Jean', 'Campera clasica de jean', 18000.00, 15, 5, 'Camperas', 'Azul'),
('Campera Bomber', 'Campera bomber estilo urbano', 20000.00, 12, 5, 'Camperas', 'Verde');

-- Insertar stock por talla para productos
-- Remera Blanca (id: 1) - Tallas S, M, L, XL
INSERT INTO producto_talla (id_producto, id_talla, stock) VALUES
(1, 2, 10), (1, 3, 15), (1, 4, 15), (1, 5, 10),
-- Remera Negra (id: 2) - Tallas S, M, L, XL
(2, 2, 10), (2, 3, 15), (2, 4, 12), (2, 5, 8),
-- Jean Azul (id: 3) - Tallas 28, 30, 32, 34, 36
(3, 2, 5), (3, 3, 10), (3, 4, 10), (3, 5, 5),
-- Jean Negro (id: 4) - Tallas 28, 30, 32, 34, 36
(4, 2, 5), (4, 3, 8), (4, 4, 8), (4, 5, 4),
-- Buzo Negro (id: 5) - Tallas S, M, L, XL
(5, 2, 8), (5, 3, 12), (5, 4, 10), (5, 5, 5),
-- Buzo Gris (id: 6) - Tallas S, M, L, XL
(6, 2, 7), (6, 3, 10), (6, 4, 8), (6, 5, 5),
-- Zapatillas Blancas (id: 7) - Tallas 38-44
(7, 2, 3), (7, 3, 5), (7, 4, 7), (7, 5, 5),
-- Zapatillas Negras (id: 8) - Tallas 38-44
(8, 2, 3), (8, 3, 4), (8, 4, 6), (8, 5, 5),
-- Campera Jean (id: 9) - Tallas M, L, XL
(9, 3, 5), (9, 4, 6), (9, 5, 4),
-- Campera Bomber (id: 10) - Tallas M, L, XL
(10, 3, 4), (10, 4, 5), (10, 5, 3);

-- Insertar algunas ventas de ejemplo
INSERT INTO venta (id_usuario, total, fecha) VALUES
(2, 17000.00, '2024-10-15 10:30:00'),
(3, 13500.00, '2024-10-16 14:20:00'),
(2, 35000.00, '2024-10-17 11:45:00');

-- Insertar detalles de las ventas
INSERT INTO detalle_venta (id_venta, id_producto, id_talla, cantidad, precio_unitario) VALUES
(1, 1, 3, 1, 5000.00),  -- Remera Blanca talla M
(1, 3, 4, 1, 12000.00), -- Jean Azul talla L
(2, 5, 3, 1, 8500.00),  -- Buzo Negro talla M
(2, 2, 4, 1, 5000.00),  -- Remera Negra talla L
(3, 7, 4, 1, 15000.00), -- Zapatillas Blancas talla L
(3, 10, 5, 1, 20000.00); -- Campera Bomber talla XL

-- Mostrar mensaje de exito
SELECT 'Base de datos creada exitosamente' AS Status;
SELECT CONCAT('Tablas creadas: ', COUNT(*), ' tablas') AS Info 
FROM information_schema.tables 
WHERE table_schema = 'tienda_ropa';
SELECT CONCAT('Productos insertados: ', COUNT(*)) AS Productos FROM producto;
SELECT CONCAT('Usuarios creados: ', COUNT(*)) AS Usuarios FROM usuario;
SELECT CONCAT('Tallas creadas: ', COUNT(*)) AS Tallas FROM talla;
SELECT CONCAT('Ventas de ejemplo: ', COUNT(*)) AS Ventas FROM venta;