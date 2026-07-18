import React, { useState } from "react";
import { login } from "../services/authService";
import "../styles/Login.css";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("admin@consecionaria.com");
  const [password, setPassword] = useState("consesionariachida");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Email y contraseña son requeridos");
        setLoading(false);
        return;
      }

      console.log("Intentando login con:", { email });
      const result = await login(email, password);
      console.log("Login exitoso:", result);
      
      setSuccess(true);
      setEmail("");
      setPassword("");
      
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess(result.user);
        }, 500);
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Error al hacer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login - Concesionaria</h2>
        
        {error && <div className="error-message">❌ {error}</div>}
        {success && <div className="success-message">✓ ¡Login exitoso! Redirigiendo...</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@consecionaria.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="consesionariachida"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading || success}
          >
            {loading ? "Cargando..." : success ? "Entrando..." : "Ingresar"}
          </button>
        </form>

        <div className="credentials-info">
          <p><strong>Credenciales de prueba:</strong></p>
          <p>Email: admin@consecionaria.com</p>
          <p>Contraseña: consesionariachida</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
