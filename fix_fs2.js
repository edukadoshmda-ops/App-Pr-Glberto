const fs = require('fs');

let c = fs.readFileSync('server.js', 'utf8');

c = c.replace(/fs\.writeFileSync\(dbPath, JSON\.stringify\(\[\]\)\);/g, "try { fs.writeFileSync(dbPath, JSON.stringify([])); } catch(e) { }");
c = c.replace(/fs\.writeFileSync\(articlesDbPath, JSON\.stringify\(\[\]\)\);/g, "try { fs.writeFileSync(articlesDbPath, JSON.stringify([])); } catch(e) { }");
c = c.replace(/fs\.writeFileSync\(projectsDbPath, JSON\.stringify\(\[\]\)\);/g, "try { fs.writeFileSync(projectsDbPath, JSON.stringify([])); } catch(e) { }");
c = c.replace(/fs\.writeFileSync\(usersDbPath, JSON\.stringify\(\[\]\)\);/g, "try { fs.writeFileSync(usersDbPath, JSON.stringify([])); } catch(e) { }");
c = c.replace(/fs\.writeFileSync\(audiobooksDbPath, JSON\.stringify\(\[\]\)\);/g, "try { fs.writeFileSync(audiobooksDbPath, JSON.stringify([])); } catch(e) { }");
c = c.replace(/fs\.writeFileSync\(playbooksDbPath, JSON\.stringify\(\[\]\)\);/g, "try { fs.writeFileSync(playbooksDbPath, JSON.stringify([])); } catch(e) { }");

fs.writeFileSync('server.js', c);
console.log('Fixed fs.writeFileSync for Vercel');
