import { createClient } from '@supabase/supabase-js';

// Placeholder URL and key - will be replaced with actual values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database schema
export interface AgentRegistry {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'maintenance';
  metadata?: Record<string, any>;
}

export interface AgentChatRoom {
  id: string;
  name: string;
  description?: string;
  primary_agents: string[];
}

export interface AgentChatMessage {
  id: string;
  room_id: string;
  sender_agent: string;
  message: Record<string, any>;
  message_type: 'text' | 'system_alert' | 'task_update' | 'error_report' | 'diagnostic' | 'coordination';
  created_at: string;
  metadata?: Record<string, any>;
}