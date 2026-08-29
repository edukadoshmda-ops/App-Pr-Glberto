require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  // 1. Criar tabela via RPC (SQL direto)
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS public.users (
      id text PRIMARY KEY,
      full_name text NOT NULL,
      email text UNIQUE NOT NULL,
      phone text,
      password text NOT NULL,
      status text DEFAULT 'pending',
      subscription_type text DEFAULT 'trial',
      paid_amount numeric DEFAULT 19.90,
      expires_at timestamptz,
      trial_started_at timestamptz,
      trial_days int4 DEFAULT 7,
      last_payment_date timestamptz,
      is_admin boolean DEFAULT false,
      created_at timestamptz DEFAULT now()
    );
  `;

  console.log('📦 Criando tabela users...');
  const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
  if (tableError && !tableError.message.includes('already exists')) {
    console.error('❌ Erro tabela:', tableError.message);
  } else {
    console.log('✅ Tabela users OK');
  }

  // 2. Inserir admin
  const admin = {
    id: 'admin-gilbert-001',
    full_name: 'Pr. Gilberto Penido Bertho',
    email: 'gilbertbertho@gmail.com',
    phone: '(32) 99103-5632',
    password: '123456',
    status: 'approved',
    subscription_type: 'monthly',
    paid_amount: 19.90,
    expires_at: '2027-08-28T00:00:00Z',
    trial_started_at: '2026-08-28T00:00:00Z',
    trial_days: 7,
    last_payment_date: '2026-08-28T00:00:00Z',
    is_admin: true,
    created_at: '2026-08-28T00:00:00Z'
  };

  console.log('👤 Criando admin...');
  const { data, error } = await supabase.from('users').upsert(admin, { onConflict: 'email' }).select();
  if (error) console.error('❌ Erro admin:', error.message, error);
  else console.log('✅ Admin criado:', data);
}

run();