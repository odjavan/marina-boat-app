-- ============================================================
-- Marina Boat App - Migration 017: User Settings
-- ============================================================
-- Create table for user preferences and notification settings

CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Notification Preferences
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    sms_notifications BOOLEAN DEFAULT false,
    
    -- Future settings can be added here
    -- theme TEXT DEFAULT 'light',
    -- language TEXT DEFAULT 'pt-BR',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one settings record per user
    CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Comments
COMMENT ON TABLE public.user_settings IS 'User preferences and notification settings';
COMMENT ON COLUMN public.user_settings.email_notifications IS 'Enable/disable email notifications';
COMMENT ON COLUMN public.user_settings.push_notifications IS 'Enable/disable push notifications';
COMMENT ON COLUMN public.user_settings.sms_notifications IS 'Enable/disable SMS notifications';

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own settings
CREATE POLICY "Users can view own settings"
    ON public.user_settings
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own settings"
    ON public.user_settings
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
    ON public.user_settings
    FOR UPDATE
    USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Index for faster lookups
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);
