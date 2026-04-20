import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function AdminProfileSettings() {
  const [profile, setProfile] = useState({ name: 'Diwas Phuyal', email: 'admin@moonlight.com', role: 'Admin' })
  const [passwords, setPasswords] = useState({ current: '', new_pass: '', confirm: '' })
  const [prefs, setPrefs] = useState({ security_alerts: true, system_reports: false })
  const [saved, setSaved] = useState(false)

  const setP = key => e => setProfile(p => ({ ...p, [key]: e.target.value }))
  const setPw = key => e => setPasswords(p => ({ ...p, [key]: e.target.value }))
  const togglePref = key => () => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const handleSave = e => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-xl space-y-5">
      <form onSubmit={handleSave}>
        <div className="card p-6 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input className="input" value={profile.name} onChange={setP('name')} />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" value={profile.email} onChange={setP('email')} />
              </div>
              <div>
                <label className="label">Role</label>
                <input className="input bg-dark-600 cursor-not-allowed" value={profile.role} readOnly />
              </div>
            </div>
          </div>

          <div className="border-t border-dark-500 pt-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Security</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Current Password</label>
                <input type="password" className="input" placeholder="••••••••" value={passwords.current} onChange={setPw('current')} />
              </div>
              <div>
                <label className="label">New Password</label>
                <input type="password" className="input" placeholder="••••••••" value={passwords.new_pass} onChange={setPw('new_pass')} />
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" className="input" placeholder="••••••••" value={passwords.confirm} onChange={setPw('confirm')} />
              </div>
            </div>
          </div>

          <div className="border-t border-dark-500 pt-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              {[
                { key: 'security_alerts', label: 'Security Alerts' },
                { key: 'system_reports', label: 'System Reports' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-300">{label}</span>
                  <button
                    type="button"
                    onClick={togglePref(key)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${prefs[key] ? 'bg-brand' : 'bg-dark-400'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-2.5">
            {saved ? <><CheckCircle size={15} /> Saved!</> : 'Change Password & Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
