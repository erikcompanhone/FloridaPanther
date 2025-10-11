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
    const { minAge1, maxAge1, sex1, minYear1, maxYear1 } = req.body;

    if (!minAge1 || !maxAge1 || !sex1 || !minYear1 || !maxYear1) {
      return res.status(400).json({ 
        error: 'All parameters (minAge1, maxAge1, sex1, minYear1, maxYear1) are required' 
      });
    }

    // Query: Mortality heatmap by age, sex, and year range
    const { data, error } = await supabase.rpc('mortality_query_1', {
      min_age: parseFloat(minAge1),
      max_age: parseFloat(maxAge1),
      sex_param: sex1,
      min_year: parseInt(minYear1),
      max_year: parseInt(maxYear1)
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
