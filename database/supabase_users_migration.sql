-- Execute no SQL Editor do projeto Supabase que contém os cadastros.
-- Esta migração cria/atualiza apenas a estrutura; não apaga nem importa usuários.

CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT,
    full_name TEXT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    "subscriptionType" TEXT DEFAULT 'trial',
    subscription_type TEXT DEFAULT 'trial',
    "subscriptionExpires" TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 19.90,
    last_payment_date TIMESTAMPTZ,
    role TEXT NOT NULL DEFAULT 'user',
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "subscriptionType" TEXT DEFAULT 'trial';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS subscription_type TEXT DEFAULT 'trial';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "subscriptionExpires" TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(10, 2) DEFAULT 19.90;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
    UPDATE public.users
    SET
        full_name = COALESCE(full_name, name, split_part(email, '@', 1), 'Usuário'),
        name = COALESCE(name, full_name, split_part(email, '@', 1), 'Usuário'),
        subscription_type = COALESCE(subscription_type, "subscriptionType", 'trial'),
        "subscriptionType" = COALESCE("subscriptionType", subscription_type, 'trial'),
        expires_at = COALESCE(NULLIF(expires_at::TEXT, ''), NULLIF("subscriptionExpires"::TEXT, ''))::TIMESTAMPTZ,
        is_admin = COALESCE(is_admin, FALSE) OR COALESCE(role = 'admin', FALSE),
        role = CASE
            WHEN COALESCE(is_admin, FALSE) OR role = 'admin' THEN 'admin'
            ELSE COALESCE(role, 'user')
        END,
        status = COALESCE(status, 'pending'),
        paid_amount = COALESCE(paid_amount, 19.90),
        created_at = COALESCE(created_at, NOW());
END
$$;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.users FROM anon, authenticated;
GRANT ALL ON TABLE public.users TO service_role;

DO $$
BEGIN
    IF to_regclass('public.profiles') IS NOT NULL THEN
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        EXECUTE $ddl$
            CREATE OR REPLACE FUNCTION public.is_admin()
            RETURNS BOOLEAN AS $function$
                SELECT EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE id = auth.uid() AND is_admin = TRUE
                );
            $function$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
        $ddl$;

        DROP POLICY IF EXISTS "Perfis leitura pública ou autenticada" ON public.profiles;
        DROP POLICY IF EXISTS "Usuários leem perfis autorizados" ON public.profiles;

        CREATE POLICY "Usuários leem perfis autorizados" ON public.profiles
        FOR SELECT USING (auth.uid() = id OR public.is_admin());
    END IF;
END
$$;
