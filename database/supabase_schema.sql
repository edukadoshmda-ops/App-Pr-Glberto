-- ==============================================================================
-- APP GILBERTO / ELITEFLOW - SCRIPT COMPLETO DE BANCO DE DADOS SUPABASE (IDEMPOTENTE)
-- Data de Atualização: 2026-08-17
-- Descrição: Tabelas, RLS, Triggers, Storage Buckets e Seed Data compatível com Supabase SQL Editor.
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABELAS DO SISTEMA
-- ==============================================================================

-- 2.1 PROFILES (Perfis de Usuários conectados com auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 VIDEOS (Gestão e Exibição de Vídeos/Aulas)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Geral',
    author TEXT DEFAULT 'Pr. Gilberto Penido Bertho',
    description TEXT,
    youtube_url TEXT,
    video_url TEXT,
    cover_url TEXT,
    duration TEXT DEFAULT '00:00',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 ARTICLES (Artigos e Estudos em PDF)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Teologia',
    author TEXT DEFAULT 'Pr. Gilberto Penido Bertho',
    description TEXT,
    content TEXT,
    image_url TEXT,
    pdf_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 PROJECTS (Projetos Ministeriais e Sociais)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Projetos',
    external_link TEXT,
    file_url TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'em_andamento', 'concluido', 'inativo')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 AUDIOBOOKS (Livros em Áudio e Pregações)
CREATE TABLE IF NOT EXISTS public.audiobooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT DEFAULT 'Pr. Gilberto Penido Bertho',
    narrator TEXT,
    description TEXT,
    cover_url TEXT,
    audio_url TEXT NOT NULL,
    duration TEXT,
    category TEXT DEFAULT 'Audiobook',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.6 PLAYBOOKS (Biblioteca de E-books / PDFs Interativos)
CREATE TABLE IF NOT EXISTS public.playbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT DEFAULT 'Pr. Gilberto Penido Bertho',
    description TEXT,
    cover_url TEXT,
    pdf_url TEXT NOT NULL,
    total_pages INTEGER DEFAULT 0,
    category TEXT DEFAULT 'Playbook',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.7 REPORTS (Relatórios Pastorais e Estatísticas de Batismo/Conversão)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    pastor_name TEXT NOT NULL,
    church_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    conversion_count INTEGER NOT NULL DEFAULT 0,
    baptism_count INTEGER NOT NULL DEFAULT 0,
    details JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.8 PURCHASES / TRANSACTIONS (Vendas e Assinaturas da Plataforma)
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    product_name TEXT NOT NULL DEFAULT 'Acesso Plataforma Premium',
    amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('pix', 'credit_card', 'boleto')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'cancelled', 'refunded')),
    transaction_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. TRIGGERS E FUNÇÕES AUTOMÁTICAS
-- ==============================================================================

-- 3.1 Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de atualização automática de data
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_videos_updated_at ON public.videos;
CREATE TRIGGER tr_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_articles_updated_at ON public.articles;
CREATE TRIGGER tr_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_projects_updated_at ON public.projects;
CREATE TRIGGER tr_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_audiobooks_updated_at ON public.audiobooks;
CREATE TRIGGER tr_audiobooks_updated_at BEFORE UPDATE ON public.audiobooks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_playbooks_updated_at ON public.playbooks;
CREATE TRIGGER tr_playbooks_updated_at BEFORE UPDATE ON public.playbooks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_reports_updated_at ON public.reports;
CREATE TRIGGER tr_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_purchases_updated_at ON public.purchases;
CREATE TRIGGER tr_purchases_updated_at BEFORE UPDATE ON public.purchases FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3.2 Trigger para criar Profile automaticamente após cadastro em auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, email, status, is_admin)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Usuário'),
        NEW.raw_user_meta_data->>'phone',
        NEW.email,
        CASE WHEN NEW.email IN ('gilbertobertho@gmail.com', 'gilbertbertho@gmail.com') THEN 'approved' ELSE 'pending' END,
        CASE WHEN NEW.email IN ('gilbertobertho@gmail.com', 'gilbertbertho@gmail.com') THEN TRUE ELSE FALSE END
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ativar trigger em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 4. FUNÇÕES DE SEGURANÇA E POLÍTICAS DE ACESSO (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

-- 4.0 Função segura para checagem de administrador (evita recursão infinita no RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_admin = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audiobooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- 4.1 POLÍTICAS PARA PROFILES
DROP POLICY IF EXISTS "Perfis leitura pública ou autenticada" ON public.profiles;
DROP POLICY IF EXISTS "Usuários atualizam o próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins gerenciam perfis" ON public.profiles;

CREATE POLICY "Perfis leitura pública ou autenticada" ON public.profiles 
FOR SELECT USING (true);

CREATE POLICY "Usuários atualizam o próprio perfil" ON public.profiles 
FOR UPDATE USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins gerenciam perfis" ON public.profiles 
FOR ALL USING (public.is_admin());

-- 4.2 POLÍTICAS PARA VÍDEOS
DROP POLICY IF EXISTS "Leitura de vídeos pública ou aprovada" ON public.videos;
DROP POLICY IF EXISTS "Gerenciamento de vídeos apenas por admins" ON public.videos;

CREATE POLICY "Leitura de vídeos pública ou aprovada" ON public.videos 
FOR SELECT USING (true);

CREATE POLICY "Gerenciamento de vídeos apenas por admins" ON public.videos 
FOR ALL USING (public.is_admin());

-- 4.3 POLÍTICAS PARA ARTIGOS
DROP POLICY IF EXISTS "Leitura de artigos pública" ON public.articles;
DROP POLICY IF EXISTS "Gerenciamento de artigos apenas por admins" ON public.articles;

CREATE POLICY "Leitura de artigos pública" ON public.articles 
FOR SELECT USING (true);

CREATE POLICY "Gerenciamento de artigos apenas por admins" ON public.articles 
FOR ALL USING (public.is_admin());

-- 4.4 POLÍTICAS PARA PROJETOS
DROP POLICY IF EXISTS "Leitura de projetos pública" ON public.projects;
DROP POLICY IF EXISTS "Gerenciamento de projetos apenas por admins" ON public.projects;

CREATE POLICY "Leitura de projetos pública" ON public.projects 
FOR SELECT USING (true);

CREATE POLICY "Gerenciamento de projetos apenas por admins" ON public.projects 
FOR ALL USING (public.is_admin());

-- 4.5 POLÍTICAS PARA AUDIOBOOKS
DROP POLICY IF EXISTS "Leitura de audiobooks pública" ON public.audiobooks;
DROP POLICY IF EXISTS "Gerenciamento de audiobooks apenas por admins" ON public.audiobooks;

CREATE POLICY "Leitura de audiobooks pública" ON public.audiobooks 
FOR SELECT USING (true);

CREATE POLICY "Gerenciamento de audiobooks apenas por admins" ON public.audiobooks 
FOR ALL USING (public.is_admin());

-- 4.6 POLÍTICAS PARA PLAYBOOKS
DROP POLICY IF EXISTS "Leitura de playbooks pública" ON public.playbooks;
DROP POLICY IF EXISTS "Gerenciamento de playbooks apenas por admins" ON public.playbooks;

CREATE POLICY "Leitura de playbooks pública" ON public.playbooks 
FOR SELECT USING (true);

CREATE POLICY "Gerenciamento de playbooks apenas por admins" ON public.playbooks 
FOR ALL USING (public.is_admin());

-- 4.7 POLÍTICAS PARA RELATÓRIOS (REPORTS)
DROP POLICY IF EXISTS "Criadores e Admins veem relatórios" ON public.reports;
DROP POLICY IF EXISTS "Criadores e Admins criam relatórios" ON public.reports;
DROP POLICY IF EXISTS "Admins gerenciam todos os relatórios" ON public.reports;

CREATE POLICY "Criadores e Admins veem relatórios" ON public.reports 
FOR SELECT USING (auth.uid() = created_by OR public.is_admin());

CREATE POLICY "Criadores e Admins criam relatórios" ON public.reports 
FOR INSERT WITH CHECK (auth.uid() = created_by OR public.is_admin());

CREATE POLICY "Admins gerenciam todos os relatórios" ON public.reports 
FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 5. BUCKETS DE STORAGE SUPABASE (UPLOADS DE MÍDIAS E DOCUMENTOS)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('covers', 'covers', true),
    ('videos', 'videos', true),
    ('articles', 'articles', true),
    ('projects', 'projects', true),
    ('audiobooks', 'audiobooks', true),
    ('playbooks', 'playbooks', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso público para leitura de arquivos no Storage
DROP POLICY IF EXISTS "Acesso público de leitura no storage covers" ON storage.objects;
CREATE POLICY "Acesso público de leitura no storage covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');

DROP POLICY IF EXISTS "Acesso público de leitura no storage videos" ON storage.objects;
CREATE POLICY "Acesso público de leitura no storage videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Acesso público de leitura no storage articles" ON storage.objects;
CREATE POLICY "Acesso público de leitura no storage articles" ON storage.objects FOR SELECT USING (bucket_id = 'articles');

DROP POLICY IF EXISTS "Acesso público de leitura no storage projects" ON storage.objects;
CREATE POLICY "Acesso público de leitura no storage projects" ON storage.objects FOR SELECT USING (bucket_id = 'projects');

DROP POLICY IF EXISTS "Acesso público de leitura no storage audiobooks" ON storage.objects;
CREATE POLICY "Acesso público de leitura no storage audiobooks" ON storage.objects FOR SELECT USING (bucket_id = 'audiobooks');

DROP POLICY IF EXISTS "Acesso público de leitura no storage playbooks" ON storage.objects;
CREATE POLICY "Acesso público de leitura no storage playbooks" ON storage.objects FOR SELECT USING (bucket_id = 'playbooks');

-- Upload permitido para usuários autenticados/admins
DROP POLICY IF EXISTS "Upload de mídia por admins e usuários" ON storage.objects;
CREATE POLICY "Upload de mídia por admins e usuários" ON storage.objects FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
);

-- ==============================================================================
-- 6. DADOS INICIAIS (SEED DATA)
-- ==============================================================================

-- Inserir Playbooks padrão do app usando UUIDs fixos e ON CONFLICT (id) DO NOTHING
INSERT INTO public.playbooks (id, title, author, description, pdf_url, category, featured)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Transformando Hábitos', 'Pr. Gilberto Penido Bertho', 'Guia prático para transformação de vida e hábitos espirituais.', 'assets/playbooks/transformando-habitos.pdf', 'Discipulado', true),
    ('22222222-2222-2222-2222-222222222222', 'Jonas 3 Inconformado', 'Pr. Gilberto Penido Bertho', 'Estudo profundo sobre arrependimento e o chamado de Deus.', 'assets/playbooks/jonas-3-inconformdo.pdf', 'Teologia', true),
    ('33333333-3333-3333-3333-333333333333', 'Os 5 Níveis da Liderança Cristã', 'Pr. Gilberto Penido Bertho', 'Princípios de liderança baseados nos ensinamentos de Jesus.', 'assets/playbooks/os-5-niveis-da-lideranca-crista.pdf', 'Liderança', true),
    ('44444444-4444-4444-4444-444444444444', 'Eu Sou', 'Pr. Gilberto Penido Bertho', 'Descobrindo a identidade e propósito em Cristo.', 'assets/playbooks/eu-sou.pdf', 'Vida Cristã', true),
    ('55555555-5555-5555-5555-555555555555', 'O Discipulado na Prática', 'Pr. Gilberto Penido Bertho', 'Manual completo para formação de novos discípulos.', 'assets/playbooks/O Discipulado Pratico CBM.pdf', 'Discipulado', true)
ON CONFLICT (id) DO NOTHING;
