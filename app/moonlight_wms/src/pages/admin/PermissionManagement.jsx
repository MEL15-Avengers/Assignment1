import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import AnimatedCheckbox from '../../components/ui/animated-checkbox'
import { db } from '../../lib/api'

const ALL_PERMS = ['View', 'Create', 'Edit', 'Delete']

const FEATURES = ['Dashboard', 'Products', 'Inventory', 'Stock Movements', 'Alerts', 'Reports', 'Suppliers', 'Warehouse Zones', 'Batch Tracking', 'Audit Log']

const permissions = {
  roles: ['Employee', 'Manager', 'Site Manager'],
  features: FEATURES,
  matrix: Object.fromEntries(FEATURES.map(f => [f, {
    Employee: ['View'],
    Manager: ['View', 'Create', 'Edit'],
    'Site Manager': ['View', 'Create', 'Edit', 'Delete'],
  }])),
}

const individualPermissions = {}

function PermCell({ perms, allPerms, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {allPerms.map(p => {
        const has = perms.includes(p)
        return (
          <AnimatedCheckbox
            key={p}
            checked={has}
            onChange={() => onChange(p, !has)}
            label={p}
          />
        )
      })}
    </div>
  )
}

export default function PermissionManagement() {
  const [tab, setTab] = useState('roles')
  const [matrix, setMatrix] = useState(permissions.matrix)
  const [indivPerms, setIndivPerms] = useState(individualPermissions)
  const [adminUsers, setAdminUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    db.users().then(users => {
      setAdminUsers(users)
      const first = users.find(u => u.role === 'Employee')
      if (first) setSelectedUser(first.id)
    }).catch(() => {})
  }, [])

  const updateRole = (feature, role, perm, val) => {
    setMatrix(m => ({
      ...m,
      [feature]: {
        ...m[feature],
        [role]: val ? [...m[feature][role], perm] : m[feature][role].filter(p => p !== perm)
      }
    }))
  }

  const updateIndiv = (feature, perm, val) => {
    setIndivPerms(ip => ({
      ...ip,
      [selectedUser]: {
        ...(ip[selectedUser] || {}),
        [feature]: val
          ? [...(ip[selectedUser]?.[feature] || []), perm]
          : (ip[selectedUser]?.[feature] || []).filter(p => p !== perm)
      }
    }))
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const selUserPerms = indivPerms[selectedUser] || Object.fromEntries(permissions.features.map(f => [f, []]))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1">
          {[['roles', 'Role Permissions'], ['individual', 'Individual User Permissions']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-brand text-white' : 'bg-dark-700 text-gray-400 hover:text-gray-200 hover:bg-dark-600'}`}>
              {label}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={14} />{saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {tab === 'roles' && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-dark-700">
                <th className="table-header px-5 py-3 text-left w-36">Feature</th>
                {permissions.roles.map(role => (
                  <th key={role} className="table-header px-5 py-3 text-left">
                    <span className={`badge ${role === 'Employee' ? 'badge-green' : role === 'Manager' ? 'badge-blue' : 'badge-yellow'}`}>{role}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.features.map(feature => (
                <tr key={feature} className="table-row">
                  <td className="px-5 py-4 text-sm font-medium text-gray-300">{feature}</td>
                  {permissions.roles.map(role => (
                    <td key={role} className="px-5 py-4">
                      <PermCell
                        perms={matrix[feature][role]}
                        allPerms={ALL_PERMS}
                        onChange={(perm, val) => updateRole(feature, role, perm, val)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'individual' && (
        <div className="space-y-4">
          <div className="card p-4 flex items-center gap-4">
            <label className="label mb-0 whitespace-nowrap">Select User:</label>
            <select className="input max-w-xs" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
              {adminUsers.filter(u => u.role !== 'Admin').map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
            <span className="text-xs text-gray-500">Overrides role-level permissions for this user only.</span>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-700">
                  <th className="table-header px-5 py-3 text-left">Feature</th>
                  <th className="table-header px-5 py-3 text-left">Permissions</th>
                </tr>
              </thead>
              <tbody>
                {permissions.features.map(feature => (
                  <tr key={feature} className="table-row">
                    <td className="px-5 py-4 text-sm font-medium text-gray-300">{feature}</td>
                    <td className="px-5 py-4">
                      <PermCell
                        perms={selUserPerms[feature] || []}
                        allPerms={ALL_PERMS}
                        onChange={(perm, val) => updateIndiv(feature, perm, val)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
