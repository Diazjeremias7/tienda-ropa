import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Ventas from './pages/Ventas';
import VentaDetalle from './pages/VentaDetalle';
import Usuarios from './pages/Usuarios';
import NuevaVenta from './pages/NuevaVenta';
import './App.css';

// Componente para proteger rutas
function ProtectedRoute({ children, requireAdmin = false }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && usuario.rol !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/:id" element={<ProductoDetalle />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="ventas/nueva" element={<NuevaVenta />} />
            <Route path="ventas/:id" element={<VentaDetalle />} />
            <Route
              path="usuarios"
              element={
                <ProtectedRoute requireAdmin>
                  <Usuarios />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;