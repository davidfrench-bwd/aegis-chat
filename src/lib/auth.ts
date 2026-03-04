import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Agent Credentials',
      credentials: {
        agentName: { label: "Agent Name", type: "text" },
        apiKey: { label: "API Key", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Verify agent exists and is active
        const { data, error } = await supabase
          .from('agent_registry')
          .select('*')
          .eq('name', credentials.agentName)
          .eq('status', 'active')
          .single();

        if (error || !data) return null;

        return {
          id: data.id,
          name: data.name
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
} satisfies NextAuthConfig;