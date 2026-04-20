import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Modal from '../components/Modal'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function TypeBadge({ type }) {
  const map = { 'Stock In': 'badge-green', 'Stock Out': 'badge-red', 'Transfer': 'badge-blue', 'Adjustment': 'badge-orange' }
  return <span className={`badge ${map[type] || 'badge-gray'}`}>{type}</span>
}

export default function StockMovements() {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ product: '', type: 'Stock In', quantity: '', description: '' })

  useEffect(() => {
    fetch(`${API}/movements`).then(r => r.ok ? r.json() : []).then(setMovements).catch(() => {})
    fetch(`${API}/products`).then(r => r.ok ? r.json() : []).then(setProducts).catch(() => {})
  }, [])

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    if (!form.product || !form.quantity) return
    const qty = form.type === 'Stock Out' ? -Math.abs(Number(form.quantity)) : Math.abs(Number(form.quantity))
    const p = products.find(p => p.product_name === form.product)
    try {
      const res = await fetch(`${API}/movements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: form.product, sku: p?.sku || '', type: form.type, quantity: qty, description: form.description }),
      })
      if (res.ok) {
        const m = await res.json()
        setMovements(ms => [m, ...ms])
      }
    } catch {}
    setModal(false)
    setForm({ product: '', type: 'Stock In', quantity: '', description: '' })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => setModal(true)}><Plus size={15} /> Record Movement</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-700">
              <th className="table-header px-5 py-3 text-left">Date & Time</th>
              <th className="table-header px-5 py-3 text-left">Product</th>
              <th className="table-header px-5 py-3 text-left">Type</th>
              <th className="table-header px-5 py-3 text-right">Quantity</th>
              <th className="table-header px-5 py-3 text-left">Description</th>
              <th className="table-header px-5 py-3 text-left">User</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-600">No stock movements recorded.</td></tr>
            )}
            {movements.map(m => (
              <tr key={m.id} className="table-row">
                <td className="px-5 py-3.5">
                  <p className="text-sm text-gray-300">{String(m.date).split(' ')[0]}</p>
                  <p className="text-xs text-gray-600">{String(m.date).split(' ')[1] || ''}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-gray-200">{m.product}</p>
                  <p className="text-xs text-gray-500">{m.sku}</p>
                </td>
                <td className="px-5 py-3.5"><TypeBadge type={m.type} /></td>
                <td className={`px-5 py-3.5 text-sm font-semibold text-right ${m.quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {m.quantity > 0 ? '+' : ''}{m.quantity}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-400 max-w-xs truncate">{m.description}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{m.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Record Stock Movement" onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="label">Product</label>
              <select className="input" value={form.product} onChange={set('product')}>
                <option value="">Select product</option>
                {products.map(p => <option key={p.id}>{p.product_name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Movement Type</label>
              <select className="input" value={form.type} onChange={set('type')}>
                <option>Stock In</option>
                <option>Stock Out</option>
                <option>Transfer</option>
                <option>Adjustment</option>
              </select>
            </div>
            <div>
              <label className="label">Quantity</label>
              <input type="number" min="1" className="input" placeholder="Enter quantity" value={form.quantity} onChange={set('quantity')} />
            </div>
            <div>
              <label className="label">Description</label>
              <input className="input" placeholder="Movement notes…" value={form.description} onChange={set('description')} />
            </div>
            <div className="flex gap-3 pt-1">
              <button className="btn-primary" onClick={handleSave}>Save Movement</button>
              <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
