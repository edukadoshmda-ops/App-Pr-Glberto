require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log('Users error:', error);
  console.log('Users data:', data);

  const { data: d2, error: e2 } = await supabase.from('profiles').select('*').limit(1);
  console.log('Profiles error:', e2);
  console.log('Profiles data:', d2);
}

run();
