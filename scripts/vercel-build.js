#!/usr/bin/env node

import { execSync } from 'child_process';

async function vercelBuild() {
  console.log('🚀 Starting Vercel Build Process');

  try {
    // Explicit dependency installation
    execSync('npm ci --prefer-offline --no-audit', { stdio: 'inherit' });

    // Run type checking
    execSync('npx tsc --noEmit', { stdio: 'inherit' });

    // Build the application
    execSync('next build', { stdio: 'inherit' });

    console.log('✅ Vercel Build Successful');
  } catch (error) {
    console.error('❌ Vercel Build Failed:', error);
    process.exit(1);
  }
}

vercelBuild();