#!/bin/bash
set -e

# Create Supabase project
PROJECT_NAME="agent-chat-system-$(date +%Y%m%d%H%M%S)"

# Prompt for organization
echo "Select your Supabase organization:"
supabase orgs list

read -p "Enter Organization ID: " ORG_ID

# Create project
supabase projects create "$PROJECT_NAME" --org-id "$ORG_ID"

# Get project details
PROJECT_REF=$(supabase projects list | grep "$PROJECT_NAME" | awk '{print $2}')

# Generate secure database password
DB_PASSWORD=$(openssl rand -base64 16)

# Update database password
supabase projects update-db-password "$PROJECT_REF" --password "$DB_PASSWORD"

# Get API keys
ANON_KEY=$(supabase projects api-keys get "$PROJECT_REF" --type anon)
SERVICE_ROLE_KEY=$(supabase projects api-keys get "$PROJECT_REF" --type service_role)

# Create .env file
cat > .env.local << EOL
NEXT_PUBLIC_SUPABASE_URL=https://${PROJECT_REF}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres"

# Agent Chat Configuration
NEXT_PUBLIC_AGENT_CHAT_ENABLED=true
AGENT_CHAT_DEFAULT_ADMIN_EMAIL=aegis@davidfrench.io

# Logging and Monitoring
AGENT_CHAT_LOG_LEVEL=info
AGENT_CHAT_MAX_HISTORY_DAYS=30
EOL

# Link project
supabase link --project-ref "$PROJECT_REF"

# Apply schema
supabase db push

echo "🎉 Agent Chat System Setup Complete!"
echo "Project Reference: $PROJECT_REF"
echo "Database Password: $DB_PASSWORD"
echo "Anon Key: $ANON_KEY"