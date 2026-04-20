#!/usr/bin/env bash
# =============================================================================
#  MOONLIGHT WMS  --  Setup & Launcher  (Linux / macOS)
#  Handles: Node.js, PostgreSQL, .env, database, seed data, launch
# =============================================================================

set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENVFILE="$DIR/.env"
SEEDED="$DIR/.seeded"
DB="moonlight_wms"
PGUSER_DEFAULT="postgres"

# ── Colors ────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
info()  { echo -e "${GREEN}  ✓${NC}  $*"; }
warn()  { echo -e "${YELLOW}  !${NC}  $*"; }
error() { echo -e "${RED}  ✗${NC}  $*"; }
step()  { echo -e "\n${CYAN}  [$1]${NC}  $2..."; }

echo ""
echo "  +======================================================+"
echo "  |       MOONLIGHT WMS  --  Setup & Launcher           |"
echo "  |       Warehouse Management System for Grocery       |"
echo "  +======================================================+"
echo ""

# ── Detect OS ─────────────────────────────────────────────────────────────────
OS="unknown"
PKG=""
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ -f /etc/debian_version ]]; then
    OS="debian"; PKG="apt"
elif [[ -f /etc/fedora-release ]] || [[ -f /etc/redhat-release ]]; then
    OS="fedora"; PKG="dnf"
elif [[ -f /etc/arch-release ]]; then
    OS="arch"; PKG="pacman"
fi

# =============================================================================
#  STEP 1: Node.js
# =============================================================================
step "1/7" "Checking Node.js"

install_node() {
    warn "Node.js not found. Installing..."

    if [[ "$OS" == "macos" ]]; then
        if command -v brew &>/dev/null; then
            brew install node
        else
            warn "Homebrew not found. Installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            brew install node
        fi

    elif [[ "$OS" == "debian" ]]; then
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs

    elif [[ "$OS" == "fedora" ]]; then
        curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
        sudo dnf install -y nodejs

    elif [[ "$OS" == "arch" ]]; then
        sudo pacman -Sy --noconfirm nodejs npm

    else
        error "Cannot auto-install Node.js on this OS."
        echo "  Please install Node.js 18+ from: https://nodejs.org/"
        echo "  Then re-run this script."
        exit 1
    fi
}

if ! command -v node &>/dev/null; then
    install_node
fi

if ! command -v node &>/dev/null; then
    error "Node.js installation failed."
    echo "  Install manually: https://nodejs.org/"
    exit 1
fi

NODE_VER=$(node --version)
info "Node.js $NODE_VER is ready."

# =============================================================================
#  STEP 2: PostgreSQL
# =============================================================================
step "2/7" "Checking PostgreSQL"

install_postgres() {
    warn "PostgreSQL not found. Installing..."

    if [[ "$OS" == "macos" ]]; then
        brew install postgresql@16
        brew services start postgresql@16
        # Add pg to PATH for this session
        export PATH="/opt/homebrew/opt/postgresql@16/bin:/usr/local/opt/postgresql@16/bin:$PATH"

    elif [[ "$OS" == "debian" ]]; then
        sudo apt-get update -qq
        sudo apt-get install -y postgresql postgresql-contrib
        sudo systemctl enable postgresql
        sudo systemctl start postgresql

    elif [[ "$OS" == "fedora" ]]; then
        sudo dnf install -y postgresql-server postgresql-contrib
        sudo postgresql-setup --initdb
        sudo systemctl enable postgresql
        sudo systemctl start postgresql

    elif [[ "$OS" == "arch" ]]; then
        sudo pacman -Sy --noconfirm postgresql
        sudo -u postgres initdb -D /var/lib/postgres/data
        sudo systemctl enable postgresql
        sudo systemctl start postgresql

    else
        error "Cannot auto-install PostgreSQL on this OS."
        echo "  Install from: https://www.postgresql.org/download/"
        exit 1
    fi

    echo ""
    warn "PostgreSQL was just installed."
    echo "  You may need to set a password for the 'postgres' user."
    echo "  You can do this by running:"
    echo "    sudo -u postgres psql -c \"ALTER USER postgres PASSWORD 'yourpassword';\""
    echo ""
}

# On macOS Homebrew, psql may be in a versioned path
if [[ "$OS" == "macos" ]]; then
    for v in 16 15 17 14; do
        for prefix in /opt/homebrew /usr/local; do
            if [[ -f "$prefix/opt/postgresql@$v/bin/psql" ]]; then
                export PATH="$prefix/opt/postgresql@$v/bin:$PATH"
                break 2
            fi
        done
    done
fi

if ! command -v psql &>/dev/null; then
    install_postgres
fi

if ! command -v psql &>/dev/null; then
    error "PostgreSQL (psql) not found after installation."
    echo "  Install from: https://www.postgresql.org/download/"
    exit 1
fi

info "PostgreSQL found: $(psql --version | head -1)"

# =============================================================================
#  STEP 3: Environment (.env)
# =============================================================================
step "3/7" "Configuring environment"

EXISTING_GROQ=""
EXISTING_DBPASS=""

if [[ -f "$ENVFILE" ]]; then
    EXISTING_GROQ=$(grep -E '^GROQ_API_KEY=' "$ENVFILE" | cut -d= -f2- | tr -d '"' | tr -d "'")
    EXISTING_DBPASS=$(grep -E '^_DBPASS=' "$ENVFILE"   | cut -d= -f2- | tr -d '"' | tr -d "'")
fi

echo ""
echo "  --- Database Password ---"
if [[ -n "$EXISTING_DBPASS" ]]; then
    read -rp "  PostgreSQL 'postgres' password [Enter to keep existing]: " DB_PASS
    [[ -z "$DB_PASS" ]] && DB_PASS="$EXISTING_DBPASS"
else
    read -rp "  Enter PostgreSQL 'postgres' user password: " DB_PASS
    [[ -z "$DB_PASS" ]] && DB_PASS="postgres"
fi

echo ""
echo "  --- AI Assistant (Groq) ---"
if [[ -n "$EXISTING_GROQ" ]]; then
    echo "  Existing Groq key found."
    read -rp "  Groq API Key [Enter to keep existing]: " GROQ_KEY
    [[ -z "$GROQ_KEY" ]] && GROQ_KEY="$EXISTING_GROQ"
else
    echo "  Get a FREE key at: https://console.groq.com/"
    read -rp "  Groq API Key (or Enter to configure later): " GROQ_KEY
    [[ -z "$GROQ_KEY" ]] && GROQ_KEY="your_groq_api_key_here"
fi

cat > "$ENVFILE" <<EOF
DATABASE_URL=postgresql://postgres:${DB_PASS}@localhost:5432/${DB}
PORT=3001
GROQ_API_KEY=${GROQ_KEY}
_DBPASS=${DB_PASS}
EOF

export PGPASSWORD="$DB_PASS"
info ".env saved."

# =============================================================================
#  STEP 4: npm packages
# =============================================================================
step "4/7" "Installing npm packages"

if [[ ! -d "$DIR/node_modules" ]]; then
    echo "  Installing packages (first run may take 1-2 min)..."
    cd "$DIR" && npm install --loglevel=error
    info "Packages installed."
else
    info "Already installed."
fi

# =============================================================================
#  STEP 5: Ensure PostgreSQL is running
# =============================================================================
step "5/7" "Starting PostgreSQL service"

start_pg() {
    if [[ "$OS" == "macos" ]]; then
        brew services start postgresql@16 &>/dev/null || \
        brew services start postgresql    &>/dev/null || true
    elif command -v systemctl &>/dev/null; then
        sudo systemctl start postgresql &>/dev/null || true
    fi
}

# Test if postgres is reachable; start service if not
if ! psql -U postgres -h localhost -p 5432 -c "" &>/dev/null; then
    start_pg
    sleep 2
fi

if psql -U postgres -h localhost -p 5432 -c "" &>/dev/null; then
    info "PostgreSQL is running."
else
    warn "Cannot reach PostgreSQL on localhost:5432."
    echo "  Verify PostgreSQL is running and your password is correct."
    echo "  Edit .env if needed: $ENVFILE"
fi

# =============================================================================
#  STEP 6: Create database
# =============================================================================
step "6/7" "Setting up database"

if psql -U postgres -h localhost -p 5432 -lqt 2>/dev/null | cut -d\| -f1 | grep -qw "$DB"; then
    info "Database '$DB' already exists."
else
    psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE $DB;" &>/dev/null
    info "Database '$DB' created."
fi

# =============================================================================
#  STEP 7: Seed data
# =============================================================================
step "7/7" "Checking seed data"

cd "$DIR"

if [[ -f "$SEEDED" ]]; then
    SEED_TS=$(cat "$SEEDED")
    info "Data already seeded on: $SEED_TS"
    echo ""
    read -rp "  Re-seed? (adds more records) [y/N]: " RESEED
    if [[ "${RESEED,,}" != "y" ]]; then
        info "Keeping existing data."
    else
        echo "  Seeding... (this takes ~20 seconds)"
        node seed.mjs
    fi
else
    # Check products table directly
    PROD_CNT=$(psql -U postgres -h localhost -p 5432 -d "$DB" -t -c "SELECT COUNT(*) FROM products;" 2>/dev/null | tr -d ' ' || echo "0")

    if [[ "$PROD_CNT" =~ ^[0-9]+$ ]] && [[ "$PROD_CNT" -gt 0 ]]; then
        info "Found $PROD_CNT products in database."
        echo ""
        read -rp "  Re-seed? [y/N]: " RESEED
        if [[ "${RESEED,,}" == "y" ]]; then
            echo "  Seeding..."
            node seed.mjs
        else
            info "Keeping existing data."
        fi
    else
        echo "  Database is empty."
        echo ""
        read -rp "  Seed 10,000 grocery products + 4 user accounts? [Y/n]: " DO_SEED
        if [[ "${DO_SEED,,}" == "n" ]]; then
            info "Skipping. Run ./seed.sh any time to add sample data."
        else
            echo "  Seeding... (this takes ~20 seconds)"
            node seed.mjs
            info "Seed complete."
        fi
    fi
fi

# =============================================================================
#  Launch
# =============================================================================
echo ""
echo "  +====================================================+"
echo "  |  All set! Starting Moonlight WMS...               |"
echo "  |  Open http://localhost:5173 in your browser       |"
echo "  +====================================================+"
echo ""

cd "$DIR"
npm run dev:full
