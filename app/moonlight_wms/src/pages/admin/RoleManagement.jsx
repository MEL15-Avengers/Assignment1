import { useState } from 'react'
import { Plus, Pencil, Trash2, Shield } from 'lucide-react'
import Modal from '../../components/Modal'

const initialRoles = [
  { id: '1', name: 'Admin', description: 'Full system access and user management', users: 1, color: '#8b5cf6' },
  { id: '2', name: 'Manager', description: 'Manages inventory, reports, products, and suppliers', users: 4, color: '#3b82f6' },
  { id: '3', name: 'Site Manager', description: 'Manages a specific warehouse location and stock', users: 3, color: '#f59e0b' },
  { id: '4', name: 'Employee', description: 'Performs daily warehouse tasks', users: 8, color: '#22c55e' },
]

export default function RoleManagement() {
  const [roles, setRoles] = useState(initialRoles)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [editing, setEditing] = useState(null)

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '' }); setModal(true) }
  const openEdit = r => { setEditing(r); setForm({ name: r.name, description: r.description }); setModal(true) }

  const handleSave = () => {
    if (!form.name) return
    if (editing) {
      setRoles(rs => rs.map(r => r.id === editing.id ? { ...r, ...form } : r))
    } else {
      setRoles(rs => [...rs, { id: Date.now().toString(), ...form, users: 0, color: '#6b7280' }])
    }
    setModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={openAdd}><Plus size={15} /> Add Role</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {roles.map(r => (
          <div key={r.id} className="card p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: r.color + '22' }}>
                  <Shield size={16} style={{ color: r.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-200">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.users} user{r.users !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-dark-500 text-gray-500 hover:text-gray-200 transition-colors"><Pencil size={13} /></button>
                {r.name !== 'Admin' && (
                  <button onClick={() => setRoles(rs => rs.filter(x => x.id !== r.id))} className="p-1.5 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editing ? 'Edit Role' : 'Add Role'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="label">Role Name</label>
              <input className="input" placeholder="e.g. Supervisor" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input resize-none" rows={3} placeholder="Role description…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex gap-3 pt-1">
              <button className="btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Role'}</button>
              <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
