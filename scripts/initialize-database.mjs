import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const AGENTS = [
  {
    name: 'Aegis',
    description: 'Strategic Life Operator',
    status: 'active',
    metadata: {
      primary_projects: ['NPE', 'MechaSurvive'],
      core_responsibilities: ['Strategic Planning', 'System Coordination']
    }
  },
  {
    name: 'LeadBot',
    description: 'Lead Management AI',
    status: 'active',
    metadata: {
      primary_projects: ['NPE'],
      core_responsibilities: ['Lead Qualification', 'Conversion Optimization']
    }
  },
  {
    name: 'AppointmentManager',
    description: 'Consultation Scheduling System',
    status: 'active',
    metadata: {
      primary_projects: ['NPE'],
      core_responsibilities: ['Scheduling', 'Reminder Management']
    }
  }
];

const CHAT_ROOMS = [
  {
    name: 'NPE Operations',
    description: 'Neuropathy Profit Engine Agent Coordination',
    primary_agents: ['Aegis', 'LeadBot', 'AppointmentManager']
  },
  {
    name: 'MechaSurvive Dev',
    description: 'Creative Project Agent Coordination',
    primary_agents: ['Aegis']
  },
  {
    name: 'System Diagnostics',
    description: 'System-Wide Monitoring and Alerts',
    primary_agents: ['Aegis']
  },
  {
    name: 'Global Coordination',
    description: 'Cross-Project Agent Communication',
    primary_agents: ['Aegis', 'LeadBot']
  }
];

async function initializeDatabase() {
  console.log('🚀 Initializing Agent Chat Database');

  // Insert Agents
  for (const agent of AGENTS) {
    const { data, error } = await supabase
      .from('agent_registry')
      .upsert(agent, { onConflict: 'name' })
      .select();

    if (error) {
      console.error(`Error inserting agent ${agent.name}:`, error);
    } else {
      console.log(`✅ Agent ${agent.name} initialized`);
    }
  }

  // Insert Chat Rooms
  for (const room of CHAT_ROOMS) {
    const { data, error } = await supabase
      .from('agent_chat_rooms')
      .upsert(room, { onConflict: 'name' })
      .select();

    if (error) {
      console.error(`Error creating room ${room.name}:`, error);
    } else {
      console.log(`✅ Chat Room ${room.name} created`);
    }
  }

  console.log('🎉 Database Initialization Complete!');
}

initializeDatabase().catch(console.error);