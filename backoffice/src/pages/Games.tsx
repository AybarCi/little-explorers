import { useEffect, useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { backofficeApi } from '../lib/supabase';
import type { Game } from '../types/database';

interface GameWithStats extends Game {
    play_count: number;
    avg_score: number;
}

interface GamesResponse {
    games: GameWithStats[];
}

export default function Games() {
    const [games, setGames] = useState<GameWithStats[]>([]);
    const [categoryStats, setCategoryStats] = useState<Record<string, { count: number; plays: number }>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchGamesData();
    }, []);

    const fetchGamesData = async () => {
        try {
            setError(null);
            const data = await backofficeApi<GamesResponse>('games');
            const gamesData = data.games || [];

            // Calculate category stats
            const catStats: Record<string, { count: number; plays: number }> = {};
            gamesData.forEach((g) => {
                if (!catStats[g.category]) {
                    catStats[g.category] = { count: 0, plays: 0 };
                }
                catStats[g.category].count++;
                catStats[g.category].plays += g.play_count;
            });

            setGames(gamesData);
            setCategoryStats(catStats);
        } catch (err) {
            console.error('Games fetch error:', err);
            setError(err instanceof Error ? err.message : 'Veri yüklenirken hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryEmoji = (category: string) => {
        const emojis: Record<string, string> = {
            'Matematik': '🔢',
            'Hafıza': '🧠',
            'Dikkat': '🎯',
            'Problem Çözme': '🧩',
            'Kelime': '📚',
            'Eğlence': '🎮',
        };
        return emojis[category] || '🎯';
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Matematik': 'from-blue-500 to-cyan-500',
            'Hafıza': 'from-purple-500 to-indigo-500',
            'Dikkat': 'from-orange-500 to-amber-500',
            'Problem Çözme': 'from-green-500 to-emerald-500',
            'Kelime': 'from-pink-500 to-rose-500',
            'Eğlence': 'from-violet-500 to-purple-500',
        };
        return colors[category] || 'from-gray-500 to-slate-500';
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center">
                <p className="text-red-500 mb-4">❌ {error}</p>
                <button
                    onClick={fetchGamesData}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Oyunlar</h1>
                <p className="mt-1 text-gray-500">Toplam {games.length} oyun</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(categoryStats).map(([category, stats]) => (
                    <div key={category} className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div
                                className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${getCategoryColor(category)} text-2xl text-white shadow-lg`}
                            >
                                {getCategoryEmoji(category)}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{category}</h3>
                                <p className="text-sm text-gray-500">{stats.count} oyun</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-gray-500">Toplam Oynanma</span>
                            <span className="font-semibold text-purple-600">{stats.plays.toLocaleString('tr-TR')}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                        <Gamepad2 className="h-5 w-5 text-purple-600" />
                        Tüm Oyunlar
                    </h2>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Oyun</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Kategori</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Puan</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Oynanma</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Ort. Skor</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {games.map((game) => (
                            <tr key={game.id} className="transition-colors hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{getCategoryEmoji(game.category)}</span>
                                        <span className="font-medium text-gray-900">{game.title || game.id.slice(0, 8)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
                                        {game.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    ⭐ {game.points}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                    {game.play_count.toLocaleString('tr-TR')}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                    {game.avg_score.toLocaleString('tr-TR')}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${game.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        {game.is_active ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {games.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Henüz oyun yok
                    </div>
                )}
            </div>
        </div>
    );
}
