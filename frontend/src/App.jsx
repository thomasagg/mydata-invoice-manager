import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <div className="p-8">
              <h1 className="text-2xl font-bold text-zinc-900">Dashboard coming soon</h1>
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
