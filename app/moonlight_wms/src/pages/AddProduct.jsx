import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, CheckCircle } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { db } from '../lib/api'

export default function AddProduct() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [warehouses, setWarehouses] = useState([])

  useEffect(() => {
    db.categories().then(setCategories).catch(() => {})
    db.suppliers().then(setSuppliers).catch(() => {})
    db.warehouses().then(setWarehouses).catch(() => {})
  }, [])

  const [form, setForm] = useState({
    product_name: '', sku: '', category_id: '', supplier_id: '',
    selling_price: '', unit_cost: '', quantity: '', reorder_level: '',
    warehouse_id: '', description: '',
  })
  const [saved, setSaved] = useState(false)
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => navigate('/products'), 1200)
  }

  const margin = form.selling_price && form.unit_cost
    ? (((form.selling_price - form.unit_cost) / form.selling_price) * 100).toFixed(1)
    : null

  return (
    <div className="page-container max-w-2xl">
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-200 transition-colors"
      >
        <ArrowLeft size={13} /> Back to Products
      </button>

      <PageHeader title="Add Product" subtitle="Create a new product listing" icon={Package} />

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div>
            <p className="text-2xs font-bold text-gray-600 uppercase tracking-widest mb-3">Basic Information</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Product Name <span className="text-red-500">*</span></label>
                <input className="input" placeholder="e.g. Organic Apples" value={form.product_name} onChange={set('product_name')} required />
              </div>
              <div className="form-group">
                <label className="label">SKU / Barcode <span className="text-red-500">*</span></label>
                <input className="input font-mono" placeholder="SKU-0099" value={form.sku} onChange={set('sku')} required />
              </div>
              <div className="form-group">
                <label className="label">Category <span className="text-red-500">*</span></label>
                <select className="input" value={form.category_id} onChange={set('category_id')} required>
                  <option value="">Select category…</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Supplier <span className="text-red-500">*</span></label>
                <select className="input" value={form.supplier_id} onChange={set('supplier_id')} required>
                  <option value="">Select supplier…</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplier_name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <p className="text-2xs font-bold text-gray-600 uppercase tracking-widest mb-3">Pricing & Stock</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="label">Unit Cost ($) <span className="text-red-500">*</span></label>
                <input type="number" min="0" step="0.01" className="input" placeholder="0.00" value={form.unit_cost} onChange={set('unit_cost')} required />
              </div>
              <div className="form-group">
                <label className="label">Selling Price ($) <span className="text-red-500">*</span></label>
                <input type="number" min="0" step="0.01" className="input" placeholder="0.00" value={form.selling_price} onChange={set('selling_price')} required />
              </div>
              <div className="form-group">
                <label className="label">Initial Qty <span className="text-red-500">*</span></label>
                <input type="number" min="0" className="input" placeholder="0" value={form.quantity} onChange={set('quantity')} required />
              </div>
            </div>
            {margin !== null && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span>Gross margin:</span>
                <span className={`font-semibold ${parseFloat(margin) > 0 ? 'text-brand' : 'text-red-400'}`}>
                  {margin}%
                </span>
              </div>
            )}
          </div>

          {/* Warehouse */}
          <div>
            <p className="text-2xs font-bold text-gray-600 uppercase tracking-widest mb-3">Warehouse</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Reorder Level</label>
                <input type="number" min="0" className="input" placeholder="Min. stock threshold" value={form.reorder_level} onChange={set('reorder_level')} />
              </div>
              <div className="form-group">
                <label className="label">Warehouse <span className="text-red-500">*</span></label>
                <select className="input" value={form.warehouse_id} onChange={set('warehouse_id')} required>
                  <option value="">Select warehouse…</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.warehouse_name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Optional product description…"
              value={form.description}
              onChange={set('description')}
            />
          </div>

          {saved && (
            <div className="notice-success">
              <CheckCircle size={14} className="flex-shrink-0" />
              <span>Product created! Redirecting…</span>
            </div>
          )}

          <div className="flex gap-3 pt-1 border-t border-dark-600/50">
            <button type="submit" className="btn-primary" disabled={saved}>
              {saved ? <><CheckCircle size={14} /> Created!</> : 'Create Product'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/products')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
