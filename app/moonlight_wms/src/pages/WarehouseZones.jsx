import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function CapacityBar({ value }) {
  const color = value >= 85 ? 'bg-red-500' : value >= 60 ? 'bg-yellow-500' : 'bg-brand'
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
        <span>Capacity</span>
        <span className={value >= 85 ? 'text-red-400' : value >= 60 ? 'text-yellow-400' : 'text-brand'}>{value}%</span>
      </div>
      <div className="w-full bg-dark-600 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function WarehouseZones() {
  const [zones, setZones] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetch(`${API}/zones`)
      .then(r => r.ok ? r.json() : { zones: [], warehouses: [] })
      .then(data => {
        setZones(data.zones || [])
        setWarehouses(data.warehouses || [])
      })
      .catch(() => {})
  }, [])

  const warehouseNames = ['All', ...warehouses.map(w => w.warehouse_name)]
  const filtered = filter === 'All' ? zones : zones.filter(z => z.warehouse === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {warehouseNames.map(w => (
          <button
            key={w}
            onClick={() => setFilter(w)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === w ? 'bg-brand text-white' : 'bg-dark-700 text-gray-400 hover:text-gray-200 hover:bg-dark-600'}`}
          >
            {w === 'All' ? 'All Warehouses' : w}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-sm text-gray-600">No zones found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(z => (
            <div key={z.id} className="card p-5">
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm font-semibold text-gray-200 leading-tight">{z.zone}</p>
                <span className={`badge flex-shrink-0 ml-2 ${z.capacity >= 85 ? 'badge-red' : z.capacity >= 60 ? 'badge-yellow' : 'badge-green'}`}>
                  {z.capacity >= 85 ? 'High' : z.capacity >= 60 ? 'Medium' : 'Low'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{z.warehouse}</p>
              <p className="text-xs text-gray-400 mt-3">{z.stored}</p>
              <CapacityBar value={z.capacity} />
            </div>
          ))}
        </div>
      )}

      <div className="card p-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-brand inline-block" /><span className="text-gray-400">Low (&lt;60%)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /><span className="text-gray-400">Medium (60–84%)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /><span className="text-gray-400">High (≥85%)</span></div>
      </div>
    </div>
  )
}
