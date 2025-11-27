import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerUsuarios, eliminarUsuario } from '../services/api';
import './Usuarios.css';

const Usuarios = () => {
  const { usuario: usuarioActual } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
    setCargando(false);
  };

  const handleEliminar = async (id) => {
    if (id === usuarioActual.id) {
      alert('No puedes eliminar tu propio usuario');
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await eliminarUsuario(id);
      cargarUsuarios();
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      alert('Error al eliminar usuario');
    }
  };

  if (cargando) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="usuarios-container">
      <h1>Gestión de Usuarios</h1>

      <div className="table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.id_usuario}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`rol-badge ${usuario.rol}`}>
                    {usuario.rol}
                  </span>
                </td>
                <td>
                  {usuario.id_usuario !== usuarioActual.id && (
                    <button
                      onClick={() => handleEliminar(usuario.id_usuario)}
                      className="btn-eliminar"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;
