import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, Archive, PackageSearch } from 'lucide-react'
import Modal from '../components/Modal'
import { AnimatedDownload, AnimatedUpload } from '../components/ui/animated-download'
import { db } from '../lib/api'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import SkeletonTable from '../components/ui/SkeletonRow'

function StatusBadge({ status }) {
  const map = {
    'In Stock': 'badge-green',
    'Low Stock': 'badge-yellow',
    'Out of Stock': 'badge-red',
  }
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>
}

export default function Inventory() {
  const [inventory, setInventory] = useState(null)
  const [query, setQuery] = useState('')
  const [adjustModal, setAdjustModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [adj, setAdj] = useState({ type: 'Add', quantity: '', reason: '' })

  useEffect(() => {
    db.inventory().then(setInventory).catch(() => {})
  }, [])

  const loading = inventory === null
  const filtered = (inventory || []).filter(i =>
    query === '' || i.product.toLowerCase().includes(query.toLowerCase()) || i.sku.toLowerCase().includes(query.toLowerCase())
  )

  const openAdjust = item => {
    setSelected(item)
    setAdj({ type: 'Add', quantity: '', reason: '' })
    setAdjustModal(true)
  }

  const handleAdjust = () => {
    const qty = parseInt(adj.quantity, 10)
    if (!adj.quantity || isNaN(qty) || qty < 0) return
    setInventory(prev => prev.map(item => {
      if (item.id !== selected.id) return item
      let newQty = item.qty_on_hand
      if (adj.type === 'Add')       newQty = newQty + qty
      else if (adj.type === 'Remove')    newQty = Math.max(0, newQty - qty)
      else if (adj.type === 'Set Exact') newQty = qty
      const newReserved  = Math.floor(newQty * 0.1)
      const newAvailable = newQty - newReserved
      const status = newQty === 0 ? 'Out of Stock' : newQty <= (item.qty_on_hand * 0.25 || 5) ? 'Low Stock' : 'In Stock'
      return { ...item, qty_on_hand: newQty, qty_reserved: newReserved, qty_available: newAvailable, status }
    }))
    setAdjustModal(false)
  }

  const summary = {
    inStock: (inventory || []).filter(i => i.status === 'In Stock').length,
    lowStock: (inventory || []).filter(i => i.status === 'Low Stock').length,
    outOfStock: (inventory || []).filter(i => i.status === 'Out of Stock').length,
  }

  return (
    <div className="page-container">
      <PageHeader title="Inventory" subtitle="Stock levels across all warehouse locations" icon={Archive}>
        <AnimatedUpload
          label="Import"
          accept=".csv"
          onUpload={async file => console.log('Uploading:', file.name)}
        />
        <AnimatedDownload
          label="Export"
          onDownload={async () => {
            const rows = (inventory || []).map(i => `"${i.product}","${i.sku}","${i.quantity}","${i.status}"`)
            const csv = ['Product,SKU,Quantity,Status', ...rows].join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = 'inventory.csv'; a.click()
            URL.revokeObjectURL(url)
          }}
        />
      </PageHeader>

      {/* Summary chips */}
      {!loading && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-700/50 border border-dark-500/50">
            <div className="w-2 h-2 rounded-full bg-brand" />
            <span className="text-xs text-gray-400">In Stock <strong className="text-gray-200 ml-1">{summary.inStock}</strong></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-700/50 border border-dark-500/50">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs text-gray-400">Low Stock <strong className="text-amber-300 ml-1">{summary.lowStock}</strong></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-700/50 border border-dark-500/50">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs text-gray-400">Out of Stock <strong className="text-red-300 ml-1">{summary.outOfStock}</strong></span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="search-bar flex-1 min-w-[180px] max-w-sm">
          <Search size={14} className="search-icon" />
          <input
            className="input pl-9 py-2"
            placeholder="Search inventory…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <SlidersHorizontal size={14} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-600/60 bg-dark-700/40">
              <th className="table-header px-5 py-3 text-left">Product</th>
              <th className="table-header px-5 py-3 text-right">On Hand</th>
              <th className="table-header px-5 py-3 text-right">Reserved</th>
              <th className="table-header px-5 py-3 text-right">Available</th>
              <th className="table-header px-5 py-3 text-left">Location</th>
              <th className="table-header px-5 py-3 text-left">Batch</th>
              <th className="table-header px-5 py-3 text-left">Status</th>
              <th className="table-header px-5 py-3 text-center w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <SkeletonTable rows={7} cols={8} />}

            {!loading && filtered.map(item => (
              <tr key={item.id} className="table-row">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-semibold text-gray-200">{item.product}</p>
                  <p className="text-2xs text-gray-600 font-mono mt-0.5">{item.sku}</p>
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-gray-300 text-right">{item.qty_on_hand}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500 text-right">{item.qty_reserved}</td>
                <td className={`px-5 py-3.5 text-sm font-bold text-right
                  ${item.qty_available === 0 ? 'text-red-400' : item.qty_available < 10 ? 'text-amber-400' : 'text-gray-200'}`}>
                  {item.qty_available}
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-xs text-gray-400">{item.location}</p>
                  <p className="text-2xs text-gray-600 mt-0.5">{item.warehouse}</p>
                </td>
                <td className="px-5 py-3.5 text-2xs text-gray-500 font-mono">{item.batch}</td>
                <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
                <td className="px-5 py-3.5 text-center">
                  <button
                    onClick={() => openAdjust(item)}
                    className="text-2xs font-semibold text-brand hover:text-brand-light transition-colors px-2.5 py-1 rounded-lg hover:bg-brand/10"
                  >
                    Adjust
                  </button>
                </td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <EmptyState
                    icon={PackageSearch}
                    title="No inventory records"
                    description={query ? `No results for "${query}"` : 'No inventory data available yet.'}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Adjust Modal */}
      {adjustModal && selected && (
        <Modal title={`Adjust — ${selected.product}`} onClose={() => setAdjustModal(false)}>
          <div className="space-y-4">
            <div className="flex gap-4 text-xs text-gray-400 card-inset px-4 py-3">
              <span>On hand: <strong className="text-gray-200">{selected.qty_on_hand}</strong></span>
              <span className="text-dark-300">|</span>
              <span>Available: <strong className="text-gray-200">{selected.qty_available}</strong></span>
              <span className="text-dark-300">|</span>
              <span>Reserved: <strong className="text-gray-200">{selected.qty_reserved}</strong></span>
            </div>

            <div className="form-group">
              <label className="label">Adjustment Type</label>
              <select className="input" value={adj.type} onChange={e => setAdj(a => ({ ...a, type: e.target.value }))}>
                <option>Add</option>
                <option>Remove</option>
                <option>Set Exact</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Quantity</label>
              <input
                type="number"
                min="0"
                className="input"
                placeholder="Enter quantity"
                value={adj.quantity}
                onChange={e => setAdj(a => ({ ...a, quantity: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="label">Reason</label>
              <input
                className="input"
                placeholder="Reason for adjustment…"
                value={adj.reason}
                onChange={e => setAdj(a => ({ ...a, reason: e.target.value }))}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                className="btn-primary flex-1"
                onClick={handleAdjust}
                disabled={!adj.quantity || isNaN(parseInt(adj.quantity, 10)) || parseInt(adj.quantity, 10) < 0}
              >
                Apply Adjustment
              </button>
              <button className="btn-secondary" onClick={() => setAdjustModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
