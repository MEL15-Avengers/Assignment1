const crypto = require('crypto')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { Pool } = require('pg')
const { default: Groq } = require('groq-sdk')

const PORT = Number(process.env.API_PORT || 5000)
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/moonlight_wms'
const PASSWORD_SALT = 'moonlight_salt_v1'
const APP_URL = process.env.APP_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const pool = new Pool({
  connectionString: DATABASE_URL,
})

async function createDatabaseIfMissing() {
  const url = new URL(DATABASE_URL)
  const databaseName = url.pathname.replace(/^\//, '')
  if (!databaseName) throw new Error('DATABASE_URL must include a database name.')

  url.pathname = '/postgres'
  const maintenancePool = new Pool({ connectionString: url.toString() })
  try {
    const exists = await maintenancePool.query('SELECT 1 FROM pg_database WHERE datname = $1', [databaseName])
    if (exists.rowCount === 0) {
      const safeName = databaseName.replace(/"/g, '""')
      await maintenancePool.query(`CREATE DATABASE "${safeName}"`)
    }
  } finally {
    await maintenancePool.end()
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(`${password}${PASSWORD_SALT}`).digest('hex')
}

function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const raw = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${raw.slice(0, 4)}-${raw.slice(4)}`
}

async function query(text, params) {
  const result = await pool.query(text, params)
  return result
}

async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      product_count INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      supplier_code TEXT UNIQUE,
      supplier_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      status TEXT DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS warehouses (
      id TEXT PRIMARY KEY,
      warehouse_code TEXT UNIQUE,
      warehouse_name TEXT NOT NULL,
      status TEXT DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS warehouse_zones (
      id TEXT PRIMARY KEY,
      warehouse TEXT NOT NULL,
      zone TEXT NOT NULL,
      capacity INTEGER DEFAULT 0,
      max_capacity INTEGER DEFAULT 100,
      stored TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT UNIQUE NOT NULL,
      product_name TEXT NOT NULL,
      category_id TEXT,
      category TEXT,
      supplier TEXT,
      unit_cost NUMERIC(12, 2) DEFAULT 0,
      selling_price NUMERIC(12, 2) DEFAULT 0,
      reorder_level INTEGER DEFAULT 0,
      quantity INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      warehouse TEXT,
      location TEXT,
      batch TEXT,
      unit TEXT,
      barcode TEXT
    );

    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      emp_id TEXT,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      role TEXT NOT NULL,
      site TEXT,
      department TEXT,
      address TEXT,
      manager TEXT,
      doj TEXT,
      dob TEXT,
      status TEXT DEFAULT 'Active',
      last_login TEXT,
      locked BOOLEAN DEFAULT FALSE,
      password_hash TEXT NOT NULL,
      photo TEXT,
      approved_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS registration_codes (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      used BOOLEAN DEFAULT FALSE,
      used_by TEXT
    );

    CREATE TABLE IF NOT EXISTS pending_accounts (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      username TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      staff_id TEXT,
      department TEXT,
      warehouse_location TEXT,
      warehouse_code TEXT,
      assigned_zone TEXT,
      shift TEXT,
      reg_code TEXT,
      photo TEXT,
      access_level TEXT,
      account_status TEXT DEFAULT 'Pending Approval',
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS stock_movements (
      id TEXT PRIMARY KEY,
      date TEXT,
      product TEXT,
      sku TEXT,
      type TEXT,
      quantity INTEGER,
      warehouse TEXT,
      description TEXT,
      user_name TEXT
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      product TEXT,
      type TEXT,
      priority TEXT,
      message TEXT,
      status TEXT,
      created TEXT
    );

    CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      product TEXT,
      sku TEXT,
      batch_number TEXT,
      manufacture_date TEXT,
      expiry_date TEXT,
      location TEXT,
      quantity INTEGER,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      time TEXT,
      "user" TEXT,
      action TEXT,
      type TEXT,
      detail TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      title TEXT,
      message TEXT,
      time TEXT,
      read BOOLEAN DEFAULT FALSE
    );
  `)

}

function sendError(res, error) {
  console.error(error)
  res.status(500).json({ error: 'Database request failed.' })
}

function redirectWithError(res, message) {
  const url = new URL('/login', APP_URL)
  url.searchParams.set('oauth_error', message)
  res.redirect(url.toString())
}

function redirectWithUser(res, user) {
  const url = new URL('/login', APP_URL)
  url.searchParams.set('oauth', Buffer.from(JSON.stringify(user)).toString('base64url'))
  res.redirect(url.toString())
}

async function upsertOAuthUser({ email, name, photo }) {
  const existing = await query(
    `SELECT id, name, email, phone, role, site, department, status, locked, photo
     FROM app_users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email]
  )

  if (existing.rows[0]) {
    await query('UPDATE app_users SET last_login = NOW()::TEXT, photo = COALESCE($2, photo) WHERE id = $1', [existing.rows[0].id, photo])
    return { ...existing.rows[0], photo: photo || existing.rows[0].photo }
  }

  const id = crypto.randomUUID()
  const result = await query(
    `INSERT INTO app_users (id, name, email, role, site, department, status, locked, password_hash, photo, approved_at)
     VALUES ($1, $2, $3, 'Employee', 'Melbourne', 'Warehouse', 'Active', FALSE, $4, $5, NOW())
     RETURNING id, name, email, phone, role, site, department, status, locked, photo`,
    [id, name || email.split('@')[0], email, hashPassword(crypto.randomUUID()), photo]
  )
  return result.rows[0]
}

const app = express()
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true)
    const allowed = (process.env.CLIENT_ORIGIN || '').split(',').map(s => s.trim())
    cb(allowed.includes(origin) ? null : new Error('CORS'), allowed.includes(origin))
  },
  credentials: true,
}))
app.use(express.json({ limit: '12mb' }))

app.get('/api/health', async (_req, res) => {
  try {
    const result = await query('SELECT NOW() AS now')
    res.json({ ok: true, database: 'postgresql', now: result.rows[0].now })
  } catch (error) {
    sendError(res, error)
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body
    const result = await query(
      `SELECT id, name, email, phone, role, site, department, status, locked, photo
       FROM app_users
       WHERE LOWER(email) = LOWER($1) AND role = $2 AND password_hash = $3
       LIMIT 1`,
      [email, role, hashPassword(password)]
    )
    const user = result.rows[0]
    if (!user) return res.status(401).json({ error: 'Invalid email, password, or role.' })
    if (user.locked || user.status === 'Locked') return res.status(403).json({ error: 'Account is locked.' })
    if (user.status !== 'Active') return res.status(403).json({ error: 'Account is not active.' })
    res.json({ user })
  } catch (error) {
    sendError(res, error)
  }
})

app.get('/api/auth/google', (_req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CALLBACK_URL) {
    return redirectWithError(res, 'Google OAuth is not configured.')
  }
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
  })
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
})

app.get('/api/auth/google/callback', async (req, res) => {
  try {
    if (!req.query.code) return redirectWithError(res, 'Google did not return an auth code.')
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: req.query.code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    })
    if (!tokenResponse.ok) return redirectWithError(res, 'Google token exchange failed.')
    const token = await tokenResponse.json()
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    })
    if (!profileResponse.ok) return redirectWithError(res, 'Could not read Google profile.')
    const profile = await profileResponse.json()
    if (!profile.email) return redirectWithError(res, 'Google account has no email address.')
    const user = await upsertOAuthUser({ email: profile.email, name: profile.name, photo: profile.picture })
    redirectWithUser(res, user)
  } catch (error) {
    console.error(error)
    redirectWithError(res, 'Google sign-in failed.')
  }
})

app.get('/api/auth/facebook', (_req, res) => {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_CALLBACK_URL) {
    return redirectWithError(res, 'Facebook OAuth is not configured.')
  }
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID,
    redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
    response_type: 'code',
    scope: 'email,public_profile',
  })
  res.redirect(`https://www.facebook.com/v18.0/dialog/oauth?${params}`)
})

app.get('/api/auth/facebook/callback', async (req, res) => {
  try {
    if (!req.query.code) return redirectWithError(res, 'Facebook did not return an auth code.')
    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token')
    tokenUrl.searchParams.set('client_id', process.env.FACEBOOK_APP_ID)
    tokenUrl.searchParams.set('client_secret', process.env.FACEBOOK_APP_SECRET)
    tokenUrl.searchParams.set('redirect_uri', process.env.FACEBOOK_CALLBACK_URL)
    tokenUrl.searchParams.set('code', req.query.code)
    const tokenResponse = await fetch(tokenUrl)
    if (!tokenResponse.ok) return redirectWithError(res, 'Facebook token exchange failed.')
    const token = await tokenResponse.json()
    const profileUrl = new URL('https://graph.facebook.com/me')
    profileUrl.searchParams.set('fields', 'id,name,email,picture')
    profileUrl.searchParams.set('access_token', token.access_token)
    const profileResponse = await fetch(profileUrl)
    if (!profileResponse.ok) return redirectWithError(res, 'Could not read Facebook profile.')
    const profile = await profileResponse.json()
    if (!profile.email) return redirectWithError(res, 'Facebook account has no email address.')
    const user = await upsertOAuthUser({
      email: profile.email,
      name: profile.name,
      photo: profile.picture?.data?.url,
    })
    redirectWithUser(res, user)
  } catch (error) {
    console.error(error)
    redirectWithError(res, 'Facebook sign-in failed.')
  }
})

app.get('/api/registration/codes', async (_req, res) => {
  try {
    const result = await query(
      `SELECT id, code, role, created_at AS "createdAt", used, used_by AS "usedBy"
       FROM registration_codes
       ORDER BY created_at DESC`
    )
    res.json(result.rows)
  } catch (error) {
    sendError(res, error)
  }
})

app.post('/api/registration/codes', async (req, res) => {
  try {
    const entry = { id: crypto.randomUUID(), code: makeCode(), role: req.body.role || 'Employee' }
    const result = await query(
      `INSERT INTO registration_codes (id, code, role)
       VALUES ($1, $2, $3)
       RETURNING id, code, role, created_at AS "createdAt", used, used_by AS "usedBy"`,
      [entry.id, entry.code, entry.role]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    sendError(res, error)
  }
})

app.delete('/api/registration/codes/:id', async (req, res) => {
  try {
    await query('DELETE FROM registration_codes WHERE id = $1', [req.params.id])
    res.status(204).end()
  } catch (error) {
    sendError(res, error)
  }
})

app.post('/api/registration/codes/validate', async (req, res) => {
  try {
    const code = String(req.body.code || '').toUpperCase()
    const result = await query('SELECT * FROM registration_codes WHERE code = $1 AND used = FALSE LIMIT 1', [code])
    const entry = result.rows[0]
    if (!entry) return res.status(404).json({ valid: false, reason: 'Invalid or already used code.' })
    if (entry.role !== req.body.role) return res.status(400).json({ valid: false, reason: `This code is for ${entry.role} role only.` })
    res.json({ valid: true, entry })
  } catch (error) {
    sendError(res, error)
  }
})

app.get('/api/registration/pending', async (_req, res) => {
  try {
    const result = await query(
      `SELECT id, full_name, email, phone, username, role, staff_id, department, warehouse_location,
              warehouse_code, assigned_zone, shift, reg_code, photo, access_level,
              account_status, submitted_at AS "submittedAt"
       FROM pending_accounts
       ORDER BY submitted_at DESC`
    )
    res.json(result.rows)
  } catch (error) {
    sendError(res, error)
  }
})

app.post('/api/registration/pending', async (req, res) => {
  try {
    const a = req.body
    const id = crypto.randomUUID()
    const result = await query(
      `INSERT INTO pending_accounts
       (id, full_name, email, phone, username, password_hash, role, staff_id, department,
        warehouse_location, warehouse_code, assigned_zone, shift, reg_code, photo, access_level, account_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING id, full_name, email, phone, username, role, staff_id, department, warehouse_location,
                 warehouse_code, assigned_zone, shift, reg_code, photo, access_level,
                 account_status, submitted_at AS "submittedAt"`,
      [id, a.full_name, a.email, a.phone, a.username, hashPassword(a.password), a.role, a.staff_id, a.department, a.warehouse_location, a.warehouse_code, a.assigned_zone, a.shift, a.reg_code, a.photo, a.access_level, a.account_status || 'Pending Approval']
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    sendError(res, error)
  }
})

app.post('/api/registration/pending/:id/approve', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const pending = await client.query('SELECT * FROM pending_accounts WHERE id = $1 FOR UPDATE', [req.params.id])
    const account = pending.rows[0]
    if (!account) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Pending account not found.' })
    }
    const userId = crypto.randomUUID()
    await client.query(
      `INSERT INTO app_users (id, name, emp_id, email, phone, role, site, department, status, password_hash, photo, approved_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Active', $9, $10, NOW())
       ON CONFLICT (email) DO UPDATE
       SET status = 'Active', role = EXCLUDED.role, password_hash = EXCLUDED.password_hash, approved_at = NOW()`,
      [userId, account.full_name, account.staff_id, account.email, account.phone, account.role, account.warehouse_location, account.department, account.password_hash, account.photo]
    )
    await client.query('UPDATE registration_codes SET used = TRUE, used_by = $1 WHERE code = $2', [account.email, account.reg_code])
    await client.query('DELETE FROM pending_accounts WHERE id = $1', [req.params.id])
    await client.query('COMMIT')
    res.status(204).end()
  } catch (error) {
    await client.query('ROLLBACK')
    sendError(res, error)
  } finally {
    client.release()
  }
})

app.delete('/api/registration/pending/:id', async (req, res) => {
  try {
    await query('DELETE FROM pending_accounts WHERE id = $1', [req.params.id])
    res.status(204).end()
  } catch (error) {
    sendError(res, error)
  }
})

app.get('/api/products', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM products ORDER BY product_name')
    res.json(result.rows.map(p => ({
      ...p,
      unit_cost: Number(p.unit_cost),
      selling_price: Number(p.selling_price),
    })))
  } catch (error) {
    sendError(res, error)
  }
})

app.delete('/api/products/:id', async (req, res) => {
  try {
    await query('DELETE FROM products WHERE id = $1', [req.params.id])
    res.status(204).end()
  } catch (error) {
    sendError(res, error)
  }
})

app.get('/api/categories', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM categories ORDER BY name')
    res.json(result.rows)
  } catch (error) {
    sendError(res, error)
  }
})

app.get('/api/inventory', async (_req, res) => {
  try {
    const result = await query(`
      SELECT id, product_name AS product, sku,
             quantity AS qty_on_hand,
             FLOOR(quantity * 0.1)::INTEGER AS qty_reserved,
             FLOOR(quantity * 0.9)::INTEGER AS qty_available,
             location, warehouse, batch,
             CASE status
               WHEN 'active' THEN 'In Stock'
               WHEN 'low' THEN 'Low Stock'
               WHEN 'out' THEN 'Out of Stock'
               ELSE 'Out of Stock'
             END AS status
      FROM products
      ORDER BY product_name
    `)
    res.json(result.rows)
  } catch (error) {
    sendError(res, error)
  }
})

app.get('/api/movements', async (_req, res) => {
  try {
    const result = await query(
      'SELECT id, date, product, sku, type, quantity, warehouse, description, user_name AS "user" FROM stock_movements ORDER BY date DESC'
    )
    res.json(result.rows)
  } catch (error) { sendError(res, error) }
})

app.post('/api/movements', async (req, res) => {
  try {
    const { product, sku, type, quantity, warehouse, description, user_name } = req.body
    const id = require('crypto').randomUUID()
    const date = new Date().toISOString().split('T')[0]
    await query(
      'INSERT INTO stock_movements (id,date,product,sku,type,quantity,warehouse,description,user_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [id, date, product, sku || '', type, quantity, warehouse || '', description || '', user_name || 'System']
    )
    res.json({ id, date, product, sku, type, quantity, warehouse, description, user: user_name || 'System' })
  } catch (error) { sendError(res, error) }
})

app.get('/api/alerts', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM alerts ORDER BY created DESC')
    res.json(result.rows)
  } catch (error) { sendError(res, error) }
})

app.patch('/api/alerts/:id/resolve', async (req, res) => {
  try {
    await query("UPDATE alerts SET status='Resolved' WHERE id=$1", [req.params.id])
    res.json({ ok: true })
  } catch (error) { sendError(res, error) }
})

app.get('/api/zones', async (_req, res) => {
  try {
    const zones = await query('SELECT * FROM warehouse_zones ORDER BY warehouse, zone')
    const wh = await query('SELECT * FROM warehouses ORDER BY warehouse_name')
    res.json({ zones: zones.rows, warehouses: wh.rows })
  } catch (error) { sendError(res, error) }
})

app.get('/api/batches', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM batches ORDER BY expiry_date')
    res.json(result.rows)
  } catch (error) { sendError(res, error) }
})

app.get('/api/audit-logs', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM audit_logs ORDER BY time DESC')
    res.json(result.rows)
  } catch (error) { sendError(res, error) }
})

app.get('/api/notifications', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM notifications ORDER BY id DESC')
    res.json(result.rows)
  } catch (error) { sendError(res, error) }
})

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    await query('UPDATE notifications SET read=TRUE WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (error) { sendError(res, error) }
})

app.patch('/api/notifications/read-all', async (_req, res) => {
  try {
    await query('UPDATE notifications SET read=TRUE')
    res.json({ ok: true })
  } catch (error) { sendError(res, error) }
})

app.get('/api/dashboard', async (_req, res) => {
  try {
    const [productsRes, lowStockRes, suppliersRes, movementsRes, alertsRes, catRes] = await Promise.all([
      query('SELECT COUNT(*) AS cnt FROM products'),
      query("SELECT COUNT(*) AS cnt FROM products WHERE status IN ('low', 'out')"),
      query('SELECT COUNT(DISTINCT supplier) AS cnt FROM products WHERE supplier IS NOT NULL AND supplier != \'\''),
      query(`SELECT product, type, quantity, date, description, COALESCE(user_name, 'System') AS "user"
             FROM stock_movements ORDER BY date DESC LIMIT 10`),
      query("SELECT product, priority, message, status FROM alerts WHERE status != 'resolved' ORDER BY created DESC LIMIT 10"),
      query(`SELECT c.name, COUNT(p.id) AS cnt
             FROM categories c LEFT JOIN products p ON p.category_id = c.id
             GROUP BY c.name ORDER BY cnt DESC LIMIT 8`),
    ])

    const totalProducts = parseInt(productsRes.rows[0]?.cnt || 0)
    const lowStock = parseInt(lowStockRes.rows[0]?.cnt || 0)
    const totalSuppliers = parseInt(suppliersRes.rows[0]?.cnt || 0)

    const valueRes = await query('SELECT COALESCE(SUM(quantity * unit_cost), 0) AS total FROM products')
    const totalInventoryValue = Math.round(parseFloat(valueRes.rows[0]?.total || 0))

    const maxCat = Math.max(...catRes.rows.map(r => parseInt(r.cnt)), 1)
    const categoryStockData = catRes.rows.map(r => ({
      name: r.name,
      value: Math.round((parseInt(r.cnt) / maxCat) * 100),
    }))

    res.json({
      stats: { totalProducts, lowStock, totalSuppliers, totalInventoryValue },
      movements: movementsRes.rows,
      alerts: alertsRes.rows,
      categoryStockData,
    })
  } catch (error) {
    sendError(res, error)
  }
})

app.get('/api/admin/stats', async (_req, res) => {
  try {
    const [usersRes, byRoleRes, bySiteRes, activityRes] = await Promise.all([
      query(`SELECT id, name, emp_id, email, phone, role, site, department, status, locked, last_login FROM app_users ORDER BY name`),
      query(`SELECT role, COUNT(*) AS count FROM app_users GROUP BY role ORDER BY count DESC`),
      query(`SELECT COALESCE(site, 'Unassigned') AS site, COUNT(*) AS count FROM app_users GROUP BY site ORDER BY count DESC`),
      query(`SELECT name AS "user", 'Logged in' AS action, 'Success' AS status FROM app_users ORDER BY name LIMIT 10`),
    ])
    res.json({
      users: usersRes.rows,
      usersByRole: byRoleRes.rows.map(r => ({ role: r.role, count: parseInt(r.count) })),
      usersBySite: bySiteRes.rows.map(r => ({ site: r.site, count: parseInt(r.count) })),
      recentAdminActivity: activityRes.rows,
    })
  } catch (error) { sendError(res, error) }
})

app.get('/api/users', async (_req, res) => {
  try {
    const r = await query(`SELECT id, name, emp_id, email, phone, role, site, department, status, locked, last_login FROM app_users ORDER BY name`)
    res.json(r.rows)
  } catch (error) { sendError(res, error) }
})

app.get('/api/users/:id', async (req, res) => {
  try {
    const r = await query(`SELECT id, name, emp_id, email, phone, role, site, department, address, manager, doj, dob, status, locked, last_login FROM app_users WHERE id=$1`, [req.params.id])
    if (!r.rows[0]) return res.status(404).json({ error: 'User not found' })
    res.json(r.rows[0])
  } catch (error) { sendError(res, error) }
})

app.get('/api/suppliers', async (_req, res) => {
  try {
    const r = await query(`SELECT id, supplier_code, supplier_name, email, phone, address, status FROM suppliers ORDER BY supplier_name`)
    res.json(r.rows)
  } catch (error) { sendError(res, error) }
})

app.get('/api/warehouses', async (_req, res) => {
  try {
    const r = await query(`SELECT id, warehouse_code, warehouse_name, status FROM warehouses ORDER BY warehouse_name`)
    res.json(r.rows)
  } catch (error) { sendError(res, error) }
})

function getAI() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

app.post('/api/chat', async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({ error: 'AI assistant is not configured. Add GROQ_API_KEY to your .env file.' })
    }

    const { messages, userRole } = req.body
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required.' })
    }

    const [productsRes, alertsRes, movementsRes, categoriesRes, zonesRes] = await Promise.all([
      query('SELECT product_name, sku, quantity, status, category, warehouse, location, reorder_level, unit_cost, selling_price, unit FROM products ORDER BY product_name LIMIT 100'),
      query("SELECT product, type, priority, message, status, created FROM alerts WHERE status != 'resolved' ORDER BY created DESC LIMIT 20"),
      query('SELECT product, sku, type, quantity, warehouse, date, description FROM stock_movements ORDER BY date DESC LIMIT 20'),
      query('SELECT name, product_count FROM categories ORDER BY name'),
      query('SELECT warehouse, zone, capacity, max_capacity, stored FROM warehouse_zones ORDER BY warehouse, zone'),
    ])

    const products = productsRes.rows
    const lowStock = products.filter(p => Number(p.quantity) <= Number(p.reorder_level))
    const outOfStock = products.filter(p => Number(p.quantity) === 0)
    const totalValue = products.reduce((s, p) => s + Number(p.quantity) * Number(p.unit_cost || 0), 0)

    const systemPrompt = `You are an AI assistant for Moonlight WMS (Warehouse Management System), a grocery warehouse management platform. Help the user with inventory questions accurately and concisely.

Current user role: ${userRole || 'Employee'}
Today's date: ${new Date().toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

=== INVENTORY SNAPSHOT ===
Total products tracked: ${products.length}
Total inventory value: $${totalValue.toFixed(2)} AUD
Low stock items (at or below reorder level): ${lowStock.length}
Out of stock items: ${outOfStock.length}

=== PRODUCTS ===
${products.map(p => `• ${p.product_name} | SKU: ${p.sku} | Qty: ${p.quantity} ${p.unit || ''} | Reorder at: ${p.reorder_level} | Status: ${p.status} | Warehouse: ${p.warehouse || 'N/A'} | Location: ${p.location || 'N/A'} | Cost: $${Number(p.unit_cost).toFixed(2)} | Sell: $${Number(p.selling_price).toFixed(2)}`).join('\n')}

=== CATEGORIES ===
${categoriesRes.rows.map(c => `• ${c.name}: ${c.product_count} products`).join('\n')}

=== WAREHOUSE ZONES ===
${zonesRes.rows.map(z => `• ${z.warehouse} — ${z.zone}: ${z.capacity}/${z.max_capacity} capacity | Stored: ${z.stored || 'N/A'}`).join('\n')}

=== ACTIVE ALERTS ===
${alertsRes.rows.length > 0 ? alertsRes.rows.map(a => `• [${(a.priority || 'info').toUpperCase()}] ${a.message} (${a.created || ''})`).join('\n') : 'No active alerts'}

=== RECENT STOCK MOVEMENTS (last 20) ===
${movementsRes.rows.map(m => `• ${m.date} | ${m.product} (${m.sku}) | ${m.type} | Qty: ${m.quantity} | ${m.warehouse} | ${m.description || ''}`).join('\n')}

INSTRUCTIONS:
- Answer questions using only the data above. Do not invent inventory figures.
- Be concise — prefer bullet points for lists.
- If asked for something outside your data, say you don't have that info.
- For calculations, compute them correctly from the data provided.
- Respond in plain text only, no markdown headers.`

    const ai = getAI()
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-12)
        .map(m => ({ role: m.role, content: String(m.content) })),
    ]

    const completion = await ai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: chatMessages,
      max_tokens: 1024,
    })

    res.json({ content: completion.choices[0].message.content })
  } catch (error) {
    console.error('Chat error:', error.message || error)
    res.status(500).json({ error: error.message || 'AI assistant request failed.' })
  }
})

async function start() {
  try {
    await initDb()
  } catch (error) {
    if (error.code !== '3D000') throw error
    await createDatabaseIfMissing()
    await initDb()
  }
  app.listen(PORT, () => {
    console.log(`Moonlight WMS API running on http://localhost:${PORT}`)
    console.log(`Using PostgreSQL: ${DATABASE_URL.replace(/:[^:@/]+@/, ':***@')}`)
  })
}

start().catch(error => {
  console.error('Failed to start API server.')
  console.error(error)
  process.exit(1)
})
