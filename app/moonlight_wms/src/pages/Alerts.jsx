import { useState, useEffect } from 'react'
import { AlertTriangle, AlertCircle, CheckCircle, Bell } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function AlertCard({ alert, onResolve }) {
  const isCritical = alert.priority === 'Critical'
  return (
    <div className={`card p-4 flex items-start gap-4 transition-colors`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ring-1
        ${isCritical ? 'bg-red-500/10 ring-red-500/20' : 'bg-amber-500/10 ring-amber-500/20'}`}
      >
        {isCritical
          ? <AlertCircle size={16} className="text-red-400" />
          : <AlertTriangle size={16} className="text-amber-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-200 truncate">{alert.product}</p>
            <p className="text-2xs text-gray-600 mt-0.5">{alert.type} · {alert.created}</p>
          </div>
          <span className={`badge flex-shrink-0 ${isCritical ? 'badge-red' : 'badge-yellow'}`}>
            {alert.priority}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">{alert.message}</p>
        {alert.status === 'Active' && (
          <button
            onClick={() => onResolve(alert.id)}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-light transition-colors"
          >
            <CheckCircle size={12} /> Mark as Resolved
          </button>
        )}
      </div>
    </div>
  )
}

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [tab, setTab] = useState('Active')

  useEffect(() => {
    fetch(`${API}/alerts`).then(r => r.ok ? r.json() : []).then(setAlerts).catch(() => {})
  }, [])

  const resolve = async id => {
    try {
      await fetch(`${API}/alerts/${id}/resolve`, { method: 'PATCH' })
      setAlerts(as => as.map(a => a.id === id ? { ...a, status: 'Resolved' } : a))
    } catch {}
  }

  const filtered = alerts.filter(a => a.status === tab)
  const activeCount = alerts.filter(a => a.status === 'Active').length

  return (
    <div className="page-container">
      <PageHeader
        title="Alerts"
        subtitle={`${activeCount} active alert${activeCount !== 1 ? 's' : ''}`}
        icon={Bell}
      />

      <div className="tab-group w-fit">
        {['Active', 'Resolved'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? 'tab-active' : 'tab-inactive'}
          >
            {t}
            {t === 'Active' && activeCount > 0 && (
              <span className="ml-1.5 bg-red-500/90 text-white text-2xs font-bold rounded-full px-1.5 py-0.5 leading-none">
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(a => (
          <AlertCard key={a.id} alert={a} onResolve={resolve} />
        ))}

        {filtered.length === 0 && (
          <div className="card">
            <EmptyState
              icon={tab === 'Active' ? CheckCircle : Bell}
              title={tab === 'Active' ? 'All clear!' : 'No resolved alerts'}
              description={tab === 'Active'
                ? 'No active alerts right now. Everything looks good.'
                : 'Resolved alerts will appear here once you mark them.'
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
