import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Call a Supabase RPC (Remote Procedure Call) function
 * @param {string} functionName - The name of the RPC function
 * @param {object} params - Parameters to pass to the function
 * @returns {Promise} - The data returned from the RPC function
 */
export async function callSupabaseRPC(functionName, params = {}) {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    throw error;
  }
}
