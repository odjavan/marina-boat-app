-- ============================================================
-- Marina Boat App - Migração 002: Ajuste para Serviços de Marina
-- ============================================================

-- 1. AJUSTAR TABELA BOATS
-- Remover colunas de aluguel e adicionar colunas de propriedade/documentação
ALTER TABLE public.boats 
    ADD COLUMN IF NOT EXISTS brand TEXT,
    ADD COLUMN IF NOT EXISTS model TEXT,
    ADD COLUMN IF NOT EXISTS year INTEGER,
    ADD COLUMN IF NOT EXISTS length TEXT,
    ADD COLUMN IF NOT EXISTS registration_number TEXT,
    ADD COLUMN IF NOT EXISTS documents TEXT[], -- URLs de documentos se quiser simplificar, ou usar tabela separada
    ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

-- Remover colunas antigas não utilizadas (opcional, mas recomendado para limpeza)
-- ALTER TABLE public.boats DROP COLUMN IF EXISTS capacity;
-- ALTER TABLE public.boats DROP COLUMN IF EXISTS price_per_hour;
-- ALTER TABLE public.boats DROP COLUMN IF EXISTS is_available; -- Manter se quiser usar para "No Pátio" / "Na Água"

-- Atualizar comentários
COMMENT ON TABLE public.boats IS 'Embarcações cadastradas pelos proprietários';
COMMENT ON COLUMN public.boats.brand IS 'Marca da embarcação (ex: Azimut)';
COMMENT ON COLUMN public.boats.registration_number IS 'Número de inscrição/matrícula';

-- ============================================================
-- 2. NOVA TABELA: service_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT, -- Nome do ícone (Lucide react)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir Categorias Padrão
INSERT INTO public.service_categories (name, description, icon) VALUES
('Limpeza', 'Limpeza externa, interna, polimento', 'Droplets'),
('Abastecimento', 'Combustível, água doce, gás', 'Fuel'),
('Manutenção Preventiva', 'Revisões programadas, troca de óleo', 'Wrench'),
('Manutenção Corretiva', 'Reparos elétricos, mecânicos, fibra', 'Hammer'),
('Outros Serviços', 'Serviços diversos de marinharia', 'Settings')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 3. NOVA TABELA: services (Catálogo)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.service_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    estimated_time TEXT, -- Ex: '2 horas', '1 dia'
    icon TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. NOVA TABELA: service_requests (Solicitações/Ordens de Serviço)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Quem solicitou
    boat_id UUID REFERENCES public.boats(id) ON DELETE CASCADE,
    
    -- Se quiser multiplos serviços por request, pode usar uma tabela de junção.
    -- Para simplificar conforme o app atual, vamos manter um campo de descrição ou categoria principal
    category TEXT REFERENCES public.service_categories(name), -- Desnormalizado ou ID
    
    description TEXT NOT NULL,
    preferred_date DATE,
    urgency TEXT CHECK (urgency IN ('Normal', 'Urgente', 'Emergencial')),
    
    status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Em Andamento', 'Concluído', 'Cancelado', 'Em Análise', 'Agendado')),
    
    photos TEXT[], -- Array de URLs de fotos do problema
    
    admin_notes TEXT, -- Observações da marina
    total_cost DECIMAL(10,2), -- Orçamento
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_service_requests_updated_at
    BEFORE UPDATE ON public.service_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 5. NOVA TABELA: boat_documents (Documentos PDF)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.boat_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boat_id UUID REFERENCES public.boats(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- Ex: "Seguro 2024"
    file_url TEXT NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. NOVA TABELA: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, success, warning, error
    is_read BOOLEAN DEFAULT FALSE,
    data JSONB, -- Link para recurso relacionado { resource_type: 'service', resource_id: '...' }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. POLÍTICAS DE SEGURANÇA (RLS)
-- ============================================================

-- Habilitar RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boat_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- --- Service Categories & Services (Público para leitura, Admin para escrita) ---
CREATE POLICY "Anyone can view categories" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);
-- (Adicione políticas de escrita para admins se necessário)

-- --- Service Requests ---
CREATE POLICY "Users can view own requests" ON public.service_requests 
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Owners can view requests for their boats" ON public.service_requests 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.boats WHERE boats.id = boat_id AND boats.owner_id = auth.uid())
    );

CREATE POLICY "Users can create requests" ON public.service_requests 
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own requests (cancel)" ON public.service_requests 
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all requests" ON public.service_requests 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'funcionario'))
    );

-- --- Boat Documents ---
CREATE POLICY "Owners can view/manage own boat documents" ON public.boat_documents
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.boats WHERE boats.id = boat_id AND boats.owner_id = auth.uid())
    );

CREATE POLICY "Admins can view all boat documents" ON public.boat_documents
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'funcionario'))
    );

-- --- Notifications ---
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications (mark read)" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());


-- ============================================================
-- 8. Permissões de Storage (Exemplo - Configurar no Dashboard do Supabase)
-- ============================================================
-- Bucket: 'boat-images' (Público)
-- Bucket: 'boat-documents' (Privado - Apenas Authenticated)
