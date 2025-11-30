import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerVentas } from '../services/api';
import './Ventas.css';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      const data = await obtenerVentas();
      setVentas(data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
    setCargando(false);
  };

  if (cargando) {
    return <div className="loading">Cargando ventas...</div>;
  }

  return (
    <div className="ventas-container">
      <div className="page-header">
        <h1>Ventas</h1>
        <Link to="/ventas/nueva" className="btn-primary">
          + Nueva Venta
        </Link>
      </div>

      {ventas.length > 0 ? (
        <div className="table-container">
          <table className="ventas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vendedor</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id_venta}>
                  <td>#{venta.id_venta}</td>
                  <td>{venta.nombre_vendedor}</td>
                  <td>{new Date(venta.fecha).toLocaleString()}</td>
                  <td className="total">${parseFloat(venta.total).toLocaleString()}</td>
                  <td>
                    <Link to={`/ventas/${venta.id_venta}`} className="btn-ver">
                      Ver Detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No hay ventas registradas</div>
      )}
    </div>
  );
};

export default Ventas;
