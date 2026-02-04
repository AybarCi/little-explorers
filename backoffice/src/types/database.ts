export interface User {
    id: string;
    email: string;
    full_name: string;
    age_group: string;
    total_points: number;
    diamonds: number;
    completed_games_count: number;
    energy: number;
    current_avatar_id: string | null;
    current_frame_id: string | null;
    current_badge_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface GameProgress {
    id: string;
    user_id: string;
    game_id: string;
    score: number;
    completed: boolean;
    time_spent: number;
    created_at?: string;
    games?: Game;
}

export interface Game {
    id: string;
    title: string;
    category: string;
    difficulty?: string;
    points: number;
    is_active: boolean;
    created_at?: string;
}

export interface ChallengeClaim {
    id: string;
    user_id: string;
    challenge_id: string;
    challenge_type: 'daily' | 'weekly' | 'special';
    reward_points: number;
    challenge_round: number;
    created_at: string;
    claimed_at?: string;
}

export interface UserInventory {
    id: string;
    user_id: string;
    item_type: 'avatar' | 'frame' | 'badge';
    item_id: string;
    created_at?: string;
}

export interface Supervisor {
    id: string;
    email: string;
    username: string;
    password_hash: string;
    is_active: boolean;
    created_at: string;
}

export interface LeaderboardEntry {
    rank: number;
    user_id: string;
    username: string;
    avatar_emoji?: string;
    value: number;
}

export interface DashboardStats {
    totalUsers: number;
    totalDiamonds: number;
    totalGamesPlayed: number;
    totalPoints: number;
    newUsersToday: number;
    activeUsersWeek: number;
    totalRevenue: number;
    iosPurchases: number;
    androidPurchases: number;
}

export interface CategoryStats {
    total: number;
    completed: number;
    score: number;
    time: number;
}
