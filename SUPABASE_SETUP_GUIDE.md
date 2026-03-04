# Supabase Setup Guide for Agent Chat System

## Step 1: Create Tables

Go to your Supabase project SQL Editor and run this SQL:

```sql
-- Create agent_registry table
CREATE TABLE IF NOT EXISTS agent_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT CHECK (status IN ('active', 'inactive', 'maintenance')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_chat_rooms table
CREATE TABLE IF NOT EXISTS agent_chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    primary_agents TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_chat_messages table
CREATE TABLE IF NOT EXISTS agent_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES agent_chat_rooms(id),
    sender_agent TEXT NOT NULL,
    message JSONB NOT NULL,
    message_type TEXT CHECK (
        message_type IN (
            'text', 
            'system_alert', 
            'task_update', 
            'error_report', 
            'diagnostic', 
            'coordination'
        )
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE agent_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, refine later)
CREATE POLICY "Enable all operations for authenticated users" 
ON agent_registry FOR ALL 
USING (true);

CREATE POLICY "Enable all operations for authenticated users" 
ON agent_chat_rooms FOR ALL 
USING (true);

CREATE POLICY "Enable all operations for authenticated users" 
ON agent_chat_messages FOR ALL 
USING (true);
```

## Step 2: Run Initialization Script

After creating the tables, run:

```bash
npm run db:init
```

This will populate the initial agents and chat rooms.

## Step 3: Verify

Check in Supabase Table Editor that you have:
- 3 agents in `agent_registry`
- 4 rooms in `agent_chat_rooms`
- 0 messages in `agent_chat_messages` (will be populated when you start chatting)