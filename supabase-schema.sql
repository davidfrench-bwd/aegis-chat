-- Agent Registry Table
CREATE TABLE agent_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT CHECK (status IN ('active', 'inactive', 'maintenance')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Chat Rooms Table
CREATE TABLE agent_chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    primary_agents TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Chat Messages Table
CREATE TABLE agent_chat_messages (
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

-- Create RLS Policies for Enhanced Security

-- Agent Registry Policies
ALTER TABLE agent_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can be read by admins" 
ON agent_registry FOR SELECT 
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Chat Rooms Policies
ALTER TABLE agent_chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms visible to admins" 
ON agent_chat_rooms FOR SELECT 
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Chat Messages Policies
ALTER TABLE agent_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages readable by room members" 
ON agent_chat_messages FOR SELECT 
USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    OR 
    sender_agent IN (
        SELECT name FROM agent_registry 
        WHERE metadata->>'allowed_users' ? auth.uid()::text
    )
);

CREATE POLICY "Agents can insert messages" 
ON agent_chat_messages FOR INSERT 
WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    OR 
    sender_agent IN (
        SELECT name FROM agent_registry 
        WHERE metadata->>'allowed_users' ? auth.uid()::text
    )
);

-- Predefined Agent Rooms
INSERT INTO agent_chat_rooms (name, description, primary_agents)
VALUES 
    ('NPE Operations', 'Neuropathy Profit Engine Agent Coordination', 
     ARRAY['Aegis', 'LeadBot', 'AppointmentManager']),
    ('MechaSurvive Dev', 'Creative Project Agent Coordination', 
     ARRAY['Aegis', 'CreativeDirector', 'ProjectManager']),
    ('System Diagnostics', 'System-Wide Monitoring and Alerts', 
     ARRAY['Aegis', 'SystemMonitor', 'ErrorHandler']),
    ('Global Coordination', 'Cross-Project Agent Communication', 
     ARRAY['Aegis', 'LeadBot', 'SystemMonitor', 'CreativeDirector']);

-- Predefined Agents
INSERT INTO agent_registry (name, description, status, metadata)
VALUES 
    ('Aegis', 'Strategic Life Operator', 'active', 
     '{"primary_projects": ["NPE", "MechaSurvive"], "core_responsibilities": ["Strategic Planning", "System Coordination"]}'::JSONB),
    ('LeadBot', 'Lead Management AI', 'active', 
     '{"primary_projects": ["NPE"], "core_responsibilities": ["Lead Qualification", "Conversion Optimization"]}'::JSONB),
    ('AppointmentManager', 'Consultation Scheduling System', 'active',
     '{"primary_projects": ["NPE"], "core_responsibilities": ["Scheduling", "Reminder Management"]}'::JSONB),
    ('CreativeDirector', 'MechaSurvive Creative Coordinator', 'active',
     '{"primary_projects": ["MechaSurvive"], "core_responsibilities": ["Creative Strategy", "Project Ideation"]}'::JSONB),
    ('ProjectManager', 'Cross-Project Coordination', 'active',
     '{"primary_projects": ["NPE", "MechaSurvive"], "core_responsibilities": ["Project Tracking", "Resource Allocation"]}'::JSONB),
    ('SystemMonitor', 'Infrastructure Monitoring', 'active',
     '{"primary_projects": ["Infrastructure"], "core_responsibilities": ["System Health Tracking", "Performance Metrics"]}'::JSONB),
    ('ErrorHandler', 'Automated Error Detection', 'active',
     '{"primary_projects": ["Infrastructure"], "core_responsibilities": ["Error Logging", "Diagnostic Reporting"]}');