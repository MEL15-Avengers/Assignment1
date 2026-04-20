import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useAuth } from '../context/AuthContext'
import MIcon from './ui/MIcon'

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard',  icon: 'dashboard',         label: 'Dashboard' },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { to: '/products',   icon: 'inventory_2',        label: 'Products' },
      { to: '/categories', icon: 'category',           label: 'Categories' },
      { to: '/suppliers',  icon: 'local_shipping',     label: 'Suppliers' },
    ],
  },
  {
    label: 'Warehouse',
    items: [
      { to: '/inventory',  icon: 'inventory',          label: 'Inventory' },
      { to: '/batches',    icon: 'layers',              label: 'Batches' },
      { to: '/movements',  icon: 'swap_horiz',          label: 'Movements' },
      { to: '/zones',      icon: 'location_on',         label: 'Zones' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/alerts',        icon: 'warning',          label: 'Alerts' },
      { to: '/notifications', icon: 'notifications',    label: 'Notifications' },
      { to: '/reports',       icon: 'bar_chart',        label: 'Reports' },
      { to: '/audit',         icon: 'history',          label: 'Audit Log' },
    ],
  },
]

const roleColors = {
  Admin:         'text-yellow-400 bg-yellow-500/10',
  Manager:       'text-blue-400 bg-blue-500/10',
  Employee:      'text-gray-400 bg-dark-600',
  'Site Manager':'text-orange-400 bg-orange-500/10',
}

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate()
  const { auth } = useAuth()
  const currentUser = auth || user
  const initials = currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'U'
  const roleColor = roleColors[currentUser?.role] || roleColors.Employee

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col bg-gradient-sidebar border-r border-dark-600/50">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-dark-600/50">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 w-full hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
            <MIcon name="local_grocery_store" size={16} className="text-brand" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-bold text-white leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>Moonlight</p>
            <p className="text-2xs text-gray-600 leading-tight tracking-wide">WMS · Grocery</p>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-2.5 py-3 space-y-4">
        {navSections.map(section => (
          <div key={section.label}>
            <p className="sidebar-section-label">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                  }
                >
                  {({ isActive }) => (
                    <>
                      <MIcon name={item.icon} size={1} className="flex-shrink-0" />
                      <span className="flex-1 text-sm">{item.label}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2.5 pb-3 pt-2 border-t border-dark-600/50 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}
        >
          <MIcon name="settings" size={1} className="flex-shrink-0" />
          <span className="text-sm">Settings</span>
        </NavLink>

        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-dark-700/40 border border-dark-600/40 mt-1">
          <Avatar className="w-7 h-7 flex-shrink-0 ring-1 ring-dark-400">
            {currentUser?.avatar && <AvatarImage src={currentUser.avatar} alt={currentUser?.name} />}
            <AvatarFallback className="text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-200 truncate leading-tight">{currentUser?.name || 'User'}</p>
            <span className={`inline-flex items-center text-2xs font-medium px-1.5 py-0.5 rounded-md mt-0.5 ${roleColor}`}>
              {currentUser?.role || 'Employee'}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
