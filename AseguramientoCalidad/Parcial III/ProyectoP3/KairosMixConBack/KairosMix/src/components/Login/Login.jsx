import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, TEST_CREDENTIALS } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular delay de autenticación
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        if (result.role === 'ADMIN') {
          navigate('/productos');
        } else {
          navigate('/mezcla-personalizada');
        }
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 500);
  };

  const fillAdminCredentials = () => {
    setEmail(TEST_CREDENTIALS.admin.email);
    setPassword(TEST_CREDENTIALS.admin.password);
    setError('');
  };

  const fillUserCredentials = () => {
    setEmail(TEST_CREDENTIALS.user.email);
    setPassword(TEST_CREDENTIALS.user.password);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🥜 KairosMix</h1>
          <p>Sistema de Gestión de Frutos Secos</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              required
              disabled={loading}
              data-testid="email-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              disabled={loading}
              data-testid="password-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
            data-testid="login-button"
          >
            {loading ? 'Autenticando...' : 'Ingresar'}
          </button>
        </form>

        <div className="credentials-section">
          <h3>Credenciales de Prueba</h3>
          
          <div className="credential-card admin">
            <div className="credential-header">👤 Administrador</div>
            <div className="credential-item">
              <span className="label">Email:</span>
              <span className="value">{TEST_CREDENTIALS.admin.email}</span>
            </div>
            <div className="credential-item">
              <span className="label">Contraseña:</span>
              <span className="value">{TEST_CREDENTIALS.admin.password}</span>
            </div>
            <button 
              type="button"
              className="fill-button admin"
              onClick={fillAdminCredentials}
              data-testid="fill-admin-button"
            >
              Cargar Credenciales
            </button>
          </div>

          <div className="credential-card user">
            <div className="credential-header">👥 Usuario</div>
            <div className="credential-item">
              <span className="label">Email:</span>
              <span className="value">{TEST_CREDENTIALS.user.email}</span>
            </div>
            <div className="credential-item">
              <span className="label">Contraseña:</span>
              <span className="value">{TEST_CREDENTIALS.user.password}</span>
            </div>
            <button 
              type="button"
              className="fill-button user"
              onClick={fillUserCredentials}
              data-testid="fill-user-button"
            >
              Cargar Credenciales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
