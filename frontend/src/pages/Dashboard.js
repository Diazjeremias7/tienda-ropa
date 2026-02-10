import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  obtenerDashboard, 
  obtenerProductosStockBajo,
  obtenerProductosMasVendidos 
} from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { usuario } = useAuth();
  const [estadisticas, setEstadisticas] = useState({
    ventas_totales: 0,
    monto_total_ventas: 0,
    productos_total: 0,
    usuarios_total: 0,
    ventas_hoy: 0,
    monto_hoy: 0,
    productos_stock_bajo: 0
  });
  const [stockBajo, setStockBajo] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarAlertas, setMostrarAlertas] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [dashData, stockBajoData, topProductos] = await Promise.all([
        obtenerDashboard(),
        obtenerProductosStockBajo(),
        obtenerProductosMasVendidos(5)
      ]);

      setEstadisticas(dashData);
      setStockBajo(stockBajoData);
      setProductosMasVendidos(topProductos);
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
      <div className="dashboard-header">
        <h1>Bienvenido, {usuario?.nombre} 👋</h1>
        {estadisticas.productos_stock_bajo > 0 && (
          <div className="alerta-stock" onClick={() => setMostrarAlertas(!mostrarAlertas)}>
            ⚠️ {estadisticas.productos_stock_bajo} productos con stock bajo
          </div>
        )}
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{estadisticas.productos_total}</h3>
            <p>Productos</p>
          </div>
          <Link to="/productos" className="stat-link">Ver todos →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{estadisticas.ventas_totales}</h3>
            <p>Ventas Totales</p>
            <span className="stat-subtitle">
              ${parseFloat(estadisticas.monto_total_ventas || 0).toLocaleString()}
            </span>
          </div>
          <Link to="/ventas" className="stat-link">Ver todas →</Link>
        </div>

        <div className="stat-card stat-card-highlight">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>{estadisticas.ventas_hoy}</h3>
            <p>Ventas Hoy</p>
            <span className="stat-subtitle">
              ${parseFloat(estadisticas.monto_hoy || 0).toLocaleString()}
            </span>
          </div>
          <Link to="/ventas/nueva" className="stat-link">Nueva venta →</Link>
        </div>

        {usuario?.rol === 'admin' && (
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{estadisticas.usuarios_total}</h3>
              <p>Vendedores</p>
            </div>
            <Link to="/usuarios" className="stat-link">Administrar →</Link>
          </div>
        )}
      </div>

      {mostrarAlertas && stockBajo.length > 0 && (
        <div className="alertas-stock-section">
          <div className="section-header">
            <h2>⚠️ Productos con Stock Bajo</h2>
            <button className="btn-cerrar" onClick={() => setMostrarAlertas(false)}>✕</button>
          </div>
          <div className="table-responsive">
            <table className="table-stock-bajo">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Stock Mínimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {stockBajo.map((producto) => (
                  <tr key={producto.id_producto} className={producto.stock === 0 ? 'stock-cero' : ''}>
                    <td>
                      <Link to={`/productos/${producto.id_producto}`}>
                        {producto.nombre}
                      </Link>
                    </td>
                    <td>{producto.categoria}</td>
                    <td className="stock-cantidad">{producto.stock}</td>
                    <td>{producto.stock_minimo}</td>
                    <td>
                      {producto.stock === 0 ? (
                        <span className="badge badge-danger">Sin stock</span>
                      ) : producto.alerta_critica ? (
                        <span className="badge badge-warning">Crítico</span>
                      ) : (
                        <span className="badge badge-info">Bajo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="dashboard-sections">
        <div className="section">
          <h2>🏆 Productos Más Vendidos</h2>
          {productosMasVendidos.length > 0 ? (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Unidades Vendidas</th>
                    <th>Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {productosMasVendidos.map((producto, index) => (
                    <tr key={producto.id_producto}>
                      <td>
                        <span className="ranking">{index + 1}º</span>
                        {producto.nombre}
                      </td>
                      <td>{producto.categoria}</td>
                      <td className="text-center">{producto.total_vendido}</td>
                      <td className="text-bold">
                        ${parseFloat(producto.ingresos_totales).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay datos de ventas aún</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
