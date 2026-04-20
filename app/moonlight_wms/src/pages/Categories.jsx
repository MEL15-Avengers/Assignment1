import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Modal from '../components/Modal'
import { db } from '../lib/api'

export default function Categories() {
  const [categories, setCategories] = useState([])

  useEffect(() => { db.categories().then(setCategories).catch(() => {}) }, [])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '📦' })

  const openAdd = () => { setEditing(null); setForm({ name: '', icon: '📦' }); setModal(true) }
  const openEdit = c => { setEditing(c); setForm({ name: c.name, icon: c.icon }); setModal(true) }

  const handleSave = () => {
    if (!form.name) return
    if (editing) {
      setCategories(cs => cs.map(c => c.id === editing.id ? { ...c, ...form } : c))
    } else {
      setCategories(cs => [...cs, { id: Date.now().toString(), ...form, product_count: 0, is_active: true }])
    }
    setModal(false)
  }

  const handleDelete = id => {
    if (window.confirm('Delete this category?')) setCategories(cs => cs.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={openAdd}><Plus size={15} /> Add Category</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(c => (
          <div key={c.id} className="card p-5 flex flex-col gap-3 group">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{c.icon}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-dark-500 text-gray-500 hover:text-gray-200 transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200">{c.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.product_count} products</p>
            </div>
            <div className="mt-auto">
              <span className={`badge ${c.is_active ? 'badge-green' : 'badge-gray'}`}>
                {c.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editing ? 'Edit Category' : 'Add Category'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="label">Category Name</label>
              <input className="input" placeholder="e.g. Electronics" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Icon (emoji)</label>
              <input className="input" placeholder="e.g. 📦" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
            </div>
            <div className="flex gap-3 pt-1">
              <button className="btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Category'}</button>
              <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
