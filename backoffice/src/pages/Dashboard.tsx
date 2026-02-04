import { useEffect, useState } from 'react';
import { Users, Gamepad2, UserPlus, TrendingUp, DollarSign, Smartphone, Apple } from 'lucide-react';
import { backofficeApi } from '../lib/supabase';
import StatsCard from '../components/ui/StatsCard';
import type { User, DashboardStats } from '../types/database';

interface StatsResponse {
    stats: DashboardStats;
    recentUsers: User[];
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setError(null);
            const data = await backofficeApi<StatsResponse>('stats');
            setStats(data.stats);
            setRecentUsers(data.recentUsers || []);
        } catch (err) {
            console.error('Dashboard data error:', err);
            setError(err instanceof Error ? err.message : 'Veri yüklenirken hata oluştu');
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

    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center">
                <p className="text-red-500 mb-4">❌ {error}</p>
                <button
                    onClick={fetchDashboardData}
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
                <h1 className="text-2xl font-bold text-gray-900">Panel</h1>
                <p className="mt-1 text-gray-500">Küçük Kaşif uygulamasına genel bakış</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                <StatsCard
                    title="Toplam Kullanıcı"
                    value={stats?.totalUsers || 0}
                    icon={<Users className="h-6 w-6" />}
                    color="purple"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Toplam Gelir"
                    value={stats?.totalRevenue ? `₺${stats.totalRevenue.toFixed(2)}` : '₺0.00'}
                    icon={<DollarSign className="h-6 w-6" />}
                    color="green"
                />
                <StatsCard
                    title="iOS Satışları"
                    value={stats?.iosPurchases || 0}
                    icon={<Apple className="h-6 w-6" />}
                    color="gray"
                />
                <StatsCard
                    title="Android Satışları"
                    value={stats?.androidPurchases || 0}
                    icon={<Smartphone className="h-6 w-6" />}
                    color="green"
                />
                <StatsCard
                    title="Oynanan Oyun"
                    value={stats?.totalGamesPlayed || 0}
                    icon={<Gamepad2 className="h-6 w-6" />}
                    color="blue"
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <StatsCard
                    title="Bugün Yeni Kayıt"
                    value={stats?.newUsersToday || 0}
                    icon={<UserPlus className="h-6 w-6" />}
                    color="pink"
                />
                <StatsCard
                    title="Bu Hafta Aktif"
                    value={stats?.activeUsersWeek || 0}
                    icon={<TrendingUp className="h-6 w-6" />}
                    color="purple"
                />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Son Kayıt Olan Kullanıcılar</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-3 text-left text-sm font-medium text-gray-500">Kullanıcı</th>
                                <th className="pb-3 text-left text-sm font-medium text-gray-500">Yaş Grubu</th>
                                <th className="pb-3 text-left text-sm font-medium text-gray-500">Puan</th>
                                <th className="pb-3 text-left text-sm font-medium text-gray-500">Elmas</th>
                                <th className="pb-3 text-left text-sm font-medium text-gray-500">Kayıt Tarihi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentUsers.map((user) => (
                                <tr key={user.id} className="transition-colors hover:bg-gray-50">
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-medium text-white">
                                                {user.full_name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.full_name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
                                            {user.age_group}
                                        </span>
                                    </td>
                                    <td className="py-3 font-medium text-gray-900">
                                        {(user.total_points || 0).toLocaleString('tr-TR')}
                                    </td>
                                    <td className="py-3">
                                        <span className="inline-flex items-center gap-1 text-gray-900">
                                            💎 {(user.diamonds || 0).toLocaleString('tr-TR')}
                                        </span>
                                    </td>
                                    <td className="py-3 text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                    </td>
                                </tr>
                            ))}
                            {recentUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        Henüz kullanıcı yok
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
