export type GameCategory = 'math' | 'language' | 'logic' | 'memory' | 'science';
export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface Game {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  min_age: number;
  max_age: number;
  points: number;
  image_url?: string;
  game_data: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_progress?: {
    score: number;
    completed: boolean;
  } | null;
}

export interface GameProgress {
  id: string;
  user_id: string;
  game_id: string;
  score: number;
  completed: boolean;
  time_spent: number;
  progress_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SaveProgressPayload {
  game_id: string;
  score?: number;
  completed?: boolean;
  time_spent?: number;
  progress_data?: Record<string, any>;
}
