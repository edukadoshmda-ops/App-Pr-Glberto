const fs = require('fs');

let c = fs.readFileSync('server.js', 'utf8');

c = c.replace(/fs\.mkdirSync\(([^)]+)\);/g, "try { fs.mkdirSync($1); } catch(e) { console.warn('Vercel Read-Only File System ignorado para fs.mkdirSync'); }");

// And also fix Supabase just in case to provide a better error
c = c.replace(/const supabase = createClient\(process\.env\.SUPABASE_URL, process\.env\.SUPABASE_ANON_KEY\);/g, "let supabase = null; try { supabase = createClient(process.env.SUPABASE_URL || 'a', process.env.SUPABASE_ANON_KEY || 'a'); } catch(e) { console.error('SUPABASE INIT ERROR:', e.message); }");

fs.writeFileSync('server.js', c);
console.log('fs.mkdirSync replaced in server.js');
