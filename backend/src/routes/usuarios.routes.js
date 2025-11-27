const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario.model');
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware');

// Obtener todos los usuarios (solo admin)
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener usuario por ID
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.obtenerPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Actualizar usuario
router.put('/:id', verificarToken, async (req, res) => {
  try {
    // Solo admin puede actualizar otros usuarios
    if (req.usuario.rol !== 'admin' && req.usuario.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const actualizado = await Usuario.actualizar(req.params.id, req.body);
    if (!actualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const eliminado = await Usuario.eliminar(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;