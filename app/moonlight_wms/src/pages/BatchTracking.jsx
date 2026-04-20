import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function BatchBadge({ status }) {
  const map = { 'OK': 'badge-green', 'Expiring Soon': 'badge-yellow', 'Expired': 'badge-red' }
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>
}

export default function BatchTracking() {
  const [batches, setBatches] = useState([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetch(`${API}/batches`).then(r => r.ok ? r.json() : []).then(setBatches).catch(() => {})
  }, [])

  const filtered = batches.filter(b => {
    const matchQ = query === '' ||
      b.product.toLowerCase().includes(query.toLowerCase()) ||
      b.batch_number.toLowerCase().includes(query.toLowerCase())
    const matchF = filter === 'All' || b.status === filter
    return matchQ && matchF
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="input pl-9 py-2" placeholder="Search batch or product…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-1">
          {['All', 'OK', 'Expiring Soon', 'Expired'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-brand text-white' : 'bg-dark-700 text-gray-400 hover:text-gray-200 hover:bg-dark-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-700">
              <th className="table-header px-5 py-3 text-left">Product</th>
              <th className="table-header px-5 py-3 text-left">Batch No.</th>
              <th className="table-header px-5 py-3 text-left">Mfg Date</th>
              <th className="table-header px-5 py-3 text-left">Expiry Date</th>
              <th className="table-header px-5 py-3 text-left">Location</th>
              <th className="table-header px-5 py-3 text-right">Qty</th>
              <th className="table-header px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-600">No batches found.</td></tr>
            )}
            {filtered.map(b => (
              <tr key={b.id} className="table-row">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-gray-200">{b.product}</p>
                  <p className="text-xs text-gray-500">{b.sku}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-300 font-mono">{b.batch_number}</td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{b.manufacture_date}</td>
                <td className={`px-5 py-3.5 text-sm font-medium ${b.status === 'Expired' ? 'text-red-400' : b.status === 'Expiring Soon' ? 'text-yellow-400' : 'text-gray-300'}`}>
                  {b.expiry_date}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{b.location}</td>
                <td className="px-5 py-3.5 text-sm text-gray-300 text-right">{b.quantity}</td>
                <td className="px-5 py-3.5"><BatchBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
