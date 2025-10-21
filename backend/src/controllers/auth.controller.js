const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password requeridos' });
    }

    const usuario = await Usuario.obtenerPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const passwordValida = await Usuario.verificarPassword(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const usuarioExistente = await Usuario.obtenerPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya esta registrado' });
    }

    const id = await Usuario.crear({ nombre, email, password, rol });
    res.status(201).json({ message: 'Usuario registrado', id });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};