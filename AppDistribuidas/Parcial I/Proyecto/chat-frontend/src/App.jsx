import { Routes, Route } from 'react-router-dom'
import JoinRoom from './pages/JoinRoom.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ChatRoom from './pages/ChatRoom.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<JoinRoom />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/room/:roomId" element={<ChatRoom />} />
    </Routes>
  )
}
