import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL : API_URL,
    headers : {
        'Content-Type': 'application/json'
    }
});

//interceptor para agregar token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Autenticación
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const registro = async (datos) => {
    const response = await api.post('/auth/register', datos);
    return response.data;
};

export const verificarToken = async () => {
    const response = await api.get('/auth/verify');
    return response.data;
};

// Productos
export const obtenerProductos = async () => {
    const response = await api.get('/productos');
    return response.data;
};

export const obtenerProducto = async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
};

export const crearProducto = async (datos) => {
    const response = await api.post('/productos', datos);
    return response.data;
};

export const actualizarProducto = async (id, datos) => {
    const response = await api.put(`/productos/${id}`, datos);
    return response.data;
};

export const eliminarProducto = async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
};

// Ventas
export const obtenerVentas = async () => {
    const response = await api.get('/ventas');
    return response.data;
};

export const obtenerVenta = async (id) => {
    const response = await api.get(`/ventas/${id}`);
    return response.data;
};

export const crearVenta = async (datos) => {
    const response = await api.post('/ventas', datos);
    return response.data;
};

// Usuarios
export const obtenerUsuarios = async () => {
    const response = await api.get('/usuarios');
    return response.data;
};

export const obtenerUsuario = async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
};

export const actualizarUsuario = async (id, datos) => {
    const response = await api.put(`/usuarios/${id}`, datos);
    return response.data;
};

export const eliminarUsuario = async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
};

// Tallas
export const obtenerTallas = async () => {
    const response = await api.get('/tallas');
    return response.data;
};

export const obtenerTallasProducto = async (id_producto) => {
    const response = await api.get(`/tallas/producto/${id_producto}`);
    return response.data;
};

export const crearTalla = async (datos) => {
    const response = await api.post('/tallas', datos);
    return response.data;
};

export const agregarTallaProducto = async (datos) => {
    const response = await api.post('/tallas/producto', datos);
    return response.data;
};

export const actualizarStockTalla = async (id, stock) => {
    const response = await api.put(`/tallas/producto/${id}`, { stock });
    return response.data;
};

// Reportes
export const obtenerDashboard = async () => {
    const response = await api.get('/reportes/dashboard');
    return response.data;
};

export const obtenerVentasPeriodo = async (dias = 30) => {
    const response = await api.get(`/reportes/ventas-periodo?dias=${dias}`);
    return response.data;
};

export const obtenerProductosMasVendidos = async (limite = 10) => {
    const response = await api.get(`/reportes/productos-mas-vendidos?limite=${limite}`);
    return response.data;
};

export const obtenerVentasPorCategoria = async () => {
    const response = await api.get('/reportes/ventas-por-categoria');
    return response.data;
};

export const obtenerVentasPorVendedor = async (dias = 30) => {
    const response = await api.get(`/reportes/ventas-por-vendedor?dias=${dias}`);
    return response.data;
};

export const obtenerProductosStockBajo = async () => {
    const response = await api.get('/reportes/stock-bajo');
    return response.data;
};

export const obtenerTallasMasVendidas = async () => {
    const response = await api.get('/reportes/tallas-mas-vendidas');
    return response.data;
};

export const obtenerVentasPorMes = async () => {
    const response = await api.get('/reportes/ventas-por-mes');
    return response.data;
};

export default api;