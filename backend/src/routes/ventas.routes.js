const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verificarToken } = require('../middlewares/auth.middleware');

// Obtener todas las ventas
router.get('/', verificarToken, async (req, res) => {
  try {
    const [ventas] = await db.query(`
      SELECT v.*, u.nombre as nombre_vendedor, u.email as email_vendedor
      FROM venta v
      INNER JOIN usuario u ON v.id_usuario = u.id_usuario
      ORDER BY v.fecha DESC
    `);
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

// Obtener venta por ID con detalles
router.get('/:id', verificarToken, async (req, res) => {
  try {
    // Obtener información de la venta
    const [ventas] = await db.query(`
      SELECT v.*, u.nombre as nombre_vendedor, u.email as email_vendedor
      FROM venta v
      INNER JOIN usuario u ON v.id_usuario = u.id_usuario
      WHERE v.id_venta = ?
    `, [req.params.id]);

    if (ventas.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    // Obtener detalles de la venta
    const [detalles] = await db.query(`
      SELECT dv.*, p.nombre as nombre_producto, p.categoria, p.color
      FROM detalle_venta dv
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
    `, [req.params.id]);

    res.json({
      ...ventas[0],
      detalles
    });
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({ error: 'Error al obtener venta' });
  }
});

// Crear venta
router.post('/', verificarToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { productos } = req.body; // Array de { id_producto, cantidad, precio_unitario }

    if (!productos || productos.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    }

    // Calcular total
    const total = productos.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);

    // Crear la venta
    const [ventaResult] = await connection.query(
      'INSERT INTO venta (id_usuario, total) VALUES (?, ?)',
      [req.usuario.id, total]
    );

    const id_venta = ventaResult.insertId;

    // Insertar detalles de venta y actualizar stock
    for (const item of productos) {
      // Verificar stock
      const [producto] = await connection.query(
        'SELECT stock FROM producto WHERE id_producto = ?',
        [item.id_producto]
      );

      if (producto.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: `Producto ${item.id_producto} no encontrado` });
      }

      if (producto[0].stock < item.cantidad) {
        await connection.rollback();
        return res.status(400).json({ error: `Stock insuficiente para producto ${item.id_producto}` });
      }

      // Insertar detalle de venta
      await connection.query(
        'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [id_venta, item.id_producto, item.cantidad, item.precio_unitario]
      );

      // Actualizar stock
      await connection.query(
        'UPDATE producto SET stock = stock - ? WHERE id_producto = ?',
        [item.cantidad, item.id_producto]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: 'Venta creada exitosamente',
      id_venta,
      total
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear venta:', error);
    res.status(500).json({ error: 'Error al crear venta' });
  } finally {
    connection.release();
  }
});

// Obtener ventas por usuario
router.get('/usuario/:id', verificarToken, async (req, res) => {
  try {
    // Verificar que el usuario solicita sus propias ventas o es admin
    if (req.usuario.id !== parseInt(req.params.id) && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const [ventas] = await db.query(`
      SELECT v.*, u.nombre as nombre_vendedor
      FROM venta v
      INNER JOIN usuario u ON v.id_usuario = u.id_usuario
      WHERE v.id_usuario = ?
      ORDER BY v.fecha DESC
    `, [req.params.id]);

    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

// Obtener estadísticas de ventas (solo admin)
router.get('/estadisticas/totales', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const [estadisticas] = await db.query(`
      SELECT 
        COUNT(*) as total_ventas,
        SUM(total) as monto_total,
        AVG(total) as promedio_venta,
        MAX(total) as venta_maxima,
        MIN(total) as venta_minima
      FROM venta
    `);

    res.json(estadisticas[0]);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

module.exports = router;
