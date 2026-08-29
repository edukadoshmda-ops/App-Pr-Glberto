require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

supabase.from('users').upsert(admin, { onConflict: 'email' }).select()
  .then(({ data, error }) => {
    if (error) console.error('❌ Erro:', error.message, error);
    else console.log('✅ Admin criado/atualizado:', data);
  });