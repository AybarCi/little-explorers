import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { backofficeApi } from '../lib/supabase';
import type { User } from '../types/database';

interface UsersResponse {
    users: User[];
    count: number;
}

export default function Users() {
    const [searchQuery, setSearchQuery] = useState('');
    const [ageFilter, setAgeFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const limit = 10;

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [searchQuery, ageFilter]);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['users', page, limit, searchQuery, ageFilter],
        queryFn: () => backofficeApi<UsersResponse>('list', {
            page: page.toString(),
            limit: limit.toString(),
            search: searchQuery,
            age: ageFilter
        }),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });

    const users = data?.users || [];
    const totalCount = data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    if (isLoading && !data) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center">
                <p className="text-red-500 mb-4">❌ {(error as Error).message}</p>
                <button
                    onClick={() => refetch()}
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
                <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
                <p className="mt-1 text-gray-500">Toplam {totalCount} kullanıcı</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="İsim veya email ile ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <select
                        value={ageFilter}
                        onChange={(e) => setAgeFilter(e.target.value)}
                        className="h-10 rounded-lg border border-gray-200 bg-white pl-10 pr-8 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    >
                        <option value="all">Tüm Yaşlar</option>
                        <option value="5-7">5-7 yaş</option>
                        <option value="8-10">8-10 yaş</option>
                        <option value="11-13">11-13 yaş</option>
                        <option value="14+">14+ yaş</option>
                    </select>
                </div>
            </div>

            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Kullanıcı</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Yaş</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Puan</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Elmas</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Oyun</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Kayıt</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-medium text-white">
                                                {user.full_name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.full_name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
                                            {user.age_group}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        ⭐ {(user.total_points || 0).toLocaleString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        💎 {(user.diamonds || 0).toLocaleString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        🎮 {user.completed_games_count || 0}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/users/${user.id}`}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-200"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Detay
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Kullanıcı bulunamadı
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                    <p className="text-sm text-gray-500">
                        {totalCount} kullanıcıdan {(page - 1) * limit + 1}-
                        {Math.min(page * limit, totalCount)} gösteriliyor
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-gray-700">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
