import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { db } from '../lib/api'

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-dark-500 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-200 font-medium">{value}</span>
    </div>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [adjustModal, setAdjustModal] = useState(false)
  const [adjustment, setAdjustment] = useState({ type: 'Add', quantity: '', reason: '' })

  useEffect(() => {
    db.products().then(items => {
      setProduct(items.find(p => p.id === id) || items[0] || product)
    }).catch(() => {})
  }, [id])

  const statusMap = { active: 'badge-green', low: 'badge-yellow', out: 'badge-red' }
  const statusLabels = { active: 'In Stock', low: 'Low Stock', out: 'Out of Stock' }

  if (!product) return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
        <ArrowLeft size={15} /> Back to Products
      </button>
      <div className="card p-6 text-sm text-gray-500 text-center py-12">Loading product…</div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
        <ArrowLeft size={15} /> Back to Products
      </button>

      <div className="card p-6">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-16 h-16 rounded-xl bg-dark-600 flex items-center justify-center flex-shrink-0">
            <Package size={28} className="text-gray-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">{product.product_name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{product.sku}</p>
              </div>
              <span className={`badge ${statusMap[product.status]}`}>{statusLabels[product.status]}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Product Details</h3>
            <Row label="Category" value={product.category} />
            <Row label="Supplier" value={product.supplier} />
            <Row label="Unit Cost" value={`$${product.unit_cost.toFixed(2)}`} />
            <Row label="Selling Price" value={`$${product.selling_price.toFixed(2)}`} />
            <Row label="Reorder Level" value={product.reorder_level} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Inventory Details</h3>
            <Row label="Stock Quantity" value={product.quantity} />
            <Row label="Warehouse" value={product.warehouse} />
            <Row label="Location" value={product.location} />
            <Row label="Batch Number" value={product.batch} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn-primary" onClick={() => setAdjustModal(true)}>Adjust Stock</button>
          <button className="btn-secondary"><Pencil size={14} /> Edit Product</button>
        </div>
      </div>

      {adjustModal && (
        <Modal title="Adjust Stock Quantity" onClose={() => setAdjustModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="label">Adjustment Type</label>
              <select className="input" value={adjustment.type} onChange={e => setAdjustment(a => ({ ...a, type: e.target.value }))}>
                <option>Add</option>
                <option>Remove</option>
                <option>Set Exact</option>
              </select>
            </div>
            <div>
              <label className="label">Quantity</label>
              <input type="number" min="0" className="input" placeholder="Enter quantity" value={adjustment.quantity} onChange={e => setAdjustment(a => ({ ...a, quantity: e.target.value }))} />
            </div>
            <div>
              <label className="label">Reason</label>
              <input className="input" placeholder="e.g. Received from supplier" value={adjustment.reason} onChange={e => setAdjustment(a => ({ ...a, reason: e.target.value }))} />
            </div>
            <div className="flex gap-3 pt-1">
              <button className="btn-primary" onClick={() => setAdjustModal(false)}>Apply</button>
              <button className="btn-secondary" onClick={() => setAdjustModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
