import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Gem, Gamepad2, Clock, Trophy, ShoppingBag, CreditCard } from 'lucide-react';
import { backofficeApi } from '../lib/supabase';
import type { User, GameProgress, ChallengeClaim, UserInventory } from '../types/database';

interface DiamondPurchase {
    id: string;
    user_id: string;
    product_id: string;
    diamond_amount: number;
    price_amount: number | null;
    price_currency: string | null;
    transaction_id: string | null;
    platform: string;
    status: string;
    created_at: string;
}

interface UserDetailResponse {
    user: User;
    gameProgress: GameProgress[];
    challenges: ChallengeClaim[];
    inventory: UserInventory[];
    diamondPurchases: DiamondPurchase[];
}

export default function UserDetail() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [gameProgress, setGameProgress] = useState<GameProgress[]>([]);
    const [challenges, setChallenges] = useState<ChallengeClaim[]>([]);
    const [inventory, setInventory] = useState<UserInventory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [diamondPurchases, setDiamondPurchases] = useState<DiamondPurchase[]>([]);

    useEffect(() => {
        if (id) fetchUserData();
    }, [id]);

    const fetchUserData = async () => {
        try {
            setError(null);
            const data = await backofficeApi<UserDetailResponse>('detail', { user_id: id! });
            setUser(data.user);
            setGameProgress(data.gameProgress || []);
            setChallenges(data.challenges || []);
            setInventory(data.inventory || []);
            setDiamondPurchases(data.diamondPurchases || []);
        } catch (err) {
            console.error('User detail fetch error:', err);
            setError(err instanceof Error ? err.message : 'Kullanıcı bulunamadı');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex h-full flex-col items-center justify-center">
                <p className="text-red-500 mb-4">❌ {error || 'Kullanıcı bulunamadı'}</p>
                <Link to="/users" className="text-purple-600 hover:underline">
                    Kullanıcı listesine dön
                </Link>
            </div>
        );
    }

    // Category stats
    const categoryStats: Record<string, { completed: number; totalScore: number; totalTime: number }> = {};
    gameProgress.forEach((p) => {
        const category = (p.games as any)?.category || 'Diğer';
        if (!categoryStats[category]) {
            categoryStats[category] = { completed: 0, totalScore: 0, totalTime: 0 };
        }
        if (p.completed) categoryStats[category].completed++;
        categoryStats[category].totalScore += p.score || 0;
        categoryStats[category].totalTime += p.time_spent || 0;
    });

    const inventoryByType = {
        avatar: inventory.filter((i) => i.item_type === 'avatar').length,
        frame: inventory.filter((i) => i.item_type === 'frame').length,
        badge: inventory.filter((i) => i.item_type === 'badge').length,
    };

    return (
        <div className="space-y-6">
            <Link
                to="/users"
                className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
                <ArrowLeft className="h-4 w-4" />
                Kullanıcı Listesine Dön
            </Link>

            <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-6 text-white shadow-lg">
                <div className="flex items-start gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-4xl backdrop-blur-sm">
                        {user.full_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{user.full_name}</h1>
                        <p className="mt-1 text-purple-200">{user.email}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                                {user.age_group} yaş
                            </span>
                            <span className="text-sm text-purple-200">
                                Kayıt: {new Date(user.created_at).toLocaleDateString('tr-TR')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                            <Star className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Toplam Puan</p>
                            <p className="text-xl font-bold text-gray-900">
                                {(user.total_points || 0).toLocaleString('tr-TR')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <Gem className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Elmas</p>
                            <p className="text-xl font-bold text-gray-900">
                                {(user.diamonds || 0).toLocaleString('tr-TR')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                            <Gamepad2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tamamlanan Oyun</p>
                            <p className="text-xl font-bold text-gray-900">{user.completed_games_count || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Enerji</p>
                            <p className="text-xl font-bold text-gray-900">{user.energy || 0} / 5</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Gamepad2 className="h-5 w-5 text-purple-600" />
                    Kategori Bazlı İlerleme
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(categoryStats).map(([category, stats]) => (
                        <div key={category} className="rounded-xl border border-gray-100 p-4">
                            <h3 className="font-medium text-gray-900">{category}</h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-500">
                                <p>✅ {stats.completed} oyun tamamlandı</p>
                                <p>⭐ {stats.totalScore.toLocaleString('tr-TR')} puan</p>
                                <p>⏱️ {Math.round(stats.totalTime / 60)} dk</p>
                            </div>
                        </div>
                    ))}
                    {Object.keys(categoryStats).length === 0 && (
                        <p className="col-span-full text-center text-gray-500">Henüz oyun oynamadı</p>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Trophy className="h-5 w-5 text-orange-500" />
                        Tamamlanan Görevler ({challenges.length})
                    </h2>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {challenges.slice(0, 10).map((c) => (
                            <div key={c.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                                <span className="text-sm text-gray-700">
                                    {c.challenge_type === 'daily' ? '📅' : c.challenge_type === 'weekly' ? '📆' : '⭐'}{' '}
                                    {c.challenge_type === 'daily' ? 'Günlük' : c.challenge_type === 'weekly' ? 'Haftalık' : 'Özel'}
                                </span>
                                <span className="text-sm font-medium text-green-600">+{c.reward_points} puan</span>
                            </div>
                        ))}
                        {challenges.length === 0 && (
                            <p className="text-center text-sm text-gray-500">Henüz görev tamamlanmadı</p>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <ShoppingBag className="h-5 w-5 text-pink-500" />
                        Satın Almalar ({inventory.length})
                    </h2>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="rounded-xl bg-purple-50 p-4 text-center">
                            <p className="text-2xl font-bold text-purple-600">{inventoryByType.avatar}</p>
                            <p className="text-sm text-gray-500">Avatar</p>
                        </div>
                        <div className="rounded-xl bg-blue-50 p-4 text-center">
                            <p className="text-2xl font-bold text-blue-600">{inventoryByType.frame}</p>
                            <p className="text-sm text-gray-500">Çerçeve</p>
                        </div>
                        <div className="rounded-xl bg-orange-50 p-4 text-center">
                            <p className="text-2xl font-bold text-orange-600">{inventoryByType.badge}</p>
                            <p className="text-sm text-gray-500">Rozet</p>
                        </div>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {inventory.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">
                                        {item.item_type === 'avatar' && (item.item_details?.emoji || '🎭')}
                                        {item.item_type === 'frame' && '🖼️'}
                                        {item.item_type === 'badge' && (item.item_details?.emoji || '🏅')}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {item.item_details?.name || 'Bilinmeyen Öğe'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.item_type === 'avatar' ? 'Avatar' : item.item_type === 'frame' ? 'Çerçeve' : 'Rozet'}
                                            {item.item_details?.rarity && ` • ${item.item_details.rarity}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-purple-600">
                                        💎 {item.item_details?.price || 0}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {item.purchased_at ? new Date(item.purchased_at).toLocaleDateString('tr-TR') : '-'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {inventory.length === 0 && (
                            <p className="text-center text-sm text-gray-500">Henüz satın alma yok</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Diamond Purchases Section */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <CreditCard className="h-5 w-5 text-green-500" />
                    Elmas Satın Almaları ({diamondPurchases.length})
                </h2>
                {diamondPurchases.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">Henüz elmas satın alınmadı</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {diamondPurchases.map((purchase) => (
                            <div key={purchase.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">💎</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            +{purchase.diamond_amount} Elmas
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded ${purchase.platform === 'ios' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'}`}>
                                                {purchase.platform === 'ios' ? '🍎 iOS' : '🤖 Android'}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {purchase.product_id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-green-600">
                                        {purchase.price_amount
                                            ? `${purchase.price_amount} ${purchase.price_currency || ''}`
                                            : 'Fiyat yok'}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(purchase.created_at).toLocaleDateString('tr-TR', {
                                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
