import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { obtenerProductos, obtenerVentas } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { usuario } = useAuth();
  const [estadisticas, setEstadisticas] = useState({
    totalProductos: 0,
    totalVentas: 0,
    productosRecientes: [],
    ventasRecientes: []
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [productos, ventas] = await Promise.all([
        obtenerProductos(),
        obtenerVentas()
      ]);

      setEstadisticas({
        totalProductos: productos.length,
        totalVentas: ventas.length,
        productosRecientes: productos.slice(0, 5),
        ventasRecientes: ventas.slice(0, 5)
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
    setCargando(false);
  };

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Bienvenido, {usuario?.nombre} 👋</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{estadisticas.totalProductos}</h3>
            <p>Productos</p>
          </div>
          <Link to="/productos" className="stat-link">Ver todos →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{estadisticas.totalVentas}</h3>
            <p>Ventas Registradas</p>
          </div>
          <Link to="/ventas" className="stat-link">Ver todas →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>Nueva Venta</h3>
            <p>Registrar venta</p>
          </div>
          <Link to="/ventas/nueva" className="stat-link">Crear →</Link>
        </div>

        {usuario?.rol === 'admin' && (
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Usuarios</h3>
              <p>Gestionar usuarios</p>
            </div>
            <Link to="/usuarios" className="stat-link">Administrar →</Link>
          </div>
        )}
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>📦 Productos Recientes</h2>
          {estadisticas.productosRecientes.length > 0 ? (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {estadisticas.productosRecientes.map((producto) => (
                    <tr key={producto.id_producto}>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoria}</td>
                      <td>${parseFloat(producto.precio).toLocaleString()}</td>
                      <td>{producto.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay productos registrados</p>
          )}
        </div>

        <div className="section">
          <h2>💰 Ventas Recientes</h2>
          {estadisticas.ventasRecientes.length > 0 ? (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Vendedor</th>
                    <th>Total</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {estadisticas.ventasRecientes.map((venta) => (
                    <tr key={venta.id_venta}>
                      <td>#{venta.id_venta}</td>
                      <td>{venta.nombre_vendedor}</td>
                      <td>${parseFloat(venta.total).toLocaleString()}</td>
                      <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay ventas registradas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
