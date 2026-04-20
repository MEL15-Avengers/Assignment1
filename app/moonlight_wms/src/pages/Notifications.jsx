import { useState, useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetch(`${API}/notifications`).then(r => r.ok ? r.json() : []).then(setNotifications).catch(() => {})
  }, [])

  const markAll = async () => {
    try {
      await fetch(`${API}/notifications/read-all`, { method: 'PATCH' })
      setNotifications(ns => ns.map(n => ({ ...n, read: true })))
    } catch {}
  }

  const markOne = async id => {
    try {
      await fetch(`${API}/notifications/${id}/read`, { method: 'PATCH' })
      setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
    } catch {}
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{unread} unread notification{unread !== 1 ? 's' : ''}</span>
        {unread > 0 && (
          <button onClick={markAll} className="flex items-center gap-1.5 text-xs text-brand hover:text-brand-light font-medium transition-colors">
            <CheckCheck size={14} /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card p-8 text-center text-sm text-gray-600">No notifications yet.</div>
      ) : (
        <div className="card divide-y divide-dark-500 overflow-hidden">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-4 cursor-pointer hover:bg-dark-700/50 transition-colors ${!n.read ? 'bg-brand/5' : ''}`}
              onClick={() => markOne(n.id)}
            >
              <div className={`mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.read ? 'bg-brand/10' : 'bg-dark-600'}`}>
                <Bell size={15} className={!n.read ? 'text-brand' : 'text-gray-500'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className={`text-sm font-medium ${!n.read ? 'text-gray-200' : 'text-gray-400'}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 bg-brand rounded-full flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                <p className="text-xs text-gray-600 mt-1.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
