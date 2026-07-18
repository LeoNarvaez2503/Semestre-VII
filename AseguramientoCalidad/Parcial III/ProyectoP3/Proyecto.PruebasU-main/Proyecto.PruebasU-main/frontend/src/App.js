import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import EmpleadoDetalle from './components/EmpleadoDetalle';
import { isAuthenticated, logout, getCurrentUser } from './services/authService';

// ErrorBoundary simple para evitar "pantalla blanca" y mostrar información de diagnóstico
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // guardamos info para mostrarla y la enviamos a consola
    this.setState({ info });
    console.error('ErrorBoundary captured:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24 }}>
          <h2 style={{ color: '#b91c1c' }}>Ha ocurrido un error al cargar la aplicación</h2>
          <p>Revisa la consola del navegador (F12 → Console) y la terminal donde ejecutaste <code>npm start</code>.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>
            <summary style={{ cursor: 'pointer' }}>Detalles (mostrar/ocultar)</summary>
            <div>
              {String(this.state.error && this.state.error.toString())}
              {this.state.info?.componentStack ? '\n\n' + this.state.info.componentStack : ''}
            </div>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      setCurrentUser(getCurrentUser());
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const detalle = { nombreCompleto: currentUser?.nombre || 'Administrador', id: currentUser?.id || 'admin-1' };

  return (
    <div className="App">
      <div className="app-header">
        <h1 className="app-title">Concesionaria - Panel</h1>
        <div className="user-info">
          <span>Bienvenido: {currentUser?.email}</span>
          <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
        </div>
      </div>

      <div className="app-container">
        <ErrorBoundary>
          {/* Panel CRUD autos */}
          <EmpleadoDetalle detalle={detalle} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
