
export enum AvailabilityStatus {
  AVAILABLE = 'Disponible',
  DOUBT = 'Duda',
  UNAVAILABLE = 'No Disponible',
  INJURED = 'Lesionado'
}

export interface Player {
  id: string;
  name: string;
  apodo?: string;
  photoUrl: string;
  photo_url?: string; 
  dorsal: string;
  status: AvailabilityStatus;
  position: string;
  laterality?: 'Diestro' | 'Zurdo' | 'Ambas';
  participation: number; 
  transfermarktUrl?: string;
  transfermarkt_url?: string;
  team_id: string;
  birth_date?: string;
  birthDate?: string;
  matchesPlayed?: number;
  matches_played?: number;
  matchesStarted?: number;
  matches_started?: number;
  minutes?: number;
  goals?: number;
  assists?: number;
  duels_won?: number;
  progressive_passes?: number;
  recoveries?: number;
  pass_accuracy?: number;
  match_availability?: number;
  training_availability?: number;
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  category: string;
}

export interface Substitution {
  id: string;
  playerOutId: string;
  playerInId: string;
  minute: number;
}

export interface Match {
  id: string;
  competition: string;
  teamId: string;
  date: string;
  localTeam: string;
  visitorTeam: string;
  localLogo?: string;
  visitorLogo?: string;
  localGoals: number;
  visitorGoals: number;
  system: string;
  starters: string[];
  substitutes: string[];
  nonCalled: string[];
  substitutions: Substitution[];
  player_positions?: Record<string, string>;
  isFinished: boolean;
}

export type ViewType = 
  | 'HOME' 
  | 'PLANTILLAS' 
  | 'CAMPOGRAMAS'
  | 'JUGADOR'
  | 'ENTRENADOR'
  | 'EQUIPO'
  | 'PARTIDOS'
  | 'SESIONES'
  | 'ACTIVIDADES'
  | 'TAREAS'
  | 'ABP'
  | 'LIVE_TAGGING'
  | 'EVALUACIONES'
  | 'EVALUACION_TECNICA'
  | 'TALLAJE_FORM'
  | 'VIDEOTECA'
  | 'COMPETICIONES' 
  | 'BESOCCER'
  | 'DESIGNER'
  | 'DATAHUB'
  | 'VIDEOLAB'
  | 'CAN_TECNICOS'
  | 'CAN_INTERVENCIONES'
  | 'RENDIMIENTO_TESTS'
  | 'RENDIMIENTO_PSICOLOGIA'
  | 'RENDIMIENTO_NUTRICION'
  | 'RENDIMIENTO_ESFUERZO'
  | 'RENDIMIENTO_WELLNESS'
  | 'LESIONES'
  | 'ATENCION_ACADEMICO'
  | 'ATENCION_RESIDENCIA'
  | 'ATENCION_BASERRI'
  | 'ANALYTICS_DEMO'
  | 'COMP_EQUIPOS'
  | 'COMP_PARTIDOS'
  | 'COMP_STATS';
