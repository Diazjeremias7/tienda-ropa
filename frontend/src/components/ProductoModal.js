import React, { useState, useEffect } from 'react';
import { obtenerTallas, obtenerTallasProducto } from '../services/api';
import './ProductoModal.css';

const ProductoModal = ({ producto, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    stock_minimo: 5,
    categoria: '',
    color: ''
  });
  
  const [tallas, setTallas] = useState([]);
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState({});

  useEffect(() => {
    cargarTallas();
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        stock: producto.stock || '',
        stock_minimo: producto.stock_minimo || 5,
        categoria: producto.categoria || '',
        color: producto.color || ''
      });
      if (producto.id_producto) {
        cargarTallasProducto(producto.id_producto);
      }
    }
  }, [producto]);

  const cargarTallas = async () => {
    try {
      const response = await obtenerTallas();
      setTallas(response);
    } catch (error) {
      console.error('Error al cargar tallas:', error);
    }
  };

  const cargarTallasProducto = async (idProducto) => {
    try {
      const response = await obtenerTallasProducto(idProducto);
      const tallasMap = {};
      response.forEach(t => {
        tallasMap[t.id_talla] = t.stock;
      });
      setTallasSeleccionadas(tallasMap);
    } catch (error) {
      console.error('Error al cargar tallas del producto:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTallaChange = (idTalla, stock) => {
    setTallasSeleccionadas({
      ...tallasSeleccionadas,
      [idTalla]: parseInt(stock) || 0
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calcular el stock total sumando todas las tallas
    const stockTotal = Object.values(tallasSeleccionadas).reduce((sum, stock) => sum + (parseInt(stock) || 0), 0);
    
    const dataToSend = {
      ...formData,
      stock: stockTotal,
      tallas: tallasSeleccionadas
    };
    
    onGuardar(dataToSend);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock Mínimo</label>
              <input
                type="number"
                name="stock_minimo"
                value={formData.stock_minimo}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                <option value="">Seleccionar...</option>
                <option value="Remeras">Remeras</option>
                <option value="Pantalones">Pantalones</option>
                <option value="Buzos">Buzos</option>
                <option value="Camperas">Camperas</option>
                <option value="Calzado">Calzado</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>

            <div className="form-group">
              <label>Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Ej: Negro, Blanco, Azul"
              />
            </div>
          </div>

          <div className="form-group tallas-section">
            <label>Tallas y Stock por Talla</label>
            <div className="tallas-grid">
              {tallas.map(talla => (
                <div key={talla.id_talla} className="talla-item">
                  <label className="talla-label">{talla.nombre}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={tallasSeleccionadas[talla.id_talla] || ''}
                    onChange={(e) => handleTallaChange(talla.id_talla, e.target.value)}
                    className="talla-input"
                  />
                </div>
              ))}
            </div>
            <small className="tallas-info">
              Stock total: {Object.values(tallasSeleccionadas).reduce((sum, stock) => sum + (parseInt(stock) || 0), 0)} unidades
            </small>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoModal;
