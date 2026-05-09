import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminStatus, adminLogout, createRoom } from '../services/api.js'

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([])
  const [pin, setPin] = useState('')
  const [roomType, setRoomType] = useState('TEXTO')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await adminStatus()
        if (!data.logged) {
          navigate('/admin')
        }
      } catch {
        navigate('/admin')
      } finally {
        setChecking(false)
      }
    }
    checkAuth()
  }, [navigate])

  async function handleCreateRoom(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const data = await createRoom(pin, roomType)
      setRooms((prev) => [
        { id: data.roomId, type: data.type, pin },
        ...prev,
      ])
      setSuccess(`Sala creada: ${data.roomId} (PIN: ${pin})`)
      setPin('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await adminLogout()
    } catch {
      // Ignore logout errors
    }
    navigate('/admin')
  }

  if (checking) {
    return (
      <div className="page">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="card card-wide">
        <div className="card-header">
          <h1>Panel de Admin</h1>
          <p>Crea y gestiona salas de chat</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleCreateRoom}>
          <div className="form-group">
            <label htmlFor="room-pin">PIN de la sala (4 dígitos)</label>
            <input
              id="room-pin"
              className="form-input"
              type="text"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              placeholder="Ej: 5678"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="room-type">Tipo de sala</label>
            <select
              id="room-type"
              className="form-select"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="TEXTO">Texto — solo mensajes</option>
              <option value="MULTIMEDIA">Multimedia — mensajes y archivos</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || pin.length !== 4}
          >
            {loading ? <span className="spinner" /> : null}
            Crear sala
          </button>
        </form>

        {rooms.length > 0 && (
          <div className="rooms-grid">
            <div className="divider">Salas creadas en esta sesión</div>
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-card-info">
                  <span className="room-card-id">#{room.id}</span>
                  <span className="room-card-meta">PIN: {room.pin}</span>
                </div>
                <span className={`badge badge-${room.type.toLowerCase()}`}>
                  {room.type}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)' }}>
          <Link to="/" className="btn btn-secondary" style={{ flex: 1 }}>
            Ir al chat
          </Link>
          <button onClick={handleLogout} className="btn btn-danger" style={{ flex: 1 }}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
