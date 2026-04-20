import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, KeyRound } from 'lucide-react'
import Modal from '../../components/Modal'
import Calendar from '../../components/ui/calendar'
import { db } from '../../lib/api'

const ROLES = ['Employee', 'Manager', 'Site Manager', 'Admin', 'Guest']
const DEPARTMENTS = ['Operations', 'Warehouse', 'Dispatch', 'Sales', 'Finance', 'HR', 'IT']
const SITES = [{ name: 'Melbourne' }, { name: 'Sydney' }, { name: 'Brisbane' }]

function ResetPasswordModal({ onClose, userName }) {
  const [form, setForm] = useState({ new_password: '', confirm: '', expires: true, must_reset: true, expire_date: '' })
  const [done, setDone] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const toggle = k => () => setForm(f => ({ ...f, [k]: !f[k] }))

  const handleSave = () => {
    if (!form.new_password || form.new_password !== form.confirm) return
    setDone(true)
    setTimeout(onClose, 1500)
  }

  return (
    <Modal title={`Reset Password — ${userName}`} onClose={onClose}>
      {done ? (
        <div className="text-center py-4">
          <p className="text-brand font-semibold">Password reset successfully.</p>
          <p className="text-sm text-gray-500 mt-1">User will be prompted on next login.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input" placeholder="Min. 8 characters" value={form.new_password} onChange={set('new_password')} />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" className="input" placeholder="Repeat new password" value={form.confirm} onChange={set('confirm')} />
          </div>

          <div className="space-y-3 border-t border-dark-500 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password Policy</p>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm text-gray-300">Password Expires</p>
                <p className="text-xs text-gray-600">Set an expiry date for this password</p>
              </div>
              <button type="button" onClick={toggle('expires')} className={`relative w-10 h-5 rounded-full transition-colors ${form.expires ? 'bg-brand' : 'bg-dark-400'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.expires ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </label>

            {form.expires && (
              <div>
                <label className="label">Expiry Date</label>
                <Calendar value={form.expire_date} onChange={v => setForm(f => ({ ...f, expire_date: v }))} placeholder="Select expiry" />
              </div>
            )}

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm text-gray-300">Must Reset on Next Login</p>
                <p className="text-xs text-gray-600">User will be forced to change password</p>
              </div>
              <button type="button" onClick={toggle('must_reset')} className={`relative w-10 h-5 rounded-full transition-colors ${form.must_reset ? 'bg-brand' : 'bg-dark-400'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.must_reset ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </label>
          </div>

          <div className="flex gap-3 pt-1">
            <button className="btn-primary" onClick={handleSave} disabled={!form.new_password || form.new_password !== form.confirm}>Reset Password</button>
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
          {form.new_password && form.confirm && form.new_password !== form.confirm && (
            <p className="text-xs text-red-400">Passwords do not match.</p>
          )}
        </div>
      )}
    </Modal>
  )
}

export default function EditUser() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', emp_id: '', email: '', phone: '', role: 'Employee', status: 'Active', department: 'Operations', site: 'Melbourne', manager: '', address: '', doj: '', dob: '' })
  const [managers, setManagers] = useState([])
  const [saved, setSaved] = useState(false)
  const [resetModal, setResetModal] = useState(false)

  useEffect(() => {
    db.userById(id).then(u => setForm({ ...u, name: u.name || '', emp_id: u.emp_id || '', phone: u.phone || '', department: u.department || 'Operations', site: u.site || 'Melbourne', manager: u.manager || '', address: u.address || '', doj: u.doj || '', dob: u.dob || '' })).catch(() => {})
    db.users().then(users => setManagers(users.filter(u => ['Admin', 'Manager', 'Site Manager'].includes(u.role) && u.id !== id).map(u => u.name))).catch(() => {})
  }, [id])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = e => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => navigate('/admin/users'), 1000)
  }
  const handleDeactivate = () => {
    if (window.confirm('Deactivate this user?')) navigate('/admin/users')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
        <ArrowLeft size={14} /> Back to User Management
      </button>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Edit User</h2>
          <button onClick={() => setResetModal(true)} className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 font-medium transition-colors border border-yellow-500/30 px-3 py-1.5 rounded-lg hover:bg-yellow-500/10">
            <KeyRound size={14} /> Reset Password
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="label">Employee ID</label>
              <input className="input" value={form.emp_id} onChange={set('emp_id')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={set('phone')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={set('role')}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={set('status')}>
                <option>Active</option><option>Inactive</option><option>Locked</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <select className="input" value={form.department} onChange={set('department')}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Site / Location</label>
              <select className="input" value={form.site} onChange={set('site')}>
                {[...SITES.map(s => s.name), 'All Sites'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Manager</label>
              <select className="input" value={form.manager} onChange={set('manager')}>
                <option value="—">— None —</option>
                {managers.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={set('address')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date of Joining</label>
              <Calendar value={form.doj} onChange={v => setForm(f => ({ ...f, doj: v }))} placeholder="Select DOJ" />
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <Calendar value={form.dob === '—' ? '' : form.dob} onChange={v => setForm(f => ({ ...f, dob: v }))} placeholder="Select DOB" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={saved}>{saved ? 'Saved!' : 'Save Changes'}</button>
            <button type="button" className="btn-danger" onClick={handleDeactivate}>Deactivate User</button>
            <button type="button" className="btn-secondary ml-auto" onClick={() => navigate('/admin/users')}>Cancel</button>
          </div>
        </form>
      </div>

      {resetModal && <ResetPasswordModal onClose={() => setResetModal(false)} userName={form.name} />}
    </div>
  )
}
