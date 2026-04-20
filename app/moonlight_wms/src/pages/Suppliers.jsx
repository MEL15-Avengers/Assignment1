import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Mail, Phone, MapPin } from 'lucide-react'
import Modal from '../components/Modal'
import { db } from '../lib/api'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])

  useEffect(() => { db.suppliers().then(setSuppliers).catch(() => {}) }, [])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ supplier_name: '', email: '', phone: '', address: '' })

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const openAdd = () => { setEditing(null); setForm({ supplier_name: '', email: '', phone: '', address: '' }); setModal(true) }
  const openEdit = s => { setEditing(s); setForm({ supplier_name: s.supplier_name, email: s.email, phone: s.phone, address: s.address }); setModal(true) }

  const handleSave = () => {
    if (!form.supplier_name) return
    if (editing) {
      setSuppliers(ss => ss.map(s => s.id === editing.id ? { ...s, ...form } : s))
    } else {
      const code = `SUP-${String(suppliers.length + 1).padStart(3, '0')}`
      setSuppliers(ss => [...ss, { id: Date.now().toString(), supplier_code: code, ...form, status: 'active' }])
    }
    setModal(false)
  }

  const handleDelete = id => {
    if (window.confirm('Delete this supplier?')) setSuppliers(ss => ss.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={openAdd}><Plus size={15} /> Add Supplier</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className="card p-5 group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-200">{s.supplier_name}</p>
                  <span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{s.status}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{s.supplier_code}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(s)} className="p-1.5 rounded-md hover:bg-dark-500 text-gray-500 hover:text-gray-200 transition-colors"><Pencil size={13} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400"><Mail size={13} className="text-gray-600" />{s.email}</div>
              <div className="flex items-center gap-2 text-sm text-gray-400"><Phone size={13} className="text-gray-600" />{s.phone}</div>
              <div className="flex items-center gap-2 text-sm text-gray-400"><MapPin size={13} className="text-gray-600" />{s.address}</div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editing ? 'Edit Supplier' : 'Add Supplier'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="label">Supplier Name</label>
              <input className="input" placeholder="Company name" value={form.supplier_name} onChange={set('supplier_name')} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="orders@supplier.com" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" placeholder="+1 555 0100" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" placeholder="Street, City, State" value={form.address} onChange={set('address')} />
            </div>
            <div className="flex gap-3 pt-1">
              <button className="btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Supplier'}</button>
              <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
