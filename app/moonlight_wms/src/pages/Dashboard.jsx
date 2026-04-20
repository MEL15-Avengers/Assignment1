import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Package, AlertTriangle, Truck, DollarSign,
  Archive, ArrowLeftRight, Layers, MapPin,
  Bell, BarChart3, Tag, ClipboardList,
  TrendingUp, TrendingDown, ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_WEEKLY = [
  { day: 'Mon', value: 42 }, { day: 'Tue', value: 61 }, { day: 'Wed', value: 38 },
  { day: 'Thu', value: 72 }, { day: 'Fri', value: 55 }, { day: 'Sat', value: 80 }, { day: 'Sun', value: 35 },
]
function StatCard({ icon: Icon, label, value, color = 'brand', trend, trendLabel }) {
  const colorMap = {
    brand:  { bg: 'bg-brand/10',   icon: 'text-brand',   ring: 'ring-brand/15' },
    yellow: { bg: 'bg-amber-500/10', icon: 'text-amber-400', ring: 'ring-amber-500/15' },
    blue:   { bg: 'bg-blue-500/10',  icon: 'text-blue-400',  ring: 'ring-blue-500/15' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', ring: 'ring-purple-500/15' },
  }
  const c = colorMap[color]
  const isPositive = trend > 0

  return (
    <div className="stat-card group cursor-default">
      <div className={`stat-icon ${c.bg} ring-1 ${c.ring}`}>
        <Icon size={17} className={c.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xl font-bold text-white leading-tight">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        {trend != null && (
          <div className={`flex items-center gap-1 mt-1.5 text-2xs font-semibold ${isPositive ? 'text-brand' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            <span>{isPositive ? '+' : ''}{trend}% {trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const quickLinks = [
  { icon: Archive,       label: 'Inventory',   to: '/inventory', color: 'text-brand bg-brand/10 ring-brand/15' },
  { icon: Package,       label: 'Products',    to: '/products',  color: 'text-blue-400 bg-blue-500/10 ring-blue-500/15' },
  { icon: ArrowLeftRight,label: 'Movements',   to: '/movements', color: 'text-purple-400 bg-purple-500/10 ring-purple-500/15' },
  { icon: Layers,        label: 'Batches',     to: '/batches',   color: 'text-amber-400 bg-amber-500/10 ring-amber-500/15' },
  { icon: MapPin,        label: 'Zones',       to: '/zones',     color: 'text-orange-400 bg-orange-500/10 ring-orange-500/15' },
  { icon: Bell,          label: 'Alerts',      to: '/alerts',    color: 'text-red-400 bg-red-500/10 ring-red-500/15' },
  { icon: Tag,           label: 'Categories',  to: '/categories',color: 'text-pink-400 bg-pink-500/10 ring-pink-500/15' },
  { icon: BarChart3,     label: 'Reports',     to: '/reports',   color: 'text-cyan-400 bg-cyan-500/10 ring-cyan-500/15' },
]

const movementTypeStyle = {
  'Stock In':       'badge-green',
  'Stock Out':      'badge-red',
  'Transfer':       'badge-blue',
  'Adjustment':     'badge-yellow',
}

export default function Dashboard({ user }) {
  const navigate = useNavigate()
  const name = user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'there'

  const [dashboardStats, setDashboardStats] = useState({ totalProducts: 0, lowStock: 0, totalSuppliers: 0, totalInventoryValue: 0 })
  const [categoryStockData, setCategoryStockData] = useState([])
  const [alerts, setAlerts] = useState([])
  const [stockMovements, setStockMovements] = useState([])
  const [weeklySalesData] = useState(DEFAULT_WEEKLY)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/dashboard`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.stats) setDashboardStats(d.stats)
        if (d.categoryStockData) setCategoryStockData(d.categoryStockData)
        if (d.alerts) setAlerts(d.alerts)
        if (d.movements) setStockMovements(d.movements)
      })
      .catch(() => {})
  }, [])

  const maxCat = categoryStockData.length ? Math.max(...categoryStockData.map(c => c.value)) : 1
  const activeAlerts = alerts.filter(a => a.status !== 'resolved')
  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="page-container">

      {/* Welcome */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Good day, {name} 👋</h2>
          <p className="text-xs text-gray-500 mt-1">{today}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-gray-500">Inventory Health</p>
            <p className="text-sm font-bold text-brand mt-0.5">92% In Stock</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand/10 ring-1 ring-brand/20 flex items-center justify-center">
            <TrendingUp size={16} className="text-brand" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package}       label="Total Products"       value={dashboardStats.totalProducts} color="brand"   trend={4.2}  trendLabel="this week" />
        <StatCard icon={AlertTriangle} label="Low / Out of Stock"   value={dashboardStats.lowStock}      color="yellow"  trend={-2.1} trendLabel="vs last week" />
        <StatCard icon={Truck}         label="Active Suppliers"     value={dashboardStats.totalSuppliers} color="blue"  />
        <StatCard icon={DollarSign}    label="Inventory Value"      value={`$${dashboardStats.totalInventoryValue.toLocaleString()}`} color="purple" trend={1.8} trendLabel="this month" />
      </div>

      {/* Quick links */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Quick Navigation</h3>
          <span className="text-2xs text-gray-600 font-medium uppercase tracking-wider">All modules</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {quickLinks.map(l => (
            <button
              key={l.to}
              onClick={() => navigate(l.to)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-dark-600/60 transition-all duration-150 group active:scale-95"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ${l.color}`}>
                <l.icon size={17} />
              </div>
              <span className="text-2xs font-medium text-gray-500 group-hover:text-gray-300 text-center leading-tight transition-colors">
                {l.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Weekly Sales Volume</h3>
            <span className="badge badge-green text-2xs">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklySalesData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(55,62,71,0.5)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#586069', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#586069', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c2230',
                  border: '1px solid rgba(55,62,71,0.8)',
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
                cursor={{ fill: 'rgba(34,197,94,0.05)' }}
              />
              <Bar dataKey="value" name="Units Sold" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Category Stock Distribution</h3>
          </div>
          <div className="space-y-3.5">
            {categoryStockData.map(c => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-24 flex-shrink-0 truncate">{c.name}</span>
                <div className="flex-1 bg-dark-600/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-gradient-brand transition-all duration-700"
                    style={{ width: `${(c.value / maxCat) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-400 w-8 text-right flex-shrink-0">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Recent Activity</h3>
            <button
              onClick={() => navigate('/movements')}
              className="flex items-center gap-1 text-xs text-brand hover:text-brand-light transition-colors font-medium"
            >
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-3">
            {stockMovements.slice(0, 5).map(m => (
              <div key={m.id} className="flex items-center gap-3 py-1">
                <div className="w-7 h-7 rounded-full bg-dark-600 ring-1 ring-dark-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xs font-bold text-gray-400">{m.user[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-300 truncate">{m.description}</p>
                  <p className="text-2xs text-gray-600 mt-0.5">{m.date} · {m.user}</p>
                </div>
                <span className={`badge flex-shrink-0 ${movementTypeStyle[m.type] || 'badge-gray'}`}>
                  {m.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title flex items-center gap-2">
              <AlertTriangle size={13} className="text-amber-400" /> Active Alerts
              {activeAlerts.length > 0 && (
                <span className="badge badge-red ml-1">{activeAlerts.length}</span>
              )}
            </h3>
            <button
              onClick={() => navigate('/alerts')}
              className="flex items-center gap-1 text-xs text-brand hover:text-brand-light transition-colors font-medium"
            >
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-2">
            {activeAlerts.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-10 h-10 rounded-xl bg-brand/8 flex items-center justify-center mb-2">
                  <Bell size={16} className="text-brand/60" />
                </div>
                <p className="text-xs text-gray-600">No active alerts — all clear!</p>
              </div>
            ) : (
              activeAlerts.slice(0, 4).map(a => (
                <div
                  key={a.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all
                    ${a.priority === 'Critical'
                      ? 'bg-red-500/5 border-red-500/15 hover:bg-red-500/8'
                      : 'bg-amber-500/5 border-amber-500/15 hover:bg-amber-500/8'
                    }`}
                >
                  <span className={`badge flex-shrink-0 mt-0.5 ${a.priority === 'Critical' ? 'badge-red' : 'badge-yellow'}`}>
                    {a.priority}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-200 truncate">{a.product}</p>
                    <p className="text-2xs text-gray-500 mt-0.5 truncate">{a.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
