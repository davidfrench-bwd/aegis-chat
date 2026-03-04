import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check Supabase connection
    const { data, error, count } = await supabase
      .from('agent_registry')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error('Supabase connection failed');
    }

    // Basic system health check
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      supabaseConnected: true,
      registeredAgents: count || 0
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}