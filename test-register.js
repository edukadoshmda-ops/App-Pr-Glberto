require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function getUsers() {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        
        return (data || []).map(u => ({
            id: u.id,
            fullName: u.name || u.fullName || 'Usuário',
            email: u.email,
            phone: u.phone,
            password: u.password,
            status: u.status || 'pending',
            subscriptionType: u.subscriptionType || 'trial',
            expiresAt: u.subscriptionExpires || u.expiresAt || null,
            isAdmin: u.role === 'admin' || u.isAdmin || false,
            paidAmount: u.paidAmount || 19.90,
            createdAt: u.created_at || new Date().toISOString()
        }));
    } catch(err) {
        console.error('Erro ao buscar usuários do Supabase:', err);
        return [];
    }
}

async function saveUsers(usersArray) {
    try {
        const dataToUpsert = usersArray.map(u => ({
            id: u.id,
            name: u.fullName,
            email: u.email,
            password: u.password || '123456',
            phone: u.phone,
            status: u.status,
            subscriptionType: u.subscriptionType,
            subscriptionExpires: u.expiresAt,
            role: u.isAdmin ? 'admin' : 'user'
        }));
        
        const { error } = await supabase.from('users').upsert(dataToUpsert, { onConflict: 'id' });
        if (error) {
            console.error('Supabase upsert error:', error);
            throw new Error(error.message);
        }
    } catch(err) {
        console.error('Erro ao salvar usuários no Supabase:', err);
        throw err;
    }
}

async function testRegister() {
    const users = await getUsers();
    
    const newUser = {
        id: crypto.randomUUID(),
        fullName: 'Teste Silva',
        phone: '11999999999',
        email: 'testeregister@teste.com',
        password: 'senha',
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    console.log('Tentando salvar', users.length, 'usuarios...');
    await saveUsers(users);
    console.log('Salvo com sucesso!');
}

testRegister().catch(console.error);
