import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { obtenerProductos, crearVenta } from '../services/api';
import './NuevaVenta.css';

const NuevaVenta = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(data.filter(p => p.stock > 0));
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.id_producto === producto.id_producto);
    
    if (existe) {
      if (existe.cantidad < producto.stock) {
        setCarrito(carrito.map(item =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ));
      } else {
        alert('No hay suficiente stock');
      }
    } else {
      setCarrito([...carrito, {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        precio_unitario: producto.precio,
        cantidad: 1,
        stock: producto.stock
      }]);
    }
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }

    const producto = carrito.find(item => item.id_producto === id);
    if (nuevaCantidad > producto.stock) {
      alert('No hay suficiente stock');
      return;
    }

    setCarrito(carrito.map(item =>
      item.id_producto === id ? { ...item, cantidad: nuevaCantidad } : item
    ));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id_producto !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
  };

  const handleVender = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setCargando(true);

    try {
      await crearVenta({
        productos: carrito.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        }))
      });

      alert('Venta registrada exitosamente');
      navigate('/ventas');
    } catch (error) {
      alert('Error al registrar la venta: ' + (error.response?.data?.error || error.message));
    }

    setCargando(false);
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="nueva-venta">
      <h1>Nueva Venta</h1>

      <div className="venta-container">
        <div className="productos-disponibles">
          <h2>Productos Disponibles</h2>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />

          <div className="productos-list">
            {productosFiltrados.map(producto => (
              <div key={producto.id_producto} className="producto-item">
                <div className="producto-info">
                  <h4>{producto.nombre}</h4>
                  <p>{producto.categoria} - {producto.color}</p>
                  <span className="precio">${parseFloat(producto.precio).toLocaleString()}</span>
                  <span className="stock-badge">Stock: {producto.stock}</span>
                </div>
                <button
                  onClick={() => agregarAlCarrito(producto)}
                  className="btn-agregar"
                >
                  + Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="carrito-venta">
          <h2>Carrito de Venta</h2>
          
          {carrito.length === 0 ? (
            <p className="carrito-vacio">El carrito está vacío</p>
          ) : (
            <>
              <div className="carrito-items">
                {carrito.map(item => (
                  <div key={item.id_producto} className="carrito-item">
                    <div className="item-info">
                      <h4>{item.nombre}</h4>
                      <p>${parseFloat(item.precio_unitario).toLocaleString()} c/u</p>
                    </div>
                    <div className="item-controls">
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.cantidad}
                        onChange={(e) => actualizarCantidad(item.id_producto, parseInt(e.target.value))}
                      />
                      <button
                        onClick={() => eliminarDelCarrito(item.id_producto)}
                        className="btn-eliminar"
                      >
                        ×
                      </button>
                    </div>
                    <div className="item-subtotal">
                      ${(item.precio_unitario * item.cantidad).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="carrito-total">
                <h3>Total: ${calcularTotal().toLocaleString()}</h3>
                <button
                  onClick={handleVender}
                  disabled={cargando}
                  className="btn-vender"
                >
                  {cargando ? 'Procesando...' : 'Confirmar Venta'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NuevaVenta;
