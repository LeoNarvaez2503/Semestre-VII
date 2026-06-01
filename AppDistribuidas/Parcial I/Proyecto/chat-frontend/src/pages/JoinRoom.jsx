import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { joinRoom } from '../services/api.js'

export default function JoinRoom() {
  const [pin, setPin] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Use stored deviceId if available, otherwise let the backend generate one
      const storedDeviceId = localStorage.getItem('deviceId') || ''
      const data = await joinRoom(pin, nickname, storedDeviceId)

      // Persist session data
      localStorage.setItem('deviceId', data.deviceId)
      localStorage.setItem('nickname', data.nickname)
      localStorage.setItem('roomId', data.roomId)
      localStorage.setItem('roomType', data.type)

      navigate(`/room/${data.roomId}`)
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
          <h1>Chat Seguro</h1>
          <p>Ingresa el PIN de la sala y tu nickname para unirte</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pin">PIN de la sala</label>
            <input
              id="pin"
              className="form-input"
              type="text"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              placeholder="Ej: 1234"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <input
              id="nickname"
              className="form-input"
              type="text"
              placeholder="Tu nombre en el chat"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              maxLength={20}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || pin.length !== 4 || !nickname.trim()}
          >
            {loading ? <span className="spinner" /> : null}
            Unirse a la sala
          </button>
        </form>

        <div className="divider">ó</div>

        <Link to="/admin" className="btn btn-secondary btn-full">
          Acceder como Administrador
        </Link>
      </div>
    </div>
  )
}
