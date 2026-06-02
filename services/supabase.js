/**
 * services/supabase.js
 * Supabase client — ใช้ SERVICE ROLE KEY (server-side เท่านั้น)
 */
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] SUPABASE_URL or SUPABASE_SERVICE_KEY not set — DB calls will fail');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

module.exports = supabase;
