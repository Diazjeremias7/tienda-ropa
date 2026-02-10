import React, { useState, useEffect } from 'react';
import { 
  obtenerVentasPorCategoria, 
  obtenerVentasPorVendedor,
  obtenerVentasPeriodo,
  obtenerTallasMasVendidas 
} from '../services/api';
import './Reportes.css';

const Reportes = () => {
  const [ventasCategoria, setVentasCategoria] = useState([]);
  const [ventasVendedor, setVentasVendedor] = useState([]);
  const [ventasPeriodo, setVentasPeriodo] = useState([]);
  const [tallasMasVendidas, setTallasMasVendidas] = useState([]);
  const [diasPeriodo, setDiasPeriodo] = useState(30);
  const [diasVendedor, setDiasVendedor] = useState(30);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, [diasPeriodo, diasVendedor]);

  const cargarReportes = async () => {
    setCargando(true);
    try {
      const [categoria, vendedor, periodo, tallas] = await Promise.all([
        obtenerVentasPorCategoria(),
        obtenerVentasPorVendedor(diasVendedor),
        obtenerVentasPeriodo(diasPeriodo),
        obtenerTallasMasVendidas()
      ]);

      setVentasCategoria(categoria);
      setVentasVendedor(vendedor);
      setVentasPeriodo(periodo);
      setTallasMasVendidas(tallas);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    }
    setCargando(false);
  };

  const totalVentasCategoria = ventasCategoria.reduce((sum, cat) => sum + parseFloat(cat.ingresos_totales), 0);
  const totalUnidadesVendidas = ventasCategoria.reduce((sum, cat) => sum + parseInt(cat.cantidad_vendida), 0);

  if (cargando) {
    return <div className="loading">Cargando reportes...</div>;
  }

  return (
    <div className="reportes">
      <h1>📊 Reportes y Estadísticas</h1>

      <div className="reportes-grid">
        {/* Ventas por Categoría */}
        <div className="reporte-card reporte-destacado">
          <div className="reporte-header">
            <h2>📦 Ventas por Categoría</h2>
            <div className="reporte-totales">
              <span className="total-label">Total vendido:</span>
              <span className="total-valor">{totalUnidadesVendidas} unidades</span>
              <span className="total-monto">${totalVentasCategoria.toLocaleString()}</span>
            </div>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Unidades</th>
                  <th>Ingresos</th>
                  <th>% del Total</th>
                </tr>
              </thead>
              <tbody>
                {ventasCategoria.map((cat, index) => {
                  const porcentaje = (parseFloat(cat.ingresos_totales) / totalVentasCategoria * 100).toFixed(1);
                  return (
                    <tr key={cat.categoria}>
                      <td>
                        <span className="categoria-rank">{index + 1}</span>
                        {cat.categoria}
                      </td>
                      <td className="text-center">{cat.cantidad_vendida}</td>
                      <td className="text-bold">${parseFloat(cat.ingresos_totales).toLocaleString()}</td>
                      <td>
                        <div className="porcentaje-container">
                          <div className="porcentaje-bar" style={{ width: `${porcentaje}%` }}></div>
                          <span className="porcentaje-texto">{porcentaje}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ventas por Vendedor */}
        <div className="reporte-card">
          <div className="reporte-header">
            <h2>👥 Ranking de Vendedores</h2>
            <select 
              value={diasVendedor} 
              onChange={(e) => setDiasVendedor(parseInt(e.target.value))}
              className="periodo-select"
            >
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={90}>Últimos 90 días</option>
            </select>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Vendedor</th>
                  <th>Ventas</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ventasVendedor.map((vend, index) => (
                  <tr key={vend.id_usuario}>
                    <td>
                      {index < 3 && (
                        <span className={`medalla medalla-${index + 1}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                      {vend.nombre}
                    </td>
                    <td className="text-center">{vend.cantidad_ventas || 0}</td>
                    <td className="text-bold">${parseFloat(vend.total_ventas || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ventas por Periodo */}
        <div className="reporte-card">
          <div className="reporte-header">
            <h2>📈 Ventas por Día</h2>
            <select 
              value={diasPeriodo} 
              onChange={(e) => setDiasPeriodo(parseInt(e.target.value))}
              className="periodo-select"
            >
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={60}>Últimos 60 días</option>
            </select>
          </div>
          <div className="grafico-simple">
            {ventasPeriodo.length > 0 ? (
              <div className="barras-container">
                {ventasPeriodo.slice(-14).map((dia) => {
                  const maxVenta = Math.max(...ventasPeriodo.map(d => parseFloat(d.total_ventas)));
                  const altura = (parseFloat(dia.total_ventas) / maxVenta * 100);
                  return (
                    <div key={dia.fecha} className="barra-wrapper">
                      <div 
                        className="barra" 
                        style={{ height: `${altura}%` }}
                        title={`$${parseFloat(dia.total_ventas).toLocaleString()}`}
                      >
                        <span className="barra-valor">${(parseFloat(dia.total_ventas) / 1000).toFixed(1)}k</span>
                      </div>
                      <span className="barra-fecha">
                        {new Date(dia.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="sin-datos">No hay datos de ventas en este período</p>
            )}
          </div>
        </div>

        {/* Tallas Más Vendidas */}
        <div className="reporte-card">
          <div className="reporte-header">
            <h2>📏 Tallas Más Vendidas</h2>
          </div>
          <div className="tallas-vendidas">
            {tallasMasVendidas.map((talla, index) => {
              const maxUnidades = Math.max(...tallasMasVendidas.map(t => parseInt(t.unidades_vendidas)));
              const porcentaje = (parseInt(talla.unidades_vendidas) / maxUnidades * 100);
              return (
                <div key={talla.talla} className="talla-item">
                  <div className="talla-info">
                    <span className="talla-nombre">{talla.talla}</span>
                    <span className="talla-cantidad">{talla.unidades_vendidas} unidades</span>
                  </div>
                  <div className="talla-barra">
                    <div 
                      className="talla-barra-fill" 
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
