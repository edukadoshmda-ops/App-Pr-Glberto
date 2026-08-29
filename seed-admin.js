require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const email = 'gilbertbertho@gmail.com';
  
  // Verifica se já existe
  const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
  
  const adminUser = {
    id: existingUser ? existingUser.id : uuidv4(),
    name: 'Pr. Gilberto Penido Bertho',
    email: email,
    phone: '(32) 99103-5632',
    password: '123456',
    status: 'approved',
    subscriptionType: 'monthly',
    role: 'admin',
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('users').upsert(adminUser);
  
  if (error) {
    console.error('❌ Erro na tabela users:', error.message);
  } else {
    console.log('✅ Admin inserido/atualizado na tabela "users"');
  }
}
run();
