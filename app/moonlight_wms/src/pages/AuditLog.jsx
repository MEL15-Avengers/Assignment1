import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function TypeBadge({ type }) {
  const map = {
    Inventory: 'badge-blue',
    Product: 'badge-green',
    Admin: 'badge-purple',
    Supplier: 'badge-orange',
    Report: 'badge-gray',
    System: 'badge-yellow',
  }
  return <span className={`badge ${map[type] || 'badge-gray'}`}>{type}</span>
}

export default function AuditLog() {
  const [logs, setLogs] = useState([])
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  useEffect(() => {
    fetch(`${API}/audit-logs`).then(r => r.ok ? r.json() : []).then(setLogs).catch(() => {})
  }, [])

  const types = ['All', 'Inventory', 'Product', 'Admin', 'Supplier', 'Report', 'System']

  const filtered = logs.filter(l => {
    const matchQ = query === '' ||
      l.user.toLowerCase().includes(query.toLowerCase()) ||
      l.action.toLowerCase().includes(query.toLowerCase()) ||
      l.detail.toLowerCase().includes(query.toLowerCase())
    const matchT = typeFilter === 'All' || l.type === typeFilter
    return matchQ && matchT
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="input pl-9 py-2" placeholder="Search logs…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${typeFilter === t ? 'bg-brand text-white' : 'bg-dark-700 text-gray-400 hover:text-gray-200 hover:bg-dark-600'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-700">
              <th className="table-header px-5 py-3 text-left">Time</th>
              <th className="table-header px-5 py-3 text-left">User</th>
              <th className="table-header px-5 py-3 text-left">Action</th>
              <th className="table-header px-5 py-3 text-left">Type</th>
              <th className="table-header px-5 py-3 text-left">Detail</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="table-row">
                <td className="px-5 py-3.5">
                  <p className="text-xs text-gray-400">{String(l.time).split(' ')[0]}</p>
                  <p className="text-xs text-gray-600">{String(l.time).split(' ')[1] || ''}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-300">{l.user}</td>
                <td className="px-5 py-3.5 text-sm font-medium text-gray-200">{l.action}</td>
                <td className="px-5 py-3.5"><TypeBadge type={l.type} /></td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{l.detail}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-600">No log entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-600">{filtered.length} of {logs.length} entries</p>
    </div>
  )
}
