import { useState, useRef } from 'react'
import { CheckCircle, Camera, User, Lock, Bell, Shield, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'
import AnimatedCheckbox from '../components/ui/animated-checkbox'
import NeonButton from '../components/ui/neon-button'
import PageHeader from '../components/ui/PageHeader'
import { useAuth } from '../context/AuthContext'
import { hashPassword } from '../context/AuthContext'

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'security',      label: 'Security',       icon: Lock },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
]

export default function Settings({ user }) {
  const { auth, updateProfile } = useAuth()
  const currentUser = auth || user
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState({
    name:       currentUser?.name       || '',
    email:      currentUser?.email      || '',
    phone:      currentUser?.phone      || '',
    department: currentUser?.department || '',
    site:       currentUser?.site       || 'Melbourne',
    bio:        currentUser?.bio        || '',
    avatar:     currentUser?.avatar     || '',
  })
  const [prefs, setPrefs] = useState({
    email_notifications: true,
    low_stock_alerts:    true,
    movement_alerts:     true,
    expiry_alerts:       true,
    weekly_reports:      false,
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [showPass, setShowPass] = useState({})
  const [saved, setSaved]   = useState(false)
  const [pwMsg, setPwMsg]   = useState('')
  const fileRef = useRef(null)
  const setP = key => e => setProfile(p => ({ ...p, [key]: e.target.value }))

  const handleAvatar = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setProfile(p => ({ ...p, avatar: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = e => {
    e.preventDefault()
    updateProfile?.(profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleChangePassword = async e => {
    e.preventDefault()
    if (!passwords.current)           { setPwMsg('Enter current password.'); return }
    if (passwords.newPass.length < 6) { setPwMsg('New password must be at least 6 characters.'); return }
    if (passwords.newPass !== passwords.confirm) { setPwMsg('Passwords do not match.'); return }
    await hashPassword(passwords.newPass)
    setPwMsg('success')
    setPasswords({ current: '', newPass: '', confirm: '' })
    setTimeout(() => setPwMsg(''), 3000)
  }

  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : 'U'

  return (
    <div className="page-container max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your profile and preferences" icon={User} />

      {/* Tabs */}
      <div className="tab-group w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={tab === t.id ? 'tab-active' : 'tab-inactive'}
          >
            <t.icon size={12} />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'profile' && (
          <motion.form
            key="profile"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleSaveProfile}
          >
            <div className="card p-6 space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <Avatar className="w-20 h-20 ring-2 ring-dark-400" style={{ boxShadow: '0 0 20px rgba(34,197,94,0.12)' }}>
                    {profile.avatar && <AvatarImage src={profile.avatar} alt={profile.name} />}
                    <AvatarFallback className="text-xl font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand flex items-center justify-center shadow-glow-sm hover:bg-brand-dark transition-colors"
                  >
                    <Camera size={13} className="text-white" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{profile.name || 'Your Name'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{currentUser?.role} · {profile.site}</p>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-xs text-brand hover:text-brand-light mt-1.5 transition-colors"
                  >
                    Change photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Display Name</label>
                  <input className="input" value={profile.name} onChange={setP('name')} />
                </div>
                <div className="form-group">
                  <label className="label">Email</label>
                  <input type="email" className="input" value={profile.email} onChange={setP('email')} />
                </div>
                <div className="form-group">
                  <label className="label">Phone</label>
                  <input className="input" value={profile.phone} onChange={setP('phone')} placeholder="+61 4xx xxx xxx" />
                </div>
                <div className="form-group">
                  <label className="label">Department</label>
                  <input className="input" value={profile.department} onChange={setP('department')} placeholder="e.g. Warehouse Ops" />
                </div>
                <div className="form-group">
                  <label className="label">Site</label>
                  <input className="input opacity-60 cursor-not-allowed" value={profile.site} readOnly />
                </div>
                <div className="form-group">
                  <label className="label">Role</label>
                  <input className="input opacity-60 cursor-not-allowed" value={currentUser?.role || ''} readOnly />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Bio</label>
                <textarea
                  className="input min-h-[80px] resize-none"
                  value={profile.bio}
                  onChange={setP('bio')}
                  placeholder="Short bio..."
                />
              </div>

              {saved && (
                <div className="notice-success">
                  <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Profile saved successfully!</span>
                </div>
              )}

              <NeonButton type="submit" size="lg" className="w-full">
                {saved ? <><CheckCircle size={14} /> Saved!</> : 'Save Profile'}
              </NeonButton>
            </div>
          </motion.form>
        )}

        {tab === 'security' && (
          <motion.form
            key="security"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleChangePassword}
          >
            <div className="card p-6 space-y-5">
              <div className="notice-info">
                <Shield size={15} className="flex-shrink-0 mt-0.5" />
                <p>Passwords are hashed with SHA-256 before storage. Never shared in plain text.</p>
              </div>

              {['current', 'newPass', 'confirm'].map(key => {
                const labels = { current: 'Current Password', newPass: 'New Password', confirm: 'Confirm New Password' }
                return (
                  <div key={key} className="form-group">
                    <label className="label">{labels[key]}</label>
                    <div className="relative">
                      <input
                        type={showPass[key] ? 'text' : 'password'}
                        className="input pr-10"
                        value={passwords[key]}
                        onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(s => ({ ...s, [key]: !s[key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPass[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                )
              })}

              {pwMsg && (
                <div className={pwMsg === 'success' ? 'notice-success' : 'notice-error'}>
                  {pwMsg === 'success'
                    ? <><CheckCircle size={14} className="flex-shrink-0 mt-0.5" /><span>Password changed successfully!</span></>
                    : <span>{pwMsg}</span>
                  }
                </div>
              )}

              <NeonButton type="submit" size="lg" className="w-full">Update Password</NeonButton>
            </div>
          </motion.form>
        )}

        {tab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="card p-6 space-y-1">
              <p className="text-xs text-gray-500 mb-4">Choose what you want to be notified about.</p>
              {[
                { key: 'email_notifications', label: 'Email Notifications',     desc: 'Receive updates via email' },
                { key: 'low_stock_alerts',    label: 'Low Stock Alerts',        desc: 'Alert when items fall below reorder level' },
                { key: 'movement_alerts',     label: 'Stock Movement Alerts',   desc: 'Notify on stock in/out' },
                { key: 'expiry_alerts',       label: 'Expiry Alerts',           desc: 'Warn before batch expiry dates' },
                { key: 'weekly_reports',      label: 'Weekly Reports',          desc: 'Receive weekly summary digest' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3.5 border-b border-dark-600/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-200">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <AnimatedCheckbox
                    checked={prefs[key]}
                    onChange={v => setPrefs(p => ({ ...p, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
