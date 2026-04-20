#!/usr/bin/env bash
set -euo pipefail

echo ""
echo " ====================================================="
echo "  Moonlight WMS — Database Seeder"
echo "  Inserts 10,000 grocery products + 4 user accounts"
echo " ====================================================="
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
  echo " ERROR: Node.js is not installed or not in PATH."
  echo " Install via: https://nodejs.org/ or your package manager."
  exit 1
fi

# Install pg if missing
if [ ! -d "node_modules/pg" ]; then
  echo " Installing pg package..."
  npm install pg
  echo ""
fi

# Run the seed script
node seed.mjs

echo ""
