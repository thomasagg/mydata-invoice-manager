import { NavLink, useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const navItems = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/clients', label: 'Clients' },
    { to: '/invoices', label: 'Invoices' },
  ]

  return (
    <aside className="w-52 bg-zinc-900 flex flex-col h-full shrink-0">
      <div className="px-4 h-14 flex items-center border-b border-white/10">
        <span className="text-sm font-semibold text-white">myDATA</span>
      </div>

      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
        {navItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `h-8 px-3 rounded-md text-sm font-medium transition-colors flex items-center ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-white/10">
        <button
          onClick={logout}
          className="h-8 px-3 rounded-md text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
