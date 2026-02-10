const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware');

// Obtener todas las tallas
router.get('/', async (req, res) => {
  try {
    const [tallas] = await db.query('SELECT * FROM talla ORDER BY orden');
    res.json(tallas);
  } catch (error) {
    console.error('Error al obtener tallas:', error);
    res.status(500).json({ error: 'Error al obtener tallas' });
  }
});

// Obtener tallas disponibles para un producto
router.get('/producto/:id', async (req, res) => {
  try {
    const query = `
      SELECT t.*, pt.stock, pt.id_producto_talla
      FROM talla t
      INNER JOIN producto_talla pt ON t.id_talla = pt.id_talla
      WHERE pt.id_producto = ?
      ORDER BY t.orden
    `;
    const [tallas] = await db.query(query, [req.params.id]);
    res.json(tallas);
  } catch (error) {
    console.error('Error al obtener tallas del producto:', error);
    res.status(500).json({ error: 'Error al obtener tallas del producto' });
  }
});

// Crear talla (solo admin)
router.post('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { nombre, orden } = req.body;

    if (!nombre || !orden) {
      return res.status(400).json({ error: 'Nombre y orden son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO talla (nombre, orden) VALUES (?, ?)',
      [nombre, orden]
    );

    res.status(201).json({ 
      message: 'Talla creada exitosamente',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error al crear talla:', error);
    res.status(500).json({ error: 'Error al crear talla' });
  }
});

// Agregar talla a un producto (solo admin)
router.post('/producto', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { id_producto, id_talla, stock } = req.body;

    if (!id_producto || !id_talla || stock === undefined) {
      return res.status(400).json({ error: 'id_producto, id_talla y stock son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO producto_talla (id_producto, id_talla, stock) VALUES (?, ?, ?)',
      [id_producto, id_talla, stock]
    );

    res.status(201).json({ 
      message: 'Talla agregada al producto exitosamente',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error al agregar talla al producto:', error);
    res.status(500).json({ error: 'Error al agregar talla al producto' });
  }
});

// Actualizar stock de una talla de producto (solo admin)
router.put('/producto/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ error: 'Stock es requerido' });
    }

    const [result] = await db.query(
      'UPDATE producto_talla SET stock = ? WHERE id_producto_talla = ?',
      [stock, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto-Talla no encontrado' });
    }

    res.json({ message: 'Stock actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ error: 'Error al actualizar stock' });
  }
});

// Eliminar talla de un producto (solo admin)
router.delete('/producto/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM producto_talla WHERE id_producto_talla = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto-Talla no encontrado' });
    }

    res.json({ message: 'Talla eliminada del producto correctamente' });
  } catch (error) {
    console.error('Error al eliminar talla del producto:', error);
    res.status(500).json({ error: 'Error al eliminar talla del producto' });
  }
});

module.exports = router;
