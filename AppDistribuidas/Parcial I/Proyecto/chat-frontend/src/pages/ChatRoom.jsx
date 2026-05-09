import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRoomInfo, uploadFile } from '../services/api.js'
import { connect, subscribeToRoom, sendMessage, disconnect } from '../services/websocket.js'

export default function ChatRoom() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const nickname = localStorage.getItem('nickname')
  const roomType = localStorage.getItem('roomType')

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [files, setFiles] = useState([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // Redirect if no session
  useEffect(() => {
    if (!nickname || !roomId) {
      navigate('/')
    }
  }, [nickname, roomId, navigate])

  // Connect WebSocket + load room info
  useEffect(() => {
    if (!nickname || !roomId) return

    let isMounted = true;
    let subscription = null

    async function init() {
      try {
        // Load room info
        const info = await getRoomInfo(roomId)
        if (!isMounted) return;

        setUsers(info.users || [])
        setFiles(info.files || [])

        // Connect to WebSocket
        await connect()
        if (!isMounted) return;

        setConnected(true)

        // Add system message
        setMessages((prev) => [
          ...prev,
          { system: true, message: `Te has conectado a la sala #${roomId}` },
        ])

        // Subscribe to room messages
        subscription = subscribeToRoom(roomId, (msg) => {
          if (msg.error) {
            setError(msg.error)
            return
          }
          setMessages((prev) => [...prev, msg])
        })
      } catch (err) {
        if (isMounted) {
          setError('No se pudo conectar al chat: ' + err.message)
        }
      }
    }

    init()

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe()
      disconnect()
    }
  }, [roomId, nickname])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Refresh user list periodically
  useEffect(() => {
    if (!roomId) return
    const interval = setInterval(async () => {
      try {
        const info = await getRoomInfo(roomId)
        setUsers(info.users || [])
        setFiles(info.files || [])
      } catch {
        // Ignore periodic refresh errors
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [roomId])

  function handleSend(e) {
    e.preventDefault()
    if (!input.trim() || !connected) return

    sendMessage(roomId, nickname, input.trim())
    setInput('')
  }

  async function handleUpload() {
    if (!selectedFile) return
    setUploadError('')
    setUploading(true)

    try {
      await uploadFile(roomId, nickname, selectedFile)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''

      // Refresh files
      const info = await getRoomInfo(roomId)
      setFiles(info.files || [])

      // Send system-like message about the upload
      sendMessage(roomId, nickname, `📎 Archivo compartido: ${selectedFile.name}`)
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }

  function handleLeave() {
    localStorage.removeItem('nickname')
    localStorage.removeItem('roomId')
    localStorage.removeItem('roomType')
    disconnect()
    navigate('/')
  }

  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="chat-page">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-info">
          <h2>#{roomId}</h2>
          <span className={`badge badge-${(roomType || 'texto').toLowerCase()}`}>
            {roomType || 'TEXTO'}
          </span>
          {connected ? (
            <span className="badge badge-online">● Conectado</span>
          ) : (
            <span className="badge" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
              Desconectado
            </span>
          )}
        </div>
        <button onClick={handleLeave} className="btn btn-secondary btn-sm">
          Salir
        </button>
      </header>

      {error && (
        <div className="alert alert-error" style={{ margin: 'var(--space-3) var(--space-6)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {/* Body */}
      <div className="chat-body">
        {/* Messages */}
        <div className="chat-messages">
          <div className="messages-list">
            {messages.map((msg, i) => {
              if (msg.system) {
                return (
                  <div key={i} className="message message-system">
                    <div className="message-bubble">{msg.message}</div>
                  </div>
                )
              }

              const isOwn = msg.nickname === nickname
              return (
                <div key={i} className={`message ${isOwn ? 'message-own' : 'message-other'}`}>
                  {!isOwn && <div className="message-sender">{msg.nickname}</div>}
                  <div className="message-bubble">{msg.message}</div>
                  <div className="message-time">{formatTime(msg.timestamp)}</div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* File upload area (only for MULTIMEDIA rooms) */}
          {roomType === 'MULTIMEDIA' && (
            <div className="file-upload-area">
              {uploadError && (
                <div className="alert alert-error" style={{ marginBottom: 'var(--space-3)' }}>
                  {uploadError}
                </div>
              )}
              <div className="file-input-wrapper">
                <label className="file-label" htmlFor="file-upload">
                  📎 Elegir archivo
                </label>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/gif,application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                />
                {selectedFile && (
                  <>
                    <span className="file-name">{selectedFile.name}</span>
                    <button
                      onClick={handleUpload}
                      className="btn btn-primary btn-sm"
                      disabled={uploading}
                    >
                      {uploading ? <span className="spinner" /> : 'Subir'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Chat input */}
          <div className="chat-input-area">
            <form className="chat-input-form" onSubmit={handleSend}>
              <input
                className="form-input"
                type="text"
                placeholder="Escribe un mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!connected}
                autoFocus
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!connected || !input.trim()}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Usuarios ({users.length})</h3>
          {users.map((user) => (
            <div key={user} className="user-item">
              <div className="user-avatar">
                {user.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">
                {user}
                {user === nickname ? ' (tú)' : ''}
              </span>
            </div>
          ))}

          {files.length > 0 && (
            <div className="files-section">
              <h3>Archivos ({files.length})</h3>
              {files.map((file) => (
                <div key={file.id} className="file-item">
                  <div className="file-item-info">
                    <span className="file-item-name" title={file.originalName}>
                      {file.originalName}
                    </span>
                  </div>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    Abrir
                  </a>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
