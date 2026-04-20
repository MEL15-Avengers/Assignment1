import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Download, FileText, TrendingUp, Truck, ArrowLeftRight } from 'lucide-react'

const inventoryTrendData = [
  { month: 'Nov', in: 980, out: 820 },
  { month: 'Dec', in: 1200, out: 1050 },
  { month: 'Jan', in: 870, out: 760 },
  { month: 'Feb', in: 1050, out: 940 },
  { month: 'Mar', in: 1180, out: 1020 },
  { month: 'Apr', in: 960, out: 890 },
]

const categoryStockData = [
  { name: 'Fresh Produce', value: 88 },
  { name: 'Dairy & Eggs', value: 72 },
  { name: 'Meat & Seafood', value: 65 },
  { name: 'Beverages', value: 91 },
  { name: 'Dry Goods', value: 78 },
  { name: 'Frozen Foods', value: 55 },
]

function ReportCard({ icon: Icon, title, description, lastGenerated }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-brand" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-200">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        <p className="text-xs text-gray-600 mt-2">Last generated: {lastGenerated}</p>
      </div>
      <button className="flex-shrink-0 btn-secondary text-xs py-1.5 px-3">
        <Download size={13} /> Download
      </button>
    </div>
  )
}

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Inventory Trend</h2>
            <button className="btn-secondary text-xs py-1.5 px-3"><Download size={13} /> CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={inventoryTrendData}>
              <defs>
                <linearGradient id="inG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1c2230', border: '1px solid #2d333b', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="in" name="Stock In" stroke="#22c55e" fill="url(#inG)" strokeWidth={2} />
              <Area type="monotone" dataKey="out" name="Stock Out" stroke="#3b82f6" fill="url(#outG)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Stock Value by Category</h2>
            <button className="btn-secondary text-xs py-1.5 px-3"><Download size={13} /> CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryStockData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#1c2230', border: '1px solid #2d333b', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" name="Stock %" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-300">Available Reports</h2>
        <ReportCard icon={FileText} title="Daily Inventory Summary" description="Current stock levels, low-stock items, and daily movement summary." lastGenerated="2025-04-18" />
        <ReportCard icon={ArrowLeftRight} title="Stock Movement Report" description="All stock-in, stock-out, transfer, and adjustment records for the selected period." lastGenerated="2025-04-17" />
        <ReportCard icon={Truck} title="Supplier Report" description="Supplier performance, order history, and contact details." lastGenerated="2025-04-16" />
        <ReportCard icon={TrendingUp} title="Inventory Value Report" description="Total inventory value breakdown by category and warehouse." lastGenerated="2025-04-16" />
      </div>
    </div>
  )
}
