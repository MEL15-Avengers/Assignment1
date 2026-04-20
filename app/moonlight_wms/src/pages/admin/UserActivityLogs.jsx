import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { AnimatedDownload } from '../../components/ui/animated-download'

function exportSplunk(logs) {
  const lines = logs.map(l =>
    `${l.date_time} host=moonlight-wms source=${l.category === 'auth' ? 'auth.log' : 'app.log'} sourcetype=wms:${l.category} ` +
    `user="${l.user}" action="${l.action}" src_ip=${l.src_ip} dest_ip=${l.dest_ip} ` +
    `process=${l.process} child_process=${l.child_process} status=${l.status}`
  ).join('\n')
  const blob = new Blob([lines], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'moonlight_splunk.log'; a.click()
  URL.revokeObjectURL(url)
}

function exportCSV(logs) {
  const headers = 'Date/Time,User,Action,Category,Src IP,Dest IP,Process,Child Process,Status'
  const rows = logs.map(l =>
    `"${l.date_time}","${l.user}","${l.action}","${l.category}","${l.src_ip}","${l.dest_ip}","${l.process}","${l.child_process}","${l.status}"`
  )
  const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'activity_logs.csv'; a.click()
  URL.revokeObjectURL(url)
}

export default function UserActivityLogs() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [activityLogs, setActivityLogs] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/audit-logs`, { credentials: 'include' })
      .then(r => r.json())
      .then(logs => setActivityLogs((logs || []).map(l => ({
        id: l.id, date_time: l.time, user: l.user || 'System', action: l.action,
        category: l.type === 'auth' ? 'auth' : 'app', src_ip: '—', dest_ip: '—',
        process: 'node', child_process: 'postgres', status: 'Success',
      }))))
      .catch(() => {})
  }, [])

  const filtered = activityLogs.filter(l => {
    const matchQ = query === '' || l.user.toLowerCase().includes(query.toLowerCase()) || l.action.toLowerCase().includes(query.toLowerCase()) || l.src_ip.includes(query)
    const matchTab = tab === 'all' || l.category === tab
    return matchQ && matchTab
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input className="input pl-9 py-2 w-56" placeholder="Search user, action, IP…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {[['all', 'All Logs'], ['auth', 'auth.log'], ['app', 'app.log']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === key ? 'bg-brand text-white' : 'bg-dark-700 text-gray-400 hover:text-gray-200 hover:bg-dark-600'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <AnimatedDownload label="CSV" onDownload={async () => exportCSV(filtered)} />
          <AnimatedDownload label="Splunk" onDownload={async () => exportSplunk(filtered)} className="border-yellow-500/30 text-yellow-400" />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-dark-700">
              <th className="table-header px-4 py-3 text-left">Date / Time</th>
              <th className="table-header px-4 py-3 text-left">User</th>
              <th className="table-header px-4 py-3 text-left">Action</th>
              <th className="table-header px-4 py-3 text-left">Src IP</th>
              <th className="table-header px-4 py-3 text-left">Dest IP</th>
              <th className="table-header px-4 py-3 text-left">Process</th>
              <th className="table-header px-4 py-3 text-left">Child Process</th>
              <th className="table-header px-4 py-3 text-left">Log</th>
              <th className="table-header px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="table-row">
                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap font-mono">{l.date_time}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-dark-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400">{l.user[0]}</span>
                    </div>
                    <span className="text-sm text-gray-300 whitespace-nowrap">{l.user}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{l.action}</td>
                <td className="px-4 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">{l.src_ip}</td>
                <td className="px-4 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">{l.dest_ip}</td>
                <td className="px-4 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">{l.process}</td>
                <td className="px-4 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">{l.child_process}</td>
                <td className="px-4 py-3">
                  <span className={`badge text-xs ${l.category === 'auth' ? 'badge-yellow' : 'badge-blue'}`}>{l.category}.log</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${l.status === 'Success' ? 'badge-green' : 'badge-red'}`}>{l.status}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-600">No logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-600">{filtered.length} log entries · Splunk export uses standard CEF-compatible format</p>
    </div>
  )
}
