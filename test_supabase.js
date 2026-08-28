require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkTable() {
    console.log("Checking if 'users' table exists...");
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
        console.error("Error or table doesn't exist:", error.message);
    } else {
        console.log("Table 'users' exists! Data:", data);
    }
}

checkTable();
