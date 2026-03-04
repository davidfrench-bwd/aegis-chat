import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../lib/supabase';

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  max: 100 // 100 requests per minute
};

export async function rateLimiter(
  req: NextApiRequest, 
  res: NextApiResponse, 
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const key = `rate_limit:${ip}`;

  try {
    const { data, error } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') {  // Not found error
      console.error('Rate limit check error:', error);
      return false;
    }

    const now = Date.now();
    const windowStart = now - config.windowMs;

    if (data) {
      const recentRequests = data.requests.filter(
        (timestamp: number) => timestamp > windowStart
      );

      if (recentRequests.length >= config.max) {
        res.status(429).json({ 
          error: 'Too Many Requests', 
          retryAfter: config.windowMs / 1000 
        });
        return false;
      }

      // Update requests
      await supabase
        .from('rate_limits')
        .update({ 
          requests: [...recentRequests, now] 
        })
        .eq('key', key);
    } else {
      // Create new rate limit entry
      await supabase
        .from('rate_limits')
        .insert({ 
          key, 
          requests: [now] 
        });
    }

    return true;
  } catch (err) {
    console.error('Rate limit middleware error:', err);
    return false;
  }
}