import { createClient } from '@supabase/supabase-js';
import { Auth } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authOptions = {
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

        // Additional API key validation would go here
        // For now, just check agent exists and is active
        return {
          id: data.id,
          name: data.name
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // Add agent details to session
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET
};