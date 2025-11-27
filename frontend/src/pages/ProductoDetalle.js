import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProducto } from '../services/api';
import './ProductoDetalle.css';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      const data = await obtenerProducto(id);
      setProducto(data);
    } catch (error) {
      console.error('Error al cargar producto:', error);
    }
    setCargando(false);
  };

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  if (!producto) {
    return <div className="error">Producto no encontrado</div>;
  }

  return (
    <div className="producto-detalle">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Volver
      </button>

      <div className="detalle-container">
        <div className="detalle-imagen">
          <div className="imagen-placeholder">📦</div>
        </div>

        <div className="detalle-info">
          <h1>{producto.nombre}</h1>
          
          <div className="badges">
            <span className="badge categoria">{producto.categoria}</span>
            {producto.color && (
              <span className="badge color">{producto.color}</span>
            )}
          </div>

          <p className="descripcion">{producto.descripcion}</p>

          <div className="precio-stock">
            <div className="precio">${parseFloat(producto.precio).toLocaleString()}</div>
            <div className={`stock ${producto.stock > 0 ? 'disponible' : 'agotado'}`}>
              {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Sin stock'}
            </div>
          </div>

          <div className="detalle-specs">
            <h3>Especificaciones</h3>
            <table>
              <tbody>
                <tr>
                  <td><strong>ID:</strong></td>
                  <td>{producto.id_producto}</td>
                </tr>
                <tr>
                  <td><strong>Categoría:</strong></td>
                  <td>{producto.categoria}</td>
                </tr>
                <tr>
                  <td><strong>Color:</strong></td>
                  <td>{producto.color || 'No especificado'}</td>
                </tr>
                <tr>
                  <td><strong>Precio:</strong></td>
                  <td>${parseFloat(producto.precio).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Stock:</strong></td>
                  <td>{producto.stock}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
