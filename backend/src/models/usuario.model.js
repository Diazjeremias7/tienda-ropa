const db = require('../config/database');
const bcrypt = require('bcrypt');

class Usuario {
  static async crear(datos) {
    const { nombre, email, password, rol = 'vendedor' } = datos;
    
    const [result] = await db.query(
      'INSERT INTO usuario (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, password, rol]
    );
    
    return { id: result.insertId };
  }

  static async obtenerTodos() {
    const [usuarios] = await db.query(
      'SELECT id_usuario, nombre, email, rol FROM usuario'
    );
    return usuarios;
  }

  static async obtenerPorId(id) {
    const [usuarios] = await db.query(
      'SELECT id_usuario, nombre, email, rol FROM usuario WHERE id_usuario = ?',
      [id]
    );
    return usuarios[0];
  }

  static async obtenerPorEmail(email) {
    const [usuarios] = await db.query(
      'SELECT * FROM usuario WHERE email = ?',
      [email]
    );
    return usuarios[0];
  }

  static async actualizar(id, datos) {
    const { nombre, email, rol } = datos;
    const [result] = await db.query(
      'UPDATE usuario SET nombre = ?, email = ?, rol = ? WHERE id_usuario = ?',
      [nombre, email, rol, id]
    );
    return result.affectedRows > 0;
  }

  static async eliminar(id) {
    const [result] = await db.query(
      'DELETE FROM usuario WHERE id_usuario = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async verificarPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = Usuario;