import { useState, useEffect } from 'react'
import { Users, UserCheck, Lock, AlertTriangle, Key, Copy, Check, Trash2, RefreshCw, Clock, UserPlus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getCodes, generateCode, deleteCode, getPendingAccounts, approveAccount, rejectAccount } from '../../lib/registrationStore'

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    red: 'bg-red-500/10 text-red-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
  }
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

const ROLE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#6b7280']
const ROLES = ['Admin', 'Manager', 'Employee']

function SecretCodePanel() {
  const [codes, setCodes] = useState([])
  const [codeRole, setCodeRole] = useState('Manager')
  const [copied, setCopied] = useState(null)

  const refresh = async () => setCodes(await getCodes())
  useEffect(() => { refresh() }, [])

  const handleGenerate = async () => { await generateCode(codeRole); refresh() }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 1800)
  }

  const handleDelete = async (id) => { await deleteCode(id); refresh() }

  const active = codes.filter(c => !c.used)
  const used = codes.filter(c => c.used)

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Key size={14} className="text-brand" /> Registration Codes
        </h3>
        <button onClick={refresh} className="text-gray-500 hover:text-gray-300 transition-colors">
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Generate */}
      <div className="flex gap-2">
        <select
          value={codeRole}
          onChange={e => setCodeRole(e.target.value)}
          className="input flex-1 text-sm py-1.5"
        >
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
        <button
          onClick={handleGenerate}
          className="btn-primary text-sm py-1.5 px-3 flex-shrink-0"
        >
          <Key size={13} /> Generate
        </button>
      </div>

      {/* Active codes */}
      {active.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Active Codes ({active.length})</p>
          <div className="space-y-1.5 max-h-44 overflow-y-auto">
            {active.map(c => (
              <div key={c.id} className="flex items-center gap-2 bg-dark-700 rounded-lg px-3 py-2">
                <span className="font-mono text-sm font-bold text-brand tracking-widest flex-1">{c.code}</span>
                <span className={`badge text-xs ${c.role === 'Admin' ? 'badge-red' : c.role === 'Manager' ? 'badge-blue' : 'badge-green'}`}>{c.role}</span>
                <button onClick={() => copyCode(c.code)} className="text-gray-500 hover:text-brand transition-colors">
                  {copied === c.code ? <Check size={13} className="text-brand" /> : <Copy size={13} />}
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {active.length === 0 && (
        <p className="text-xs text-gray-600 text-center py-3">No active codes. Generate one above.</p>
      )}

      {used.length > 0 && (
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Used ({used.length})</p>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {used.map(c => (
              <div key={c.id} className="flex items-center gap-2 px-3 py-1.5 opacity-40">
                <span className="font-mono text-sm line-through text-gray-500 flex-1">{c.code}</span>
                <span className="text-xs text-gray-600">{c.usedBy}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PendingApprovalsPanel() {
  const [pending, setPending] = useState([])
  const refresh = async () => setPending(await getPendingAccounts())
  useEffect(() => { refresh() }, [])

  const handleApprove = async (id) => { await approveAccount(id); refresh() }
  const handleReject = async (id) => { await rejectAccount(id); refresh() }

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <UserPlus size={14} className="text-yellow-400" /> Pending Approvals
          {pending.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold flex items-center justify-center">{pending.length}</span>
          )}
        </h3>
        <button onClick={refresh} className="text-gray-500 hover:text-gray-300 transition-colors"><RefreshCw size={13} /></button>
      </div>

      {pending.length === 0 && (
        <p className="text-xs text-gray-600 text-center py-4">No pending registrations.</p>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {pending.map(a => (
          <div key={a.id} className="bg-dark-700 rounded-lg p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-white">{a.full_name}</p>
                <p className="text-xs text-gray-400">{a.email} · {a.phone}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`badge text-xs ${a.role === 'Admin' ? 'badge-red' : a.role === 'Manager' ? 'badge-blue' : 'badge-green'}`}>{a.role}</span>
                  <span className="badge badge-gray text-xs">{a.department}</span>
                  <span className="badge badge-gray text-xs">{a.warehouse_location}</span>
                </div>
              </div>
              <span className="text-xs text-gray-600 flex-shrink-0 flex items-center gap-1">
                <Clock size={10} />{new Date(a.submittedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(a.id)}
                className="flex-1 py-1.5 rounded-lg bg-brand/15 text-brand hover:bg-brand/25 text-xs font-semibold transition-colors border border-brand/20"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(a.id)}
                className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors border border-red-500/20"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [pendingCount, setPendingCount] = useState(0)
  const [adminUsers, setAdminUsers] = useState([])
  const [usersByRole, setUsersByRole] = useState([])
  const [usersBySite, setUsersBySite] = useState([])
  const [recentAdminActivity, setRecentAdminActivity] = useState([])

  const totalUsers = adminUsers.length
  const activeUsers = adminUsers.filter(u => u.status === 'Active').length
  const lockedUsers = adminUsers.filter(u => u.locked).length
  const maxCount = usersByRole.length ? Math.max(...usersByRole.map(r => r.count)) : 1

  useEffect(() => {
    getPendingAccounts().then(accounts => setPendingCount(accounts.length))
    fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setAdminUsers(d.users || [])
        setUsersByRole(d.usersByRole || [])
        setUsersBySite(d.usersBySite || [])
        setRecentAdminActivity(d.recentAdminActivity || [])
      })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">System overview and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={totalUsers} color="blue" />
        <StatCard icon={UserCheck} label="Active Users" value={activeUsers} color="green" />
        <StatCard icon={Lock} label="Locked Accounts" value={lockedUsers} color="red" />
        <StatCard icon={Clock} label="Pending Approval" value={pendingCount} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SecretCodePanel />
        <PendingApprovalsPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Users by Role</h3>
          <div className="space-y-3">
            {usersByRole.map((r, i) => (
              <div key={r.role} className="flex items-center gap-3 min-w-0">
                <span className="text-sm text-gray-400 w-28 flex-shrink-0 truncate">{r.role}</span>
                <div className="flex-1 bg-dark-600 rounded-full h-2 overflow-hidden min-w-0">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min((r.count / maxCount) * 100, 100)}%`, backgroundColor: ROLE_COLORS[i] }} />
                </div>
                <span className="text-sm font-semibold text-gray-200 w-5 text-right flex-shrink-0">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 overflow-hidden">
          <h3 className="text-sm font-semibold text-white mb-4">Users by Site</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={usersBySite} barSize={28} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
              <XAxis dataKey="site" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1c2230', border: '1px solid #2d333b', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" name="Users" radius={[4, 4, 0, 0]}>
                {usersBySite.map((_, i) => <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentAdminActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-dark-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-gray-400">{a.user[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-300 truncate">{a.user}</p>
                    <p className="text-xs text-gray-500 truncate">{a.action}</p>
                  </div>
                </div>
                <span className={`badge flex-shrink-0 ${a.status === 'Success' ? 'badge-green' : 'badge-red'}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400" /> Failed Login Alerts
          </h3>
          <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-200">Sujan Khatiwada</p>
              <p className="text-xs text-gray-500">5 failed attempts · Last: 09:45 AM</p>
            </div>
            <span className="badge badge-red flex-shrink-0">5 attempts</span>
          </div>
        </div>
      </div>
    </div>
  )
}
