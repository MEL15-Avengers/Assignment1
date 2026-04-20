import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Calendar from '../../components/ui/calendar'
import AnimatedCheckbox from '../../components/ui/animated-checkbox'
import { db } from '../../lib/api'

const ROLES = ['Employee', 'Manager', 'Site Manager', 'Admin', 'Guest']
const DEPARTMENTS = ['Operations', 'Warehouse', 'Dispatch', 'Sales', 'Finance', 'HR', 'IT']
const SITES = [{ name: 'Melbourne' }, { name: 'Sydney' }, { name: 'Brisbane' }]

export default function AddUser() {
  const navigate = useNavigate()
  const [managers, setManagers] = useState([])

  useEffect(() => {
    db.users().then(users => setManagers(users.filter(u => ['Admin', 'Manager', 'Site Manager'].includes(u.role)).map(u => u.name))).catch(() => {})
  }, [])

  const [form, setForm] = useState({
    full_name: '', emp_id: '', email: '', phone: '',
    password: '', confirm: '', role: 'Employee', site: 'Melbourne',
    department: 'Operations', manager: '', address: '', doj: '', dob: '',
    active: true, expires: true, expire_date: '', must_reset: true
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const toggle = k => () => setForm(f => ({ ...f, [k]: !f[k] }))

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.password) { setError('Name, email, and password are required.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setSaved(true)
    setTimeout(() => navigate('/admin/users'), 1200)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-white mb-6">Add New User</h2>
        {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 text-sm text-red-400">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Personal Information</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="Full name" value={form.full_name} onChange={set('full_name')} required />
            </div>
            <div>
              <label className="label">Employee ID</label>
              <input className="input" placeholder="e.g. EMP-007 or GST-002" value={form.emp_id} onChange={set('emp_id')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="user@moonlight.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" placeholder="+61 7 3400 0000" value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div>
            <label className="label">Address</label>
            <input className="input" placeholder="Street, City, State" value={form.address} onChange={set('address')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date of Birth</label>
              <Calendar value={form.dob} onChange={v => setForm(f => ({ ...f, dob: v }))} placeholder="Select DOB" />
            </div>
            <div>
              <label className="label">Date of Joining</label>
              <Calendar value={form.doj} onChange={v => setForm(f => ({ ...f, doj: v }))} placeholder="Select DOJ" />
            </div>
          </div>

          <div className="border-t border-dark-500 pt-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Role & Access</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Role</label>
                <select className="input" value={form.role} onChange={set('role')}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
                {form.role === 'Guest' && <p className="text-xs text-gray-500 mt-1">Guest: external suppliers/contractors with limited read access.</p>}
              </div>
              <div>
                <label className="label">Department</label>
                <select className="input" value={form.department} onChange={set('department')}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Site / Location</label>
                <select className="input" value={form.site} onChange={set('site')}>
                  {[...SITES.map(s => s.name), 'All Sites'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Manager</label>
                <select className="input" value={form.manager} onChange={set('manager')}>
                  <option value="">— None —</option>
                  {managers.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input type="checkbox" checked={form.active} onChange={toggle('active')} className="w-4 h-4 rounded accent-brand" />
              <span className="text-sm text-gray-300">Account Active</span>
            </label>
          </div>

          <div className="border-t border-dark-500 pt-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Password & Policy</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} required />
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" className="input" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} required />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm text-gray-300">Password Expires</p>
                  <p className="text-xs text-gray-600">Set an expiry date</p>
                </div>
                <button type="button" onClick={toggle('expires')} className={`relative w-10 h-5 rounded-full transition-colors ${form.expires ? 'bg-brand' : 'bg-dark-400'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.expires ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </label>
              {form.expires && (
                <div>
                  <label className="label">Expiry Date</label>
                  <Calendar value={form.expire_date} onChange={v => setForm(f => ({ ...f, expire_date: v }))} placeholder="Select expiry date" />
                </div>
              )}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm text-gray-300">Must Reset on Next Login</p>
                  <p className="text-xs text-gray-600">User forced to change password</p>
                </div>
                <button type="button" onClick={toggle('must_reset')} className={`relative w-10 h-5 rounded-full transition-colors ${form.must_reset ? 'bg-brand' : 'bg-dark-400'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.must_reset ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={saved}>{saved ? 'User Created!' : 'Save User'}</button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/users')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
