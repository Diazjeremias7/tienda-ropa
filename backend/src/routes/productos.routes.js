const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [productos] = await db.query('SELECT * FROM producto ORDER BY nombre');
    
    // Para cada producto, obtener sus tallas
    for (let producto of productos) {
      const [tallas] = await db.query(`
        SELECT t.*, pt.stock, pt.id_producto_talla
        FROM talla t
        INNER JOIN producto_talla pt ON t.id_talla = pt.id_talla
        WHERE pt.id_producto = ?
        ORDER BY t.orden
      `, [producto.id_producto]);
      producto.tallas = tallas;
      producto.tiene_stock_bajo = producto.stock <= producto.stock_minimo;
    }
    
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const [productos] = await db.query('SELECT * FROM producto WHERE id_producto = ?', [req.params.id]);
    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    const producto = productos[0];
    
    // Obtener tallas del producto
    const [tallas] = await db.query(`
      SELECT t.*, pt.stock, pt.id_producto_talla
      FROM talla t
      INNER JOIN producto_talla pt ON t.id_talla = pt.id_talla
      WHERE pt.id_producto = ?
      ORDER BY t.orden
    `, [producto.id_producto]);
    
    producto.tallas = tallas;
    producto.tiene_stock_bajo = producto.stock <= producto.stock_minimo;
    
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Crear producto (solo admin)
router.post('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, stock_minimo, categoria, color } = req.body;

    if (!nombre || !precio || stock === undefined) {
      return res.status(400).json({ error: 'Nombre, precio y stock son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO producto (nombre, descripcion, precio, stock, stock_minimo, categoria, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, stock, stock_minimo || 5, categoria, color]
    );

    res.status(201).json({ 
      message: 'Producto creado exitosamente',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Actualizar producto (solo admin)
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, stock_minimo, categoria, color } = req.body;

    const [result] = await db.query(
      'UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, stock_minimo = ?, categoria = ?, color = ? WHERE id_producto = ?',
      [nombre, descripcion, precio, stock, stock_minimo || 5, categoria, color, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Eliminar producto (solo admin)
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM producto WHERE id_producto = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Buscar productos por categoría
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const [productos] = await db.query('SELECT * FROM producto WHERE categoria = ? ORDER BY nombre', [req.params.categoria]);
    res.json(productos);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
});

module.exports = router;
