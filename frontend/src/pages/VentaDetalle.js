import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerVenta } from '../services/api';
import './VentaDetalle.css';

const VentaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarVenta();
  }, [id]);

  const cargarVenta = async () => {
    try {
      const data = await obtenerVenta(id);
      setVenta(data);
    } catch (error) {
      console.error('Error al cargar venta:', error);
    }
    setCargando(false);
  };

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  if (!venta) {
    return <div className="error">Venta no encontrada</div>;
  }

  return (
    <div className="venta-detalle">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Volver
      </button>

      <div className="detalle-card">
        <div className="detalle-header">
          <h1>Venta #{venta.id_venta}</h1>
          <div className="fecha">{new Date(venta.fecha).toLocaleString()}</div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>Vendedor:</label>
            <span>{venta.nombre_vendedor}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{venta.email_vendedor}</span>
          </div>
        </div>

        <h2>Productos</h2>
        <table className="productos-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Color</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venta.detalles.map((detalle) => (
              <tr key={detalle.id_detalle}>
                <td>{detalle.nombre_producto}</td>
                <td>{detalle.categoria}</td>
                <td>{detalle.color || '-'}</td>
                <td>{detalle.cantidad}</td>
                <td>${parseFloat(detalle.precio_unitario).toLocaleString()}</td>
                <td>${(detalle.cantidad * parseFloat(detalle.precio_unitario)).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total-container">
          <h2>Total: ${parseFloat(venta.total).toLocaleString()}</h2>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalle;
