# Moonlight WMS

A production-grade Warehouse Management System built for grocery businesses. Manage inventory, track stock movements, handle multi-site operations, and get AI-powered insights.

---

## Quick Start

### Windows
```
Double-click  run.bat
```

### Linux / macOS
```bash
chmod +x run.sh
./run.sh
```

The script handles everything automatically:
- Installs Node.js (if missing)
- Installs PostgreSQL (if missing)
- Guides you through setting your database password
- Installs npm packages
- Creates the database and tables
- Asks whether to seed 10,000 grocery products
- Launches the app

Open **http://localhost:5173** in your browser when it's ready.

---

## Features

- **Multi-role dashboards** — Admin, Manager, Site Manager, Employee
- **Inventory management** — real-time stock with batch and zone support
- **AI Assistant** — built-in chatbot (Groq / llama-3.1-8b) with live DB context
- **Stock movements** — full inbound / outbound / transfer audit trail
- **Alerts & notifications** — low stock, expiry, and reorder alerts
- **Reports** — visual analytics across products, categories, and warehouses
- **Audit log** — tamper-visible history of every user action

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL |
| AI | Groq SDK — llama-3.1-8b-instant |
| Charts | Recharts |
| Icons | Lucide React, Material Icons Round |

---

## Prerequisites

You only need these two things. The run scripts install everything else.

| Requirement | Notes |
|-------------|-------|
| **Windows 10/11** or **Linux** or **macOS** | Any modern 64-bit OS |
| **Internet connection** (first run only) | To download Node.js and PostgreSQL if missing |

> If Node.js and PostgreSQL are already installed, no internet is needed after the first run.

---

## What the Run Scripts Do (Step by Step)

```
[1] Check Node.js        → install via winget / Homebrew / apt if missing
[2] Check PostgreSQL     → install via winget / Homebrew / apt if missing
[3] Configure .env       → ask for DB password + Groq API key (keeps existing values)
[4] npm install          → only on first run
[5] Start PG service     → auto-start if not running
[6] Create database      → creates moonlight_wms if it doesn't exist
[7] Seed data            → asks: seed fresh / skip / re-seed if data exists
    Launch               → npm run dev:full → http://localhost:5173
```

Re-running the script is safe — it skips steps that are already done.

---

## Manual Setup (advanced)

If you prefer to set up manually instead of using the run scripts:

### 1. Install prerequisites
- Node.js 18+: https://nodejs.org/
- PostgreSQL 14+: https://www.postgresql.org/download/

### 2. Create the database
```bash
psql -U postgres -c "CREATE DATABASE moonlight_wms;"
```

### 3. Configure environment
Copy `.env.example` to `.env` and fill in your values:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/moonlight_wms
PORT=3001
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Install packages
```bash
npm install
```

### 5. Seed the database

**Windows:**
```bat
seed.bat
```

**Linux / macOS:**
```bash
chmod +x seed.sh
./seed.sh
```

**Or directly:**
```bash
node seed.mjs
```

### 6. Start the app
```bash
npm run dev:full
```

Open http://localhost:5173

---

## Seed Data

The seeder inserts:
- **10,000 grocery products** across 15 categories
- **3 warehouses** (Main, Cold Storage, East Distribution)
- **10 suppliers**
- **4 user accounts**, one per role:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@moonlight.wms | Admin@1234 |
| Manager | manager@moonlight.wms | Manager@1234 |
| Site Manager | sitemanager@moonlight.wms | SiteMgr@1234 |
| Employee | employee@moonlight.wms | Employee@1234 |

After seeding, a `.seeded` file is written to the project root. The run scripts check this file on every launch — if it exists, they won't re-seed unless you explicitly confirm.

---

## Project Structure

```
moonlight-wms/
├── backend/
│   └── server.cjs          # Express API + automatic DB schema setup
├── src/
│   ├── components/         # Layout, Sidebar, AI Chatbot, UI primitives
│   ├── context/            # Auth context
│   └── pages/              # All page components
│       ├── admin/          # Admin-only pages
│       └── sitemanager/    # Site Manager pages
├── .env.example            # Config template — copy to .env
├── seed.mjs                # Database seeder (Node.js)
├── seed.bat                # Windows: run seeder standalone
├── seed.sh                 # Linux/macOS: run seeder standalone
├── run.bat                 # Windows: full setup + launch
└── run.sh                  # Linux/macOS: full setup + launch
```

---

## User Roles

| Role | Access |
|------|--------|
| **Admin** | Full system — users, roles, permissions, security, all sites |
| **Manager** | Full inventory — products, movements, reports, alerts |
| **Site Manager** | Site-scoped — inventory, movements, zones, reports for assigned site |
| **Employee** | Read + limited write — inventory viewing, stock movements |

---

## AI Assistant

The AI chatbot queries your live database before each response, giving contextually accurate answers about your actual inventory. Example questions:

- *"Which products are running low?"*
- *"How many units of Organic Apples do we have?"*
- *"Show me recent stock movements"*

**Getting a free Groq API key:**
1. Go to https://console.groq.com/
2. Sign up — no credit card required
3. Click **API Keys → Create API Key**
4. Enter the key when the run script prompts you, or add it to `.env` manually

Free tier: 14,400 requests/day — sufficient for a full team.

---

## API Reference

The backend runs on `http://localhost:3001`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Authenticate user |
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/inventory` | Stock levels |
| GET | `/api/movements` | Movement history |
| POST | `/api/movements` | Record movement |
| GET | `/api/categories` | Categories |
| GET | `/api/suppliers` | Suppliers |
| GET | `/api/alerts` | Active alerts |
| GET | `/api/users` | Users (Admin only) |
| POST | `/api/chat` | AI assistant |

---

## Troubleshooting

**PostgreSQL connection refused**
```bash
# Windows
net start postgresql-x64-16

# Linux
sudo systemctl start postgresql

# macOS
brew services start postgresql@16
```

**Wrong password / auth failed**
Re-run `run.bat` or `run.sh` — it will prompt you to enter the correct password and update `.env`.

**Database does not exist**
```bash
psql -U postgres -c "CREATE DATABASE moonlight_wms;"
```

**AI chatbot returns an error**
Check `GROQ_API_KEY` in `.env`. Get a free key at https://console.groq.com/

**node_modules missing**
```bash
npm install
```

**Permission denied on run.sh (Linux/macOS)**
```bash
chmod +x run.sh seed.sh
```

---

## Security Notes

- Passwords are hashed: `sha256(plaintext + "moonlight_salt_v1")` — never stored in plain text.
- `.env` is not included in the ZIP — configure it fresh on each machine using `.env.example` as a template.
- The `_DBPASS` line in `.env` is a local-only helper used by the run scripts to remember your DB password across re-runs. It is not read by the application.

---

## License

Internal use only. All rights reserved — Moonlight Grocery WMS.
