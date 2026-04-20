import { NavLink, useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useAuth } from '../context/AuthContext'
import MIcon from './ui/MIcon'

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/admin/dashboard',   icon: 'dashboard',              label: 'Dashboard' },
    ],
  },
  {
    label: 'Users',
    items: [
      { to: '/admin/users',       icon: 'people',                 label: 'User Management', end: true },
      { to: '/admin/users/new',   icon: 'person_add',             label: 'Add User',         end: false },
      { to: '/admin/roles',       icon: 'manage_accounts',        label: 'Roles' },
    ],
  },
  {
    label: 'Access',
    items: [
      { to: '/admin/permissions', icon: 'admin_panel_settings',   label: 'Permissions' },
      { to: '/admin/sites',       icon: 'location_city',          label: 'Sites' },
      { to: '/admin/security',    icon: 'lock',                   label: 'Security' },
    ],
  },
  {
    label: 'Audit',
    items: [
      { to: '/admin/activity',    icon: 'timeline',               label: 'Activity Logs' },
      { to: '/admin/profile',     icon: 'account_circle',         label: 'Profile' },
    ],
  },
]

export default function AdminSidebar({ user, onLogout }) {
  const navigate = useNavigate()
  const { auth } = useAuth()
  const currentUser = auth || user
  const initials = currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col bg-gradient-sidebar border-r border-dark-600/50">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-dark-600/50">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-3 w-full hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-yellow-500/15 border border-yellow-500/25 flex items-center justify-center flex-shrink-0">
            <MIcon name="shield" size={16} className="text-yellow-400" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-bold text-white leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>Admin Panel</p>
            <p className="text-2xs text-gray-600 leading-tight tracking-wide">Moonlight WMS</p>
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
                  end={item.end ?? true}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                  }
                >
                  {({ isActive }) => (
                    <>
                      <MIcon name={item.icon} size={18} className="flex-shrink-0" />
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
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-yellow-500/5 border border-yellow-500/15 mt-1">
          <Avatar className="w-7 h-7 flex-shrink-0 ring-1 ring-yellow-500/30">
            {currentUser?.avatar && <AvatarImage src={currentUser.avatar} alt={currentUser?.name} />}
            <AvatarFallback className="bg-yellow-500/20 text-yellow-400 text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-200 truncate leading-tight">{currentUser?.name || 'Admin'}</p>
            <span className="inline-flex items-center text-2xs font-semibold px-1.5 py-0.5 rounded-md mt-0.5 text-yellow-400 bg-yellow-500/10">
              Administrator
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
