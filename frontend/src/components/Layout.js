import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🛍️ Tienda de Ropa</h1>
        </div>
        <div className="navbar-menu">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/ventas">Ventas</Link>
          <Link to="/ventas/nueva">Nueva Venta</Link>
          {usuario?.rol === 'admin' && (
            <Link to="/usuarios">Usuarios</Link>
          )}
        </div>
        <div className="navbar-user">
          <span>👤 {usuario?.nombre}</span>
          <span className="badge">{usuario?.rol}</span>
          <button onClick={handleLogout} className="btn-logout">
            Salir
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
