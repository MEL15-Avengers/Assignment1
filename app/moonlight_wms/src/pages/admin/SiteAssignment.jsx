import { useState } from 'react'
import { Users, User, Plus } from 'lucide-react'
import Modal from '../../components/Modal'

export default function SiteAssignment() {
  const [sites, setSites] = useState([
    { id: '1', name: 'Melbourne Ambient Store', manager: 'James Liu', employees: 12 },
    { id: '2', name: 'Sydney Cold Storage', manager: 'Sarah Mitchell', employees: 8 },
    { id: '3', name: 'Brisbane Dry Goods Depot', manager: 'Mark Thompson', employees: 6 },
  ])
  const [modal, setModal] = useState(null)
  const [selectedUser, setSelectedUser] = useState('')

  const mockUsers = ['Tom Rivera', 'Emily Hart', 'Jake Nguyen', 'Sara Kim']

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sites.map(site => (
          <div key={site.id} className="card p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">{site.name}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User size={14} className="text-gray-600" />
                <span>Manager: <span className="text-gray-300 font-medium">{site.manager}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users size={14} className="text-gray-600" />
                <span><span className="text-gray-300 font-medium">{site.employees}</span> Employees</span>
              </div>
            </div>
            <button
              className="btn-primary justify-center w-full"
              onClick={() => { setModal(site); setSelectedUser('') }}
            >
              Assign User
            </button>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={`Assign User — ${modal.name}`} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="label">Select User</label>
              <select className="input" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                <option value="">Choose a user…</option>
                {mockUsers.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                className="btn-primary"
                onClick={() => {
                  if (selectedUser) {
                    setSites(ss => ss.map(s => s.id === modal.id ? { ...s, employees: s.employees + 1 } : s))
                    setModal(null)
                  }
                }}
              >
                Assign User
              </button>
              <button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
