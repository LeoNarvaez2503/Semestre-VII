import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminLogin } from '../services/api.js'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await adminLogin(username, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h1>Admin</h1>
          <p>Ingresa tus credenciales de administrador</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-user">Usuario</label>
            <input
              id="admin-user"
              className="form-input"
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-pass">Contraseña</label>
            <input
              id="admin-pass"
              className="form-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !username.trim() || !password.trim()}
          >
            {loading ? <span className="spinner" /> : null}
            Iniciar sesión
          </button>
        </form>

        <div className="divider">ó</div>

        <Link to="/" className="btn btn-secondary btn-full">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
