import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { minAge2, maxAge2, sex2 } = req.body;

    if (!minAge2 || !maxAge2 || !sex2) {
      return res.status(400).json({ 
        error: 'All parameters (minAge2, maxAge2, sex2) are required' 
      });
    }

    // Query: Top mortality causes by age and sex
    const { data, error } = await supabase.rpc('mortality_query_2', {
      min_age: parseFloat(minAge2),
      max_age: parseFloat(maxAge2),
      sex_param: sex2
    });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database query failed', details: error.message });
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
