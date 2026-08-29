const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) { console.error('Fetch error:', error); return; }
    
    // Modify a user
    data[0].status = data[0].status === 'pending' ? 'approved' : 'pending';
    
    const { error: upsertError } = await supabase.from('users').upsert(data, { onConflict: 'id' });
    if (upsertError) {
        console.error('Upsert error:', upsertError);
    } else {
        console.log('Upsert success!');
    }
}
test();
