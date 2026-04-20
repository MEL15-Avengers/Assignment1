# Moonlight WMS

A production-grade Warehouse Management System built for grocery businesses. Manage inventory, track stock movements, handle multi-site operations, and get AI-powered insights — all from a single desktop application.

---

## Features

- **Multi-role access** — Admin, Manager, Site Manager, Employee dashboards
- **Inventory management** — Real-time stock tracking with batch and zone support
- **AI Assistant** — Built-in chatbot powered by Groq (llama-3.1-8b) with live DB context
- **Stock movements** — Full audit trail of every inbound, outbound, and transfer
- **Alerts & notifications** — Low stock, expiry, and reorder alerts
- **Reports** — Visual analytics across products, categories, and warehouses
- **Audit log** — Tamper-visible history of all user actions
- **Electron desktop app** — Runs natively on Windows; also works in any browser

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL |
| AI | Groq SDK (llama-3.1-8b-instant) |
| Desktop | Electron 33 |
| Charts | Recharts |
| Icons | Lucide React, Material Icons Round |

---

## Prerequisites

Before running the app, make sure you have:

| Requirement | Version | Download |
|-------------|---------|----------|
| Node.js | 18 or later | https://nodejs.org/ |
| npm | 9 or later | Included with Node.js |
| PostgreSQL | 14 or later | https://www.postgresql.org/download/ |

> **PostgreSQL quick check** — Open a terminal and run `psql --version`. If you see a version number, you're good. If not, install it first.

---

## Project Structure

```
moonlight-wms/
├── backend/
│   └── server.cjs          # Express API + DB schema auto-setup
├── electron/
│   └── main.cjs            # Electron entry point
├── src/
│   ├── components/         # Layout, Sidebar, AI Chatbot, UI primitives
│   ├── context/            # Auth context
│   ├── pages/              # All page components
│   │   ├── admin/          # Admin-only pages
│   │   └── sitemanager/    # Site Manager pages
│   └── main.jsx            # React entry point
├── seed.mjs                # Database seeder (10,000 products + users)
├── seed.bat                # Windows seed runner
├── seed.sh                 # Linux/macOS seed runner
├── run.bat                 # Windows app launcher
├── run.sh                  # Linux/macOS app launcher
├── .env                    # Environment variables (create this)
└── package.json
```

---

## Setup

### Step 1 — Clone or extract the project

```bash
cd moonlight-wms
```

### Step 2 — Create the `.env` file

Create a file named `.env` in the project root with the following content:

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/moonlight_wms

# Groq AI API key (free at https://console.groq.com/)
GROQ_API_KEY=your_groq_api_key_here

# Server port (optional, defaults to 3001)
PORT=3001
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

> The database `moonlight_wms` will be **created automatically** by the app on first run. You do not need to create it manually.

### Step 3 — Create the database

Open your PostgreSQL terminal (psql) and run:

```sql
CREATE DATABASE moonlight_wms;
```

Or using the command line:

```bash
# Windows
psql -U postgres -c "CREATE DATABASE moonlight_wms;"

# Linux / macOS
psql -U postgres -c "CREATE DATABASE moonlight_wms;"
```

The app will automatically create all tables on first startup.

### Step 4 — Install dependencies

```bash
npm install
```

### Step 5 — Seed the database

Populate the database with 10,000 grocery products and one account per stakeholder role.

**Windows:**
```bat
seed.bat
```

**Linux / macOS:**
```bash
chmod +x seed.sh
./seed.sh
```

**Or run directly:**
```bash
node seed.mjs
```

The seeder will print a summary when done:

```
┌────────────────┬──────────────────────────────────┬────────────────┐
│ Role           │ Email                            │ Password       │
├────────────────┼──────────────────────────────────┼────────────────┤
│ Admin          │ admin@moonlight.wms              │ Admin@1234     │
│ Manager        │ manager@moonlight.wms            │ Manager@1234   │
│ Site Manager   │ sitemanager@moonlight.wms        │ SiteMgr@1234   │
│ Employee       │ employee@moonlight.wms           │ Employee@1234  │
└────────────────┴──────────────────────────────────┴────────────────┘
```

---

## Running the App

### Desktop app (Electron)

**Windows:**
```bat
run.bat
```

**Linux / macOS:**
```bash
chmod +x run.sh
./run.sh
```

This starts the backend API and launches the Electron desktop window automatically.

### Browser / Web mode

Start the backend and frontend separately:

```bash
# Terminal 1 — API server
npm run api

# Terminal 2 — Frontend dev server
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Combined (one command)

```bash
npm run dev:full
```

---

## User Roles

| Role | Access |
|------|--------|
| **Admin** | Full system access — users, roles, permissions, security, all sites |
| **Manager** | Full inventory access — products, movements, reports, alerts |
| **Site Manager** | Site-scoped access — inventory, movements, zones, reports for assigned site |
| **Employee** | Read + limited write — inventory viewing, stock movements |

Each role has a separate dashboard and navigation tailored to their responsibilities.

---

## API Endpoints

The backend runs on `http://localhost:3001` by default.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Authenticate user |
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/inventory` | Inventory with stock levels |
| GET | `/api/movements` | Stock movement history |
| POST | `/api/movements` | Record movement |
| GET | `/api/categories` | All categories |
| GET | `/api/suppliers` | All suppliers |
| GET | `/api/alerts` | Active alerts |
| GET | `/api/users` | All users (Admin only) |
| POST | `/api/chat` | AI assistant query |

---

## Building the Windows Installer

To produce a distributable `.exe` installer:

```bash
npm run electron:build:win
```

Output files appear in `dist-exe/`:
- `MoonlightWMS Setup x.x.x.exe` — NSIS installer
- `MoonlightWMS-Portable-x.x.x.exe` — portable, no install needed

> Requires Windows or a Windows cross-compile environment.

---

## Getting a Free Groq API Key

The AI assistant uses Groq's free tier (no credit card required).

1. Go to https://console.groq.com/
2. Sign up with GitHub or email
3. Click **API Keys** → **Create API Key**
4. Copy the key into your `.env` as `GROQ_API_KEY`

Free tier includes 14,400 requests/day — more than enough for a WMS team.

---

## Troubleshooting

**`ECONNREFUSED` on startup**
- PostgreSQL is not running. Start it:
  - Windows: Open *Services* → find *PostgreSQL* → Start
  - Linux: `sudo systemctl start postgresql`
  - macOS: `brew services start postgresql`

**`database "moonlight_wms" does not exist`**
- Run: `psql -U postgres -c "CREATE DATABASE moonlight_wms;"`

**`password authentication failed`**
- Check the password in `DATABASE_URL` in your `.env` matches your PostgreSQL password.

**AI chatbot shows "AI assistant request failed"**
- Check that `GROQ_API_KEY` is set correctly in `.env` and the server was restarted after the change.

**Logout button or icons not showing**
- The app requires an internet connection on first load to fetch the Material Icons font from Google Fonts. On subsequent loads it uses the cached version.

**`node_modules` not found**
- Run `npm install` in the project root before launching.

---

## Password Security

Passwords are hashed using SHA-256 with a server-side salt:

```
hash = sha256(plaintext + "moonlight_salt_v1")
```

Passwords are never stored or transmitted in plaintext.

---

## License

Internal use only. All rights reserved — Moonlight Grocery WMS.
