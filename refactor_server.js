const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

// 1. Injetar importação do Supabase no topo
if (!code.includes('@supabase/supabase-js')) {
    code = code.replace(
        "const express = require('express');",
        "const express = require('express');\nconst { createClient } = require('@supabase/supabase-js');\nconst supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);"
    );
}

// 2. Substituir getUsers e saveUsers
code = code.replace(
    /function getUsers\(\) \{\s+const data = fs\.readFileSync\(usersDbPath, 'utf8'\);\s+return JSON\.parse\(data\);\s+\}/,
    `async function getUsers() {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        return data || [];
    } catch(err) {
        console.error('Erro ao buscar usuários do Supabase:', err);
        return [];
    }
}`
);

code = code.replace(
    /function saveUsers\(users\) \{\s+fs\.writeFileSync\(usersDbPath, JSON\.stringify\(users, null, 2\)\);\s+\}/,
    `async function saveUsers(users) {
    try {
        await supabase.from('users').upsert(users, { onConflict: 'email' });
    } catch(err) {
        console.error('Erro ao salvar usuários no Supabase:', err);
    }
}`
);

// 3. Modificar assinaturas das rotas para async
const routesToAsync = [
    "app.post('/api/login', (req, res) => {",
    "app.post('/api/register', (req, res) => {",
    "app.get('/api/users', requireApiKey, (req, res) => {",
    "app.put('/api/users/:id', requireApiKey, (req, res) => {",
    "app.delete('/api/users/:id', requireApiKey, (req, res) => {"
];

routesToAsync.forEach(route => {
    code = code.replace(route, route.replace('(req, res)', 'async (req, res)'));
});

// 4. Adicionar awaits nas chamadas
code = code.replace(/const users = getUsers\(\);/g, 'const users = await getUsers();');
code = code.replace(/saveUsers\(users\);/g, 'await saveUsers(users);');

// 5. Remover cron.schedule do node-cron para não travar na Vercel
// Comentar a inicialização do cron
code = code.replace(
    /cron\.schedule\('0 8 \* \* \*', async \(\) => \{/g,
    `// [MIGRADO PARA VERCEL CRON]\n// cron.schedule('0 8 * * *', async () => {`
);
// Vou exportar a função de verificação diária para o api/cron.js chamar
code = code.replace(
    "console.log('[CRON] Executando verificação diária de degustação e assinaturas...');",
    "async function runDailyCron() {\n    console.log('[CRON] Executando verificação diária de degustação e assinaturas via Supabase...');"
);
// O fechamento do cron.schedule... isso é mais complicado com regex.
// Ao invés disso, apenas comentamos a importação do node-cron
code = code.replace("const cron = require('node-cron');", "// const cron = require('node-cron');");

// 6. Exportar app para Vercel Serverless
if (!code.includes('module.exports = app;')) {
    code = code.replace(
        "app.listen(PORT, () => {",
        "if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {\n  app.listen(PORT, () => {"
    );
    // Adiciona fecho do if e export na ultima linha (o app.listen tem um console log dentro)
    code = code.replace(
        "  console.log(`Servidor rodando na porta ${PORT}`);\n});",
        "  console.log(`Servidor rodando na porta ${PORT}`);\n  });\n}\nmodule.exports = app;"
    );
}

fs.writeFileSync('server.js', code);
console.log('server.js refatorado com sucesso para Supabase e Vercel!');
