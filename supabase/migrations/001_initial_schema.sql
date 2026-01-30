-- ============================================================
-- Marina Boat App - Schema Inicial
-- ============================================================
-- Execute este script no Supabase SQL Editor
-- Após executar, use: supabase db pull (para gerar migrações locais)
-- ============================================================

-- ============================================================
-- 1. TABELA: profiles
-- Armazena dados adicionais dos usuários (vinculado ao auth.users)
-- ============================================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'owner')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.profiles IS 'Perfis de usuários vinculados ao Supabase Auth';
COMMENT ON COLUMN public.profiles.role IS 'Papel do usuário: user (cliente), admin (administrador), owner (proprietário de barco)';

-- ============================================================
-- 2. TABELA: boats
-- Cadastro de embarcações disponíveis para reserva
-- ============================================================

CREATE TABLE public.boats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    price_per_hour DECIMAL(10,2) NOT NULL CHECK (price_per_hour >= 0),
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.boats IS 'Embarcações disponíveis para reserva na marina';
COMMENT ON COLUMN public.boats.owner_id IS 'Proprietário da embarcação (referência ao profile)';
COMMENT ON COLUMN public.boats.capacity IS 'Capacidade máxima de passageiros';
COMMENT ON COLUMN public.boats.price_per_hour IS 'Preço por hora de aluguel';

-- Índice para busca de barcos disponíveis
CREATE INDEX idx_boats_available ON public.boats(is_available) WHERE is_available = TRUE;

-- ============================================================
-- 3. TABELA: bookings
-- Reservas de embarcações
-- ============================================================

CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    boat_id UUID NOT NULL REFERENCES public.boats(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Garante que end_time > start_time
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Comentários da tabela
COMMENT ON TABLE public.bookings IS 'Reservas de embarcações pelos usuários';
COMMENT ON COLUMN public.bookings.status IS 'Status: pending (aguardando), confirmed (confirmada), cancelled (cancelada), completed (concluída)';

-- Índices para consultas comuns
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_boat ON public.bookings(boat_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_dates ON public.bookings(start_time, end_time);


-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 4.1 POLÍTICAS: profiles
-- ============================================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Novos usuários podem inserir seu perfil (durante registro)
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );


-- ============================================================
-- 4.2 POLÍTICAS: boats
-- ============================================================

-- Todos os usuários autenticados podem ver barcos disponíveis
CREATE POLICY "Anyone can view available boats"
    ON public.boats
    FOR SELECT
    USING (is_available = TRUE);

-- Proprietários podem ver todos os seus barcos (mesmo indisponíveis)
CREATE POLICY "Owners can view own boats"
    ON public.boats
    FOR SELECT
    USING (owner_id = auth.uid());

-- Proprietários podem inserir seus próprios barcos
CREATE POLICY "Owners can insert own boats"
    ON public.boats
    FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- Proprietários podem atualizar seus próprios barcos
CREATE POLICY "Owners can update own boats"
    ON public.boats
    FOR UPDATE
    USING (owner_id = auth.uid());

-- Admins podem gerenciar todos os barcos
CREATE POLICY "Admins can manage all boats"
    ON public.boats
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );


-- ============================================================
-- 4.3 POLÍTICAS: bookings
-- ============================================================

-- Usuários podem ver suas próprias reservas
CREATE POLICY "Users can view own bookings"
    ON public.bookings
    FOR SELECT
    USING (user_id = auth.uid());

-- Usuários podem criar suas próprias reservas
CREATE POLICY "Users can create own bookings"
    ON public.bookings
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Usuários podem cancelar suas próprias reservas (apenas atualizar status)
CREATE POLICY "Users can cancel own bookings"
    ON public.bookings
    FOR UPDATE
    USING (user_id = auth.uid());

-- Proprietários podem ver reservas dos seus barcos
CREATE POLICY "Owners can view bookings for own boats"
    ON public.bookings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.boats
            WHERE boats.id = bookings.boat_id AND boats.owner_id = auth.uid()
        )
    );

-- Proprietários podem atualizar status de reservas dos seus barcos
CREATE POLICY "Owners can update bookings for own boats"
    ON public.bookings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.boats
            WHERE boats.id = bookings.boat_id AND boats.owner_id = auth.uid()
        )
    );

-- Admins podem gerenciar todas as reservas
CREATE POLICY "Admins can manage all bookings"
    ON public.bookings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );


-- ============================================================
-- 5. TRIGGER: Criar perfil automaticamente no registro
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que executa após inserção em auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 6. TRIGGER: Atualizar updated_at automaticamente
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_boats_updated_at
    BEFORE UPDATE ON public.boats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();


-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
-- Após executar:
-- 1. Verifique se as tabelas foram criadas em: Table Editor
-- 2. Verifique se RLS está ativo em: Authentication > Policies
-- 3. Localmente, execute: supabase db pull
-- ============================================================
