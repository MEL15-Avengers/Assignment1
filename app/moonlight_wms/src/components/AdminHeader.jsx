import { useState, useRef } from 'react'
import { Bell, Camera, CheckCircle, ChevronRight } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Modal from './Modal'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

const pageMeta = {
  '/admin/dashboard':   { title: 'Dashboard',          crumb: null },
  '/admin/users':       { title: 'User Management',    crumb: 'Users' },
  '/admin/users/new':   { title: 'Add User',           crumb: 'User Management' },
  '/admin/roles':       { title: 'Role Management',    crumb: 'Users' },
  '/admin/permissions': { title: 'Permissions',        crumb: 'Access' },
  '/admin/sites':       { title: 'Site Assignment',    crumb: 'Access' },
  '/admin/security':    { title: 'Security',           crumb: 'Access' },
  '/admin/activity':    { title: 'Activity Logs',      crumb: 'Audit' },
  '/admin/profile':     { title: 'Profile Settings',   crumb: 'Audit' },
}

const ROLES = ['Admin', 'Manager', 'Site Manager', 'Employee']
const DEPTS = ['Administration', 'Operations', 'Inventory', 'Warehouse', 'Stock Control', 'Logistics']

function ProfileModal({ user, onClose }) {
  const [form, setForm] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@moonlight.com',
    phone: '+61 7 3400 7890',
    address: 'HQ, 1 Market St, Sydney NSW 2000',
    emp_id: 'EMP-005',
    role: 'Admin',
    department: 'Administration',
    doj: '2022-01-01',
    dob: '1985-03-18',
    current_pass: '',
    new_pass: '',
    confirm_pass: '',
    status: 'Active',
  })
  const [photo, setPhoto] = useState(null)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handlePhoto = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => setPhoto(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 1500)
  }

  return (
    <Modal title="Admin Profile" onClose={onClose} width="max-w-2xl">
      <div className="flex items-start gap-5 mb-6">
        <div className="relative flex-shrink-0">
          <Avatar className="w-20 h-20 ring-2 ring-yellow-500/30">
            {photo && <AvatarImage src={photo} alt={form.name} />}
            <AvatarFallback className="bg-yellow-500/20 text-yellow-400 text-2xl font-bold">
              {form.name[0]}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => fileRef.current.click()}
            className="absolute bottom-0 right-0 w-6 h-6 bg-brand rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors shadow-glow-sm"
          >
            <Camera size={12} className="text-white" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
        <div>
          <p className="text-lg font-bold text-white">{form.name}</p>
          <span className="badge badge-yellow mt-1">{form.role}</span>
          <p className="text-xs text-gray-500 mt-1.5">{form.email}</p>
        </div>
      </div>

      <div className="space-y-5 max-h-[55vh] overflow-y-auto pr-1">
        <div>
          <p className="text-2xs font-bold text-gray-600 uppercase tracking-widest mb-3">Personal Information</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group"><label className="label">Full Name</label><input className="input" value={form.name} onChange={set('name')} /></div>
            <div className="form-group"><label className="label">Employee ID</label><input className="input" value={form.emp_id} onChange={set('emp_id')} /></div>
            <div className="form-group"><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={set('email')} /></div>
            <div className="form-group"><label className="label">Phone</label><input className="input" value={form.phone} onChange={set('phone')} /></div>
            <div className="form-group col-span-2"><label className="label">Address</label><input className="input" value={form.address} onChange={set('address')} /></div>
            <div className="form-group"><label className="label">Date of Birth</label><input type="date" className="input" value={form.dob} onChange={set('dob')} /></div>
            <div className="form-group"><label className="label">Date of Joining</label><input type="date" className="input" value={form.doj} onChange={set('doj')} /></div>
          </div>
        </div>

        <div className="divider pt-5">
          <p className="text-2xs font-bold text-gray-600 uppercase tracking-widest mb-3">Role & Department</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={set('role')}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Department</label>
              <select className="input" value={form.department} onChange={set('department')}>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={set('status')}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divider pt-5">
          <p className="text-2xs font-bold text-gray-600 uppercase tracking-widest mb-3">Change Password</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group col-span-2">
              <label className="label">Current Password</label>
              <input type="password" className="input" placeholder="••••••••" value={form.current_pass} onChange={set('current_pass')} />
            </div>
            <div className="form-group"><label className="label">New Password</label><input type="password" className="input" placeholder="Min. 8 chars" value={form.new_pass} onChange={set('new_pass')} /></div>
            <div className="form-group"><label className="label">Confirm Password</label><input type="password" className="input" placeholder="Repeat" value={form.confirm_pass} onChange={set('confirm_pass')} /></div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-dark-600/60 mt-4">
        <button onClick={handleSave} className="btn-primary">
          {saved ? <><CheckCircle size={14} /> Saved!</> : 'Save Changes'}
        </button>
        <button onClick={onClose} className="btn-secondary">Cancel</button>
      </div>
    </Modal>
  )
}

export default function AdminHeader({ user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isEdit = location.pathname.includes('/edit')
  const meta = isEdit
    ? { title: 'Edit User', crumb: 'User Management' }
    : (pageMeta[location.pathname] || { title: 'Admin Panel', crumb: null })
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-5 gap-4
                       bg-dark-850/80 backdrop-blur-md border-b border-dark-600/50">
      <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
        {meta.crumb ? (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-gray-600 hidden sm:block">{meta.crumb}</span>
            <ChevronRight size={13} className="text-dark-300 hidden sm:block" />
            <span className="font-semibold text-white">{meta.title}</span>
          </div>
        ) : (
          <span className="text-sm font-semibold text-white">{meta.title}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/admin/activity')}
          className="relative btn-icon flex-shrink-0"
          title="Activity"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-dark-800" />
        </button>

        <button
          onClick={() => setProfileOpen(true)}
          className="hover:opacity-80 transition-opacity"
          title="Admin Profile"
        >
          <Avatar className="w-7 h-7 ring-1 ring-yellow-500/30">
            <AvatarFallback className="bg-yellow-500/20 text-yellow-400 text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>

      {profileOpen && <ProfileModal user={user} onClose={() => setProfileOpen(false)} />}
    </header>
  )
}
