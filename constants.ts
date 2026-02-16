
import { Team, Player, AvailabilityStatus } from './types';

export const BRAND_COLORS = {
  PRIMARY: '#525252', // Gris Neutro Técnico (Antes Rojo Athletic)
  DARK: '#121212',
  WHITE: '#FFFFFF',
  GRAY: '#1A1A1A',
};

export const TEAMS: Team[] = [
  { id: '2', name: 'Bilbao Athletic', category: 'Primera RFEF' },
  { id: '3', name: 'Basconia', category: 'Tercera RFEF' },
];

export const MOCK_PLAYERS: Record<string, Player[]> = {
  '2': [ 
    {
        id: 'ba-0',
        name: 'Oier Gastesi',
        apodo: 'GASTESI',
        team_id: '2',
        birth_date: '30-10-2003',
        photoUrl: 'https://cdn.athletic-club.eus/imagenes/player_images/small/oier-gastesi.png',
        dorsal: '1',
        position: 'PORTERO',
        status: AvailabilityStatus.AVAILABLE,
        participation: 100,
        laterality: 'Diestro'
    },
    {
        id: 'ba-1',
        name: 'Adrian Perez Sordo',
        apodo: 'PEREZ SORDO',
        team_id: '2',
        birth_date: '25-10-2006',
        photoUrl: 'https://cdn.athletic-club.eus/imagenes/player_images/small/adrian-perez-sordo.png',
        dorsal: '2',
        position: 'DEFENSA',
        status: AvailabilityStatus.AVAILABLE,
        participation: 85,
        laterality: 'Diestro'
    },
    {
        id: 'ba-3',
        name: 'Adama Boiro',
        apodo: 'ADAMA',
        team_id: '2',
        birth_date: '22-06-2002',
        photoUrl: 'https://cdn.athletic-club.eus/imagenes/player_images/small/adama-boiro.png',
        dorsal: '3',
        position: 'DEFENSA',
        status: AvailabilityStatus.AVAILABLE,
        participation: 95,
        laterality: 'Zurdo'
    },
    {
        id: 'ba-2',
        name: 'Aimar Duñabeitia',
        apodo: 'DUÑA',
        team_id: '2',
        birth_date: '26-02-2003',
        photoUrl: 'https://cdn.athletic-club.eus/imagenes/player_images/small/aimar-dunabeitia-madariaga.png',
        dorsal: '4',
        position: 'DEFENSA',
        status: AvailabilityStatus.AVAILABLE,
        participation: 90,
        laterality: 'Diestro'
    },
    {
        id: 'ba-5',
        name: 'Eneko Ebro',
        apodo: 'EBRO',
        team_id: '2',
        birth_date: '29-09-2003',
        photoUrl: 'https://cdn.athletic-club.eus/imagenes/player_images/small/eneko-ebro.png',
        dorsal: '5',
        position: 'DEFENSA',
        status: AvailabilityStatus.AVAILABLE,
        participation: 75,
        laterality: 'Diestro'
    }
  ],
  '3': [ 
    {
        id: 'bas-1',
        name: 'Adrian Lecuna',
        apodo: 'LECUNA',
        team_id: '3',
        birth_date: '19-08-2006',
        photoUrl: 'https://cdn.athletic-club.eus/imagenes/player_images/small/adrian-lekuna-azcona.png',
        dorsal: '2',
        position: 'DEFENSA',
        status: AvailabilityStatus.AVAILABLE,
        participation: 80,
        laterality: 'Diestro'
    }
  ]
};
