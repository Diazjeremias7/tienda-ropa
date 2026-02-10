const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verificarToken } = require('../middlewares/auth.middleware');

// Estadísticas generales del dashboard
router.get('/dashboard', verificarToken, async (req, res) => {
  try {
    // Total de ventas
    const [ventasTotal] = await db.query(
      'SELECT COUNT(*) as total, SUM(total) as monto_total FROM venta'
    );

    // Total de productos
    const [productosTotal] = await db.query(
      'SELECT COUNT(*) as total FROM producto'
    );

    // Total de usuarios
    const [usuariosTotal] = await db.query(
      'SELECT COUNT(*) as total FROM usuario WHERE rol = "vendedor"'
    );

    // Ventas de hoy
    const [ventasHoy] = await db.query(
      `SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto_total 
       FROM venta 
       WHERE DATE(fecha) = CURDATE()`
    );

    // Productos con stock bajo
    const [stockBajo] = await db.query(
      'SELECT COUNT(*) as total FROM producto WHERE stock <= stock_minimo'
    );

    res.json({
      ventas_totales: ventasTotal[0].total,
      monto_total_ventas: ventasTotal[0].monto_total || 0,
      productos_total: productosTotal[0].total,
      usuarios_total: usuariosTotal[0].total,
      ventas_hoy: ventasHoy[0].total,
      monto_hoy: ventasHoy[0].monto_total,
      productos_stock_bajo: stockBajo[0].total
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Ventas por periodo (últimos 7 días, 30 días, etc.)
router.get('/ventas-periodo', verificarToken, async (req, res) => {
  try {
    const { dias = 30 } = req.query;

    const query = `
      SELECT 
        DATE(fecha) as fecha,
        COUNT(*) as cantidad_ventas,
        SUM(total) as total_ventas
      FROM venta
      WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(fecha)
      ORDER BY fecha
    `;

    const [ventas] = await db.query(query, [parseInt(dias)]);
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas por periodo:', error);
    res.status(500).json({ error: 'Error al obtener ventas por periodo' });
  }
});

// Productos más vendidos
router.get('/productos-mas-vendidos', verificarToken, async (req, res) => {
  try {
    const { limite = 10 } = req.query;

    const query = `
      SELECT 
        p.id_producto,
        p.nombre,
        p.categoria,
        p.precio,
        SUM(dv.cantidad) as total_vendido,
        SUM(dv.cantidad * dv.precio_unitario) as ingresos_totales
      FROM detalle_venta dv
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      GROUP BY p.id_producto, p.nombre, p.categoria, p.precio
      ORDER BY total_vendido DESC
      LIMIT ?
    `;

    const [productos] = await db.query(query, [parseInt(limite)]);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({ error: 'Error al obtener productos más vendidos' });
  }
});

// Ventas por categoría
router.get('/ventas-por-categoria', verificarToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        p.categoria,
        SUM(dv.cantidad) as cantidad_vendida,
        SUM(dv.cantidad * dv.precio_unitario) as ingresos_totales
      FROM detalle_venta dv
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      GROUP BY p.categoria
      ORDER BY ingresos_totales DESC
    `;

    const [categorias] = await db.query(query);
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener ventas por categoría:', error);
    res.status(500).json({ error: 'Error al obtener ventas por categoría' });
  }
});

// Ventas por vendedor
router.get('/ventas-por-vendedor', verificarToken, async (req, res) => {
  try {
    const { dias = 30 } = req.query;

    const query = `
      SELECT 
        u.id_usuario,
        u.nombre,
        COUNT(v.id_venta) as cantidad_ventas,
        SUM(v.total) as total_ventas
      FROM usuario u
      LEFT JOIN venta v ON u.id_usuario = v.id_usuario 
        AND v.fecha >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      WHERE u.rol = 'vendedor'
      GROUP BY u.id_usuario, u.nombre
      ORDER BY total_ventas DESC
    `;

    const [vendedores] = await db.query(query, [parseInt(dias)]);
    res.json(vendedores);
  } catch (error) {
    console.error('Error al obtener ventas por vendedor:', error);
    res.status(500).json({ error: 'Error al obtener ventas por vendedor' });
  }
});

// Productos con stock bajo
router.get('/stock-bajo', verificarToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        (p.stock <= p.stock_minimo) as alerta_critica
      FROM producto p
      WHERE p.stock <= p.stock_minimo
      ORDER BY p.stock ASC
    `;

    const [productos] = await db.query(query);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({ error: 'Error al obtener productos con stock bajo' });
  }
});

// Tallas más vendidas
router.get('/tallas-mas-vendidas', verificarToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        t.nombre as talla,
        COUNT(dv.id_detalle) as cantidad_ventas,
        SUM(dv.cantidad) as unidades_vendidas
      FROM detalle_venta dv
      INNER JOIN talla t ON dv.id_talla = t.id_talla
      GROUP BY t.id_talla, t.nombre
      ORDER BY unidades_vendidas DESC
    `;

    const [tallas] = await db.query(query);
    res.json(tallas);
  } catch (error) {
    console.error('Error al obtener tallas más vendidas:', error);
    res.status(500).json({ error: 'Error al obtener tallas más vendidas' });
  }
});

// Resumen de ventas por mes (últimos 12 meses)
router.get('/ventas-por-mes', verificarToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE_FORMAT(fecha, '%Y-%m') as mes,
        COUNT(*) as cantidad_ventas,
        SUM(total) as total_ventas
      FROM venta
      WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(fecha, '%Y-%m')
      ORDER BY mes
    `;

    const [ventas] = await db.query(query);
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas por mes:', error);
    res.status(500).json({ error: 'Error al obtener ventas por mes' });
  }
});

module.exports = router;
