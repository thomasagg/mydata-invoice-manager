import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Clients from './pages/Clients'
import NewInvoice from './pages/NewInvoice'
import Invoices from './pages/Invoices'
import Dashboard from './pages/Dashboard'

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clients" element={<PrivateRoute><Layout><Clients /></Layout></PrivateRoute>} />
          <Route path="/invoices/new" element={<PrivateRoute><Layout><NewInvoice /></Layout></PrivateRoute>} />
          <Route path="/invoices" element={<PrivateRoute><Layout><Invoices /></Layout></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
