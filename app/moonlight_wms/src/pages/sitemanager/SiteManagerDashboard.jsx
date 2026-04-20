import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Package, AlertTriangle, ArrowLeftRight, Users, TrendingUp, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../../lib/api'
const weeklyData = [
  { day: 'Mon', in: 42, out: 38 },
  { day: 'Tue', in: 55, out: 61 },
  { day: 'Wed', in: 38, out: 44 },
  { day: 'Thu', in: 72, out: 65 },
  { day: 'Fri', in: 61, out: 58 },
  { day: 'Sat', in: 80, out: 74 },
  { day: 'Sun', in: 35, out: 30 },
]

function StatCard({ icon: Icon, label, value, sub, color = 'brand' }) {
  const colors = { brand: 'bg-brand/10 text-brand', yellow: 'bg-yellow-500/10 text-yellow-400', blue: 'bg-blue-500/10 text-blue-400', red: 'bg-red-500/10 text-red-400' }
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[color]}`}><Icon size={18} /></div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function SiteManagerDashboard({ user }) {
  const navigate = useNavigate()
  const site = user?.site || 'Melbourne'
  const name = user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'Site Manager'

  const [products, setProducts] = useState([])
  const [alerts, setAlerts] = useState([])
  const [stockMovements, setStockMovements] = useState([])

  useEffect(() => {
    db.products().then(setProducts).catch(() => {})
    fetch(`${import.meta.env.VITE_API_URL}/alerts`, { credentials: 'include' }).then(r => r.json()).then(setAlerts).catch(() => {})
    fetch(`${import.meta.env.VITE_API_URL}/movements`, { credentials: 'include' }).then(r => r.json()).then(setStockMovements).catch(() => {})
  }, [])

  const lowItems = products.filter(p => p.status === 'low' || p.status === 'out')
  const activeAlerts = alerts.filter(a => a.status === 'Active')
  const todayMovements = stockMovements.slice(0, 3)

  const pendingTasks = [
    { task: 'Receive PO-2026-041 — FreshLine Foods', due: 'Today', done: false },
    { task: 'Conduct Zone A stock count', due: 'Tomorrow', done: false },
    { task: 'Approve Chicken Breast reorder', due: 'Today', done: true },
    { task: 'Remove expired Milk batch BAT-2026-010', due: 'Overdue', done: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome back, {name}!</h2>
          <p className="text-sm text-gray-500 mt-0.5">Site Manager — {site} · {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/movements')} className="btn-primary text-sm py-2">+ Stock Movement</button>
          <button onClick={() => navigate('/inventory')} className="btn-secondary text-sm py-2">View Inventory</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Products at Site" value={products.length} sub={`${site} store`} color="brand" />
        <StatCard icon={AlertTriangle} label="Low / Out of Stock" value={lowItems.length} sub="Needs attention" color="yellow" />
        <StatCard icon={ArrowLeftRight} label="Movements Today" value={todayMovements.length} sub="Stock in/out" color="blue" />
        <StatCard icon={AlertTriangle} label="Active Alerts" value={activeAlerts.length} sub="Critical + warnings" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">This Week — Stock In vs Out</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1c2230', border: '1px solid #2d333b', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="in" name="Stock In" fill="#22c55e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="out" name="Stock Out" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle size={14} className="text-brand" /> Pending Tasks
          </h3>
          <div className="space-y-2">
            {pendingTasks.map((t, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${t.done ? 'opacity-50' : ''}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${t.done ? 'bg-brand border-brand' : 'border-gray-600'}`}>
                  {t.done && <CheckCircle size={10} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${t.done ? 'line-through text-gray-600' : 'text-gray-300'} truncate`}>{t.task}</p>
                </div>
                <span className={`text-xs flex-shrink-0 font-medium ${t.due === 'Overdue' ? 'text-red-400' : t.due === 'Today' ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {t.due}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Low Stock Items</h3>
            <button onClick={() => navigate('/inventory')} className="text-xs text-brand hover:text-brand-light font-medium">View all</button>
          </div>
          <div className="space-y-2">
            {lowItems.map(p => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-3 bg-dark-700 rounded-lg">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{p.product_name}</p>
                  <p className="text-xs text-gray-500">{p.sku} · Reorder: {p.reorder_level}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${p.quantity === 0 ? 'text-red-400' : 'text-yellow-400'}`}>{p.quantity}</p>
                  <span className={`badge text-xs ${p.quantity === 0 ? 'badge-red' : 'badge-yellow'}`}>{p.quantity === 0 ? 'Out' : 'Low'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={14} className="text-yellow-400" /> Active Alerts
            </h3>
            <button onClick={() => navigate('/alerts')} className="text-xs text-brand hover:text-brand-light font-medium">View all</button>
          </div>
          <div className="space-y-2">
            {activeAlerts.map(a => (
              <div key={a.id} className={`p-3 rounded-lg border ${a.priority === 'Critical' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                <div className="flex items-start gap-2">
                  <span className={`badge flex-shrink-0 ${a.priority === 'Critical' ? 'badge-red' : 'badge-yellow'}`}>{a.priority}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{a.product}</p>
                    <p className="text-xs text-gray-500 truncate">{a.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
