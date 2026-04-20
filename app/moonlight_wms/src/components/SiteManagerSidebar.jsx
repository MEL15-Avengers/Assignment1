import { NavLink, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from './ui/avatar'
import MIcon from './ui/MIcon'

const navSections = [
  {
    label: 'Site Ops',
    items: [
      { to: '/sm/dashboard',  icon: 'dashboard',      label: 'Dashboard' },
      { to: '/sm/inventory',  icon: 'inventory',       label: 'Inventory' },
      { to: '/sm/movements',  icon: 'swap_horiz',      label: 'Movements' },
      { to: '/sm/batches',    icon: 'layers',          label: 'Batches' },
      { to: '/sm/zones',      icon: 'location_on',     label: 'Zones' },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { to: '/sm/products',   icon: 'inventory_2',    label: 'Products' },
      { to: '/sm/categories', icon: 'category',       label: 'Categories' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/sm/alerts',  icon: 'warning',          label: 'Alerts' },
      { to: '/sm/reports', icon: 'bar_chart',        label: 'Reports' },
      { to: '/sm/audit',   icon: 'history',          label: 'Audit Log' },
    ],
  },
]

export default function SiteManagerSidebar({ user, onLogout }) {
  const navigate = useNavigate()
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'SM'

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col bg-gradient-sidebar border-r border-dark-600/50">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-dark-600/50">
        <button
          onClick={() => navigate('/sm/dashboard')}
          className="flex items-center gap-3 w-full hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
            <MIcon name="store" size={16} className="text-brand" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-bold text-white leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>Moonlight</p>
            <p className="text-2xs text-gray-600 leading-tight tracking-wide">{user?.site || 'Site'} Store</p>
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
          to="/sm/settings"
          className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}
        >
          <MIcon name="settings" size={1} className="flex-shrink-0" />
          <span className="text-sm">Settings</span>
        </NavLink>

        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-dark-700/40 border border-dark-600/40 mt-1">
          <Avatar className="w-7 h-7 flex-shrink-0 ring-1 ring-brand/20">
            <AvatarFallback className="bg-brand/15 text-brand text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-200 truncate leading-tight">{user?.name || 'Site Manager'}</p>
            <span className="inline-flex items-center text-2xs font-medium px-1.5 py-0.5 rounded-md mt-0.5 text-orange-400 bg-orange-500/10">
              Site Manager
            </span>
          </div>
          <button
            onClick={onLogout}
            className="btn-icon-sm flex-shrink-0 hover:text-red-400 hover:bg-red-500/10"
            title="Sign out"
          >
            <MIcon name="logout" size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
