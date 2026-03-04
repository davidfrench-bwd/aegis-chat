#!/bin/bash
set -e

echo "🔍 Vercel Deployment Diagnostic Script"

# Check Node.js and npm versions
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Verify package.json configuration
npm pkg get engines

# Clear npm cache
npm cache clean --force

# Reinstall dependencies with exact versions
rm -rf node_modules
rm package-lock.json
npm install --legacy-peer-deps

# Run lint to catch potential issues
npm run lint

# Build diagnostics
echo "🏗️ Running build diagnostics..."
npm run build

echo "✅ Deployment diagnostic complete"