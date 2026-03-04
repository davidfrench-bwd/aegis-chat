#!/bin/bash
set -e

# Vercel Project Setup Script

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel
vercel login

# Create or link project
echo "Setting up Vercel project for Agent Chat System..."
vercel link --confirm

# Configure project settings
vercel config set \
    buildCommand="npm run build" \
    installCommand="npm install" \
    outputDirectory=".next" \
    framework="nextjs"

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production https://ldkajdjdryzulrwdiygs.supabase.co
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxka2FqZGpkcnl6dWxyd2RpeWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MzI4ODAsImV4cCI6MjA4ODIwODg4MH0.yuD9TDRflxQ2r8lJwRcwAsImskj-A1KaxNu9nf9TiHA
vercel env add SUPABASE_SERVICE_ROLE_KEY production eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxka2FqZGpkcnl6dWxyd2RpeWdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjYzMjg4MCwiZXhwIjoyMDg4MjA4ODgwfQ.2X33cDD4Gx5n_KLqIj7qoWaeYdGrxBUvoxKc5Iy1bGU
vercel env add NEXTAUTH_SECRET production VQ3N4dJdWY3qSHmIEjpFAk6QHVvXJ4iZhFv2zF/uQJU=
vercel env add NEXTAUTH_URL production https://chat.davidfrench.io

# Configure custom domain
vercel domains add chat.davidfrench.io

echo "✅ Vercel project setup complete!"
echo "Domain: https://chat.davidfrench.io"