require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrateUsers() {
    try {
        console.log("Lendo arquivo users.json local...");
        const usersData = fs.readFileSync('./database/users.json', 'utf8');
        const users = JSON.parse(usersData);
        
        if (users.length === 0) {
            console.log("Nenhum usuário no arquivo local. Pulando migração.");
            return;
        }

        console.log(`Encontrados ${users.length} usuários. Iniciando inserção no Supabase...`);

        const formattedUsers = users.map(user => {
            const data = {
                name: user.name || 'Usuário',
                email: user.email,
                password: user.password || '123456', // caso exista conta com senha vazia
                phone: user.phone || null,
                status: user.status || 'ativo',
                subscriptionType: user.subscriptionType || 'trial',
                trialExpires: user.trialExpires ? new Date(user.trialExpires).toISOString() : null,
                subscriptionExpires: user.subscriptionExpires ? new Date(user.subscriptionExpires).toISOString() : null,
                role: user.role || 'user'
            };
            
            if (user.id && user.id.length === 36) {
                data.id = user.id;
            }
            return data;
        });

        const { data, error } = await supabase.from('users').upsert(formattedUsers, { onConflict: 'email' });

        if (error) {
            console.error("Erro ao inserir dados no Supabase:", error);
        } else {
            console.log("Migração concluída com sucesso! Os usuários estão no Supabase.");
        }
    } catch (err) {
        console.error("Erro crítico na migração:", err.message);
    }
}

migrateUsers();
