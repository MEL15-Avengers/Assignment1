import { useState, useEffect } from 'react'
import { Lock, AlertTriangle, KeyRound, Unlock, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import Modal from '../../components/Modal'
import { db } from '../../lib/api'

const STATIC_FAILED_LOGINS = [
  { id: '1', user: 'Sujan Khatiwada', attempts: 5, events: [
    { time: '09:45 AM', src_ip: '192.168.1.42', dest_ip: '10.0.0.5', location: 'Melbourne', user_agent: 'Chrome 122 / Windows 11' },
    { time: '09:43 AM', src_ip: '192.168.1.42', dest_ip: '10.0.0.5', location: 'Melbourne', user_agent: 'Chrome 122 / Windows 11' },
  ]},
]

export default function SecurityManagement() {
  const [allUsers, setAllUsers] = useState([])
  const [lockedList, setLockedList] = useState([])

  useEffect(() => {
    db.users().then(users => {
      setAllUsers(users)
      setLockedList(users.filter(u => u.locked))
    }).catch(() => {})
  }, [])
  const [addModal, setAddModal] = useState(false)
  const [lockUser, setLockUser] = useState('')
  const [lockReason, setLockReason] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [resetDone, setResetDone] = useState(false)

  const unlock = id => setLockedList(ls => ls.filter(u => u.id !== id))
  const addLock = () => {
    const user = allUsers.find(u => u.id === lockUser)
    if (user && !lockedList.find(u => u.id === user.id)) {
      setLockedList(ls => [...ls, { ...user, lockReason }])
    }
    setAddModal(false); setLockUser(''); setLockReason('')
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center"><Lock size={16} className="text-red-400" /></div>
            <h3 className="text-sm font-semibold text-white">Locked Accounts</h3>
          </div>
          <button onClick={() => setAddModal(true)} className="btn-secondary text-xs py-1.5 px-3"><Plus size={12} /> Lock Account</button>
        </div>
        {lockedList.length === 0 ? (
          <p className="text-sm text-gray-500">No locked accounts.</p>
        ) : (
          <div className="space-y-2">
            {lockedList.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-200">{u.name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email} · {u.lockReason || 'Account locked by admin'}</p>
                </div>
                <button onClick={() => unlock(u.id)} className="flex items-center gap-1.5 text-xs text-brand hover:text-brand-light font-medium px-3 py-1.5 rounded-lg hover:bg-brand/10 flex-shrink-0">
                  <Unlock size={12} /> Unlock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center"><AlertTriangle size={16} className="text-yellow-400" /></div>
          <h3 className="text-sm font-semibold text-white">Failed Login Attempts</h3>
        </div>
        <div className="space-y-2">
          {STATIC_FAILED_LOGINS.map(f => (
            <div key={f.id} className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-3"
                onClick={() => setExpanded(expanded === f.id ? null : f.id)}
              >
                <div className="flex items-center gap-3 text-left">
                  <div>
                    <p className="text-sm font-medium text-gray-200">{f.user}</p>
                    <p className="text-xs text-gray-500">{f.attempts} failed attempts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-yellow">{f.attempts} attempts</span>
                  {expanded === f.id ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                </div>
              </button>
              {expanded === f.id && (
                <div className="border-t border-yellow-500/10 px-3 pb-3">
                  <table className="w-full text-xs mt-2">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="text-left py-1 font-medium">Time</th>
                        <th className="text-left py-1 font-medium">Source IP</th>
                        <th className="text-left py-1 font-medium">Location</th>
                        <th className="text-left py-1 font-medium">Browser</th>
                      </tr>
                    </thead>
                    <tbody>
                      {f.events.map((ev, i) => (
                        <tr key={i} className="border-t border-dark-600">
                          <td className="py-1.5 text-gray-400 font-mono whitespace-nowrap">{ev.time}</td>
                          <td className="py-1.5 text-gray-400 font-mono">{ev.src_ip}</td>
                          <td className="py-1.5 text-gray-400">{ev.location}</td>
                          <td className="py-1.5 text-gray-500 truncate max-w-[120px]">{ev.user_agent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center"><KeyRound size={16} className="text-brand" /></div>
          <h3 className="text-sm font-semibold text-white">Password Management</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">Last bulk password reset: <span className="text-gray-300 font-medium">2026-01-20</span></p>
        {resetDone ? (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400">
            Password reset emails sent to all users.
          </div>
        ) : (
          <button className="btn-primary w-full justify-center py-2.5" onClick={() => setResetDone(true)}>
            Force Password Reset (All Users)
          </button>
        )}
      </div>

      {addModal && (
        <Modal title="Lock a User Account" onClose={() => setAddModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="label">Select User</label>
              <select className="input" value={lockUser} onChange={e => setLockUser(e.target.value)}>
                <option value="">Choose user…</option>
                {allUsers.filter(u => !lockedList.find(l => l.id === u.id) && u.role !== 'Admin').map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Reason</label>
              <input className="input" placeholder="Reason for locking account" value={lockReason} onChange={e => setLockReason(e.target.value)} />
            </div>
            <div className="flex gap-3 pt-1">
              <button className="btn-danger" onClick={addLock} disabled={!lockUser}>Lock Account</button>
              <button className="btn-secondary" onClick={() => setAddModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
