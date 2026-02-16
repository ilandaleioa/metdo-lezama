
-- ==============================================================================
-- ESQUEMA RESTAURADO: GESTIÓN FLEXIBLE DE PLANTILLAS
-- ==============================================================================

-- 1. Tabla Maestra de Jugadores
CREATE TABLE IF NOT EXISTS public.players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    name TEXT NOT NULL,
    apodo TEXT,
    photo_url TEXT,
    dorsal INTEGER,
    position TEXT,
    status TEXT DEFAULT 'Disponible',
    team_id TEXT NOT NULL,
    laterality TEXT,
    birth_date DATE,
    participation INTEGER DEFAULT 0,
    minutes INTEGER DEFAULT 0,
    goals INTEGER DEFAULT 0,
    matches_played INTEGER DEFAULT 0,
    matches_started INTEGER DEFAULT 0,
    transfermarkt_url TEXT
);

-- 2. Informes de Seguimiento (8 Dimensiones)
CREATE TABLE IF NOT EXISTS public.tracking_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    team_id TEXT,
    month TEXT NOT NULL,
    data JSONB NOT NULL,
    UNIQUE(player_id, month)
);

-- 3. Informes Técnicos 360
CREATE TABLE IF NOT EXISTS public.technical_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    team_id TEXT,
    month TEXT,
    data JSONB NOT NULL
);

-- 4. Cuerpo Técnico
CREATE TABLE IF NOT EXISTS public.coaches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    team_id TEXT,
    photo_url TEXT,
    qualification TEXT,
    euskera_level TEXT,
    birth_date DATE
);

-- 5. Registro de Partidos
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    competition TEXT,
    teamId TEXT,
    date DATE,
    localTeam TEXT,
    visitorTeam TEXT,
    localLogo TEXT,
    visitorLogo TEXT,
    localGoals INTEGER DEFAULT 0,
    visitorGoals INTEGER DEFAULT 0,
    system TEXT,
    starters JSONB DEFAULT '[]',
    substitutes JSONB DEFAULT '[]',
    nonCalled JSONB DEFAULT '[]',
    substitutions JSONB DEFAULT '[]',
    player_positions JSONB DEFAULT '{}',
    isFinished BOOLEAN DEFAULT false
);

-- 6. Pizarras de Campogramas
CREATE TABLE IF NOT EXISTS public.campograma_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    team_id TEXT NOT NULL,
    formation TEXT NOT NULL,
    assignments JSONB NOT NULL,
    metadata JSONB DEFAULT '{}'
);

-- RLS
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow Public Access" ON public.players FOR ALL USING (true);
ALTER TABLE public.tracking_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow Public Access Tracking" ON public.tracking_reports FOR ALL USING (true);
ALTER TABLE public.technical_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow Public Access Tech" ON public.technical_reports FOR ALL USING (true);
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow Public Access Coaches" ON public.coaches FOR ALL USING (true);
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow Public Access Matches" ON public.matches FOR ALL USING (true);
ALTER TABLE public.campograma_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow Public Access Campogramas" ON public.campograma_assignments FOR ALL USING (true);
