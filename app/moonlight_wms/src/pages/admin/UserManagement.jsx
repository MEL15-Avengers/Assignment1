import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Pencil, UserX, Search } from 'lucide-react'
import Modal from '../../components/Modal'
import { db } from '../../lib/api'

function RoleBadge({ role }) {
  const map = { Admin: 'badge-purple', Manager: 'badge-blue', 'Site Manager': 'badge-yellow', Employee: 'badge-green', Guest: 'badge-gray' }
  return <span className={`badge ${map[role] || 'badge-gray'}`}>{role}</span>
}
function StatusBadge({ status }) {
  return <span className={`badge ${status === 'Active' ? 'badge-green' : status === 'Locked' ? 'badge-red' : 'badge-gray'}`}>{status}</span>
}

function ViewModal({ user, onClose }) {
  if (!user) return null
  const fields = [
    ['Employee ID', user.emp_id], ['Email', user.email], ['Phone', user.phone],
    ['Role', user.role], ['Department', user.department], ['Site / Location', user.site],
    ['Manager', user.manager], ['Address', user.address],
    ['Date of Joining', user.doj], ['Date of Birth', user.dob],
    ['Status', user.status], ['Last Login', user.last_login],
  ]
  return (
    <Modal title={`User Profile — ${user.name}`} onClose={onClose} width="max-w-lg">
      <div className="space-y-1">
        {fields.map(([label, value]) => (
          <div key={label} className="flex justify-between items-center py-2 border-b border-dark-500 last:border-0 gap-4">
            <span className="text-xs text-gray-500 flex-shrink-0 w-36">{label}</span>
            <span className="text-sm text-gray-200 text-right">{value || '—'}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [viewUser, setViewUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { db.users().then(setUsers).catch(() => {}) }, [])

  const deactivate = id => {
    if (window.confirm('Deactivate this user?'))
      setUsers(us => us.map(u => u.id === id ? { ...u, status: 'Inactive' } : u))
  }

  const filtered = users.filter(u =>
    query === '' ||
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase()) ||
    u.role.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="input pl-9 py-2" placeholder="Search users…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <button className="btn-primary flex-shrink-0" onClick={() => navigate('/admin/users/new')}>
          <Plus size={14} /> Add User
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-dark-700">
              <th className="table-header px-4 py-3 text-left">Name</th>
              <th className="table-header px-4 py-3 text-left">Email</th>
              <th className="table-header px-4 py-3 text-left">Phone</th>
              <th className="table-header px-4 py-3 text-left">Role</th>
              <th className="table-header px-4 py-3 text-left">Site</th>
              <th className="table-header px-4 py-3 text-left">Status</th>
              <th className="table-header px-4 py-3 text-left">Last Login</th>
              <th className="table-header px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="table-row">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-dark-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400">{u.name[0]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">{u.name}</p>
                      <p className="text-xs text-gray-600">{u.emp_id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 max-w-[160px] truncate">{u.email}</td>
                <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{u.phone}</td>
                <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{u.site}</td>
                <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{u.last_login}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 flex-nowrap">
                    <button onClick={() => setViewUser(u)} className="text-xs text-brand hover:text-brand-light font-medium px-2 py-1 rounded hover:bg-brand/10 whitespace-nowrap">View</button>
                    <button onClick={() => navigate(`/admin/users/${u.id}/edit`)} className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded hover:bg-blue-500/10 whitespace-nowrap">Edit</button>
                    <button onClick={() => deactivate(u.id)} className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-500/10 whitespace-nowrap">Deactivate</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-600">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ViewModal user={viewUser} onClose={() => setViewUser(null)} />
    </div>
  )
}
