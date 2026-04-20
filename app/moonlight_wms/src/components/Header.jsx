import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import SmartSearch from './SmartSearch'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useAuth } from '../context/AuthContext'
import MIcon from './ui/MIcon'

const pageMeta = {
  '/dashboard':       { title: 'Dashboard',        crumb: null },
  '/products':        { title: 'Products',          crumb: 'Catalogue' },
  '/products/new':    { title: 'Add Product',       crumb: 'Products' },
  '/categories':      { title: 'Categories',        crumb: 'Catalogue' },
  '/suppliers':       { title: 'Suppliers',         crumb: 'Catalogue' },
  '/inventory':       { title: 'Inventory',         crumb: 'Warehouse' },
  '/batches':         { title: 'Batch Tracking',    crumb: 'Warehouse' },
  '/movements':       { title: 'Stock Movements',   crumb: 'Warehouse' },
  '/zones':           { title: 'Warehouse Zones',   crumb: 'Warehouse' },
  '/alerts':          { title: 'Alerts',            crumb: 'Insights' },
  '/notifications':   { title: 'Notifications',     crumb: 'Insights' },
  '/reports':         { title: 'Reports',           crumb: 'Insights' },
  '/audit':           { title: 'Audit Log',         crumb: 'Insights' },
  '/settings':        { title: 'Settings',          crumb: 'Account' },
  '/sm/dashboard':    { title: 'Site Dashboard',    crumb: null },
  '/sm/inventory':    { title: 'Inventory',         crumb: 'Warehouse' },
  '/sm/movements':    { title: 'Stock Movements',   crumb: 'Warehouse' },
  '/sm/batches':      { title: 'Batch Tracking',    crumb: 'Warehouse' },
  '/sm/zones':        { title: 'Zones',             crumb: 'Warehouse' },
  '/sm/products':     { title: 'Products',          crumb: 'Catalogue' },
  '/sm/categories':   { title: 'Categories',        crumb: 'Catalogue' },
  '/sm/alerts':       { title: 'Alerts',            crumb: 'Insights' },
  '/sm/reports':      { title: 'Reports',           crumb: 'Insights' },
  '/sm/audit':        { title: 'Audit Log',         crumb: 'Insights' },
  '/sm/settings':     { title: 'Settings',          crumb: 'Account' },
}

export default function Header({ user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { auth } = useAuth()
  const currentUser = auth || user

  const meta = pageMeta[location.pathname] || { title: 'Moonlight WMS', crumb: null }
  const initials = currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'U'
  const settingsPath = location.pathname.startsWith('/sm') ? '/sm/settings' : '/settings'

  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-5 gap-4
                       bg-dark-850/80 backdrop-blur-md border-b border-dark-600/50">
      {/* Left: Breadcrumb + Title */}
      <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
        {meta.crumb ? (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-gray-600 hidden sm:block">{meta.crumb}</span>
            <ChevronRight size={13} className="text-dark-300 hidden sm:block" />
            <span className="font-semibold text-white">{meta.title}</span>
          </div>
        ) : (
          <span className="text-sm font-semibold text-white">{meta.title}</span>
        )}
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <div className="flex-1 max-w-xs hidden sm:block">
          <SmartSearch />
        </div>

        {/* Notification bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative btn-icon flex-shrink-0"
          title="Notifications"
        >
          <MIcon name="notifications" size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand rounded-full ring-1 ring-dark-800" />
        </button>

        {/* Avatar */}
        <button
          onClick={() => navigate(settingsPath)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0 pl-1"
          title="Account settings"
        >
          <Avatar className="w-7 h-7 ring-1 ring-dark-400 hover:ring-brand/40 transition-all">
            {currentUser?.avatar && <AvatarImage src={currentUser.avatar} alt={currentUser?.name} />}
            <AvatarFallback className="text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-gray-400 hidden lg:block hover:text-white transition-colors">
            {currentUser?.name?.split(' ')[0] || 'User'}
          </span>
        </button>
      </div>
    </header>
  )
}
