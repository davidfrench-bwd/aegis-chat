# Agent Chat System Deployment Guide

## Prerequisites
- Node.js 18+
- Vercel Account
- Supabase Project
- GitHub Account

## Local Setup
1. Clone the repository
2. Run `npm install`
3. Copy `.env.local.example` to `.env.local`
4. Fill in Supabase credentials

## Deployment Environments
- Staging: Automatically deployed from `staging` branch
- Production: Automatically deployed from `main` branch

## Deployment Workflow
- Push to `staging` or `main` branch
- GitHub Actions runs:
  1. Linting
  2. Testing
  3. Vercel Deployment
  4. Health Check

## Required Secrets
- `VERCEL_TOKEN`: Vercel deployment token
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anon key

## Manual Deployment
```bash
# Deploy to staging
./deploy.sh staging

# Deploy to production
./deploy.sh production
```

## Monitoring
- Health check endpoint: `/api/health`
- Logs available in Vercel dashboard
- Supabase monitoring for database performance

## Security Considerations
- Rate limiting implemented
- Row Level Security in Supabase
- Authentication required for all chat interactions