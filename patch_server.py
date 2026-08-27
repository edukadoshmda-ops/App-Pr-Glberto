import sys

with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = "app.get('/api/users', requireApiKey, (req, res) => {"
replacement = """app.post('/api/users', (req, res) => {
    try {
        const users = getUsers();
        const existing = users.find(u => u.email === req.body.email);
        if (!existing) {
            const newUser = {
                id: req.body.id || Date.now().toString(),
                fullName: req.body.fullName,
                email: req.body.email,
                phone: req.body.phone,
                status: 'pending',
                isAdmin: false,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            saveUsers(users);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar usuario' });
    }
});

app.get('/api/users', requireApiKey, (req, res) => {"""

if target in content:
    content = content.replace(target, replacement)
    with open('server.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found")
