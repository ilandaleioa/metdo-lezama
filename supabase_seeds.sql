
-- Equipos Iniciales
INSERT INTO public.equipos (id, nombre, escudo_url, categoria) VALUES 
('2', 'BILBAO ATHLETIC', 'https://cdn.athletic-club.eus/imagenes/logos/logo-bilbao-athletic.png', '1ª RFEF'),
('3', 'BASCONIA', 'https://cdn.athletic-club.eus/imagenes/logos/logo-basconia.png', '3ª RFEF'),
('rival-barakaldo', 'BARAKALDO CF', 'https://via.placeholder.com/100', '1ª RFEF');

-- Competiciones
INSERT INTO public.competiciones (nombre, tipo_partido) VALUES ('LIGA NACIONAL', 'OFICIAL');

-- Jugadores (Basados en el Demo de Excel)
INSERT INTO public.jugadores (id, dni, name, apodo, photo_url, dorsal, posicion, team_id) VALUES 
('jug-001', '11111111A', 'ADAMA BOIRO', 'ADAMA', 'https://cdn.athletic-club.eus/imagenes/player_images/small/adama-boiro.png', 3, 'DEFENSA', '2'),
('jug-002', '22222222B', 'MIKEL JAUREGIZAR', 'JAURE', 'https://cdn.athletic-club.eus/imagenes/player_images/small/mikel-jauregizar.png', 6, 'CENTROCAMPISTA', '2'),
('jug-003', '33333333C', 'OIER GASTESI', 'GASTESI', 'https://cdn.athletic-club.eus/imagenes/player_images/small/oier-gastesi.png', 1, 'PORTERO', '2');

-- Partido de Ejemplo (Derivado de Excel)
INSERT INTO public.partidos (id, fecha, jornada, competicion_id, equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, resultado) 
VALUES (
    'part-2026-001', 
    '2026-02-09', 
    21, 
    (SELECT id FROM public.competiciones WHERE nombre = 'LIGA NACIONAL'), 
    '2', 
    'rival-barakaldo', 
    2, 1, '2-1'
);

-- Participaciones (Hechos de rendimiento)
INSERT INTO public.participaciones (partido_id, jugador_id, minutos_jugados, goles, tipo_rol) VALUES 
('part-2026-001', 'jug-001', 90, 0, 'TITULAR'),
('part-2026-001', 'jug-002', 75, 1, 'TITULAR');
