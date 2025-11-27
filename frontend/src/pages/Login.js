import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setCargando(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🛍️ Tienda de Ropa</h2>
        <h3>Iniciar Sesión</h3>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        
        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>

        <div className="demo-credentials">
          <p><strong>Credenciales de prueba:</strong></p>
          <p>Admin: admin@tienda.com / admin123</p>
          <p>Vendedor: juan@tienda.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
