const fs = require('fs');

let c = fs.readFileSync('server.js', 'utf8');

c = c.replace(/fs\.writeFileSync\(([^)]+)\);/g, "try { fs.writeFileSync($1); } catch(e) { console.warn('Vercel Read-Only File System ignorado para fs.writeFileSync'); }");

fs.writeFileSync('server.js', c);
console.log('fs.writeFileSync replaced in server.js');
