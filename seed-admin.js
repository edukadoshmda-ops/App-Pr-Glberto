require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log('🔄 Iniciando criação/atualização do administrador...');

  const adminUser = {
    id: 'admin-gilbert-001',
    fullName: 'Pr. Gilberto Penido Bertho',
    email: 'gilbertbertho@gmail.com',
    phone: '(32) 99103-5632',
    password: '123456', // Idealmente usar hash se utilizar Supabase Auth
    status: 'approved',
    subscriptionType: 'monthly',
    paidAmount: 19.90,
    expiresAt: '2030-12-31T23:59:59Z',
    trialStartedAt: new Date().toISOString(),
    trialDays: 7,
    lastPaymentDate: new Date().toISOString(),
    isAdmin: true,
    createdAt: new Date().toISOString()
  };

  try {
    // Para tabela "users" que o server.js atual usa (caso a migração não esteja completa)
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .upsert(adminUser, { onConflict: 'email' })
      .select();

    if (usersError) {
        if (usersError.code === '42P01') {
            console.log('⚠️ Tabela "users" não existe, pulando...');
        } else {
            console.error('❌ Erro na tabela users:', usersError.message);
        }
    } else {
        console.log('✅ Admin inserido/atualizado na tabela "users"');
    }

    console.log('🎉 Finalizado.');
  } catch (err) {
    console.error('❌ Erro inesperado:', err.message);
  }
}

run();
