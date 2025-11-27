import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProductoModal from '../components/ProductoModal';
import './Productos.css';

function Productos() {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    categoria: '',
    precioMin: '',
    precioMax: ''
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, [filtros]);

  const cargarProductos = async () => {
    try {
      const params = new URLSearchParams();
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      if (filtros.categoria) params.append('categoria', filtros.categoria);
      if (filtros.precioMin) params.append('precioMin', filtros.precioMin);
      if (filtros.precioMax) params.append('precioMax', filtros.precioMax);

      const response = await api.get(`/productos?${params}`);
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await api.get('/productos/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await api.delete(`/productos/${id}`);
      cargarProductos();
    } catch (error) {
      alert('Error al eliminar producto');
    }
  };

  const handleGuardarProducto = () => {
    cargarProductos();
    setMostrarModal(false);
    setProductoEditando(null);
  };

  return (
    <div className="productos-container">
      <div className="page-header">
        <h1>Productos</h1>
        {usuario?.rol === 'admin' && (
          <button
            className="btn-primary"
            onClick={() => {
              setProductoEditando(null);
              setMostrarModal(true);
            }}
          >
            + Nuevo Producto
          </button>
        )}
      </div>

      <div className="filtros-container">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtros.busqueda}
          onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
          className="input-busqueda"
        />

        <select
          value={filtros.categoria}
          onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
          className="select-filter"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Precio mín"
          value={filtros.precioMin}
          onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
          className="input-precio"
        />

        <input
          type="number"
          placeholder="Precio máx"
          value={filtros.precioMax}
          onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
          className="input-precio"
        />

        <button
          onClick={() => setFiltros({ busqueda: '', categoria: '', precioMin: '', precioMax: '' })}
          className="btn-limpiar"
        >
          Limpiar filtros
        </button>
      </div>

      {cargando ? (
        <div className="loading">Cargando productos...</div>
      ) : (
        <div className="productos-grid">
          {productos.map((producto) => (
            <div key={producto.id_producto} className="producto-card">
              <div className="producto-header">
                <h3>{producto.nombre}</h3>
                <span className={`badge ${producto.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                  {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}
                </span>
              </div>

              <p className="producto-descripcion">{producto.descripcion}</p>

              <div className="producto-info">
                <span className="badge badge-info">{producto.categoria}</span>
                {producto.color && (
                  <span className="badge badge-secondary">{producto.color}</span>
                )}
              </div>

              <div className="producto-footer">
                <span className="producto-precio">${producto.precio.toLocaleString()}</span>
                
                <div className="producto-acciones">
                  <Link to={`/productos/${producto.id_producto}`} className="btn-ver">
                    Ver
                  </Link>
                  {usuario?.rol === 'admin' && (
                    <>
                      <button
                        className="btn-editar"
                        onClick={() => {
                          setProductoEditando(producto);
                          setMostrarModal(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleEliminar(producto.id_producto)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!cargando && productos.length === 0 && (
        <div className="no-data">No se encontraron productos</div>
      )}

      {mostrarModal && (
        <ProductoModal
          producto={productoEditando}
          onClose={() => {
            setMostrarModal(false);
            setProductoEditando(null);
          }}
          onGuardar={handleGuardarProducto}
        />
      )}
    </div>
  );
}

export default Productos;