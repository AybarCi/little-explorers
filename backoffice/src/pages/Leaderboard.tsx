import { useState } from 'react';
import { Trophy, Medal, Award, Star, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { backofficeApi } from '../lib/supabase';

interface LeaderboardUser {
    id: string;
    full_name: string;
    email: string;
    total_points?: number;
    total_score?: number;
}

interface LeaderboardResponse {
    data: LeaderboardUser[];
    count: number;
}

type TabType = 'points' | 'scores';

export default function Leaderboard() {
    const [activeTab, setActiveTab] = useState<TabType>('points');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['leaderboard', activeTab, page],
        queryFn: () => backofficeApi<LeaderboardResponse>('leaderboard', {
            type: activeTab === 'points' ? 'points' : 'score',
            page: page.toString(),
            limit: limit.toString(),
        }),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
    });

    const leaderboardData = data?.data || [];
    const totalCount = data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
            case 2: return <Medal className="h-6 w-6 text-gray-400" />;
            case 3: return <Award className="h-6 w-6 text-amber-600" />;
            default: return <span className="text-sm font-medium text-gray-500">{rank}</span>;
        }
    };

    const getRankBg = (rank: number) => {
        switch (rank) {
            case 1: return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
            case 2: return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
            case 3: return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200';
            default: return 'bg-white border-gray-100';
        }
    };

    const getValue = (user: LeaderboardUser) =>
        activeTab === 'points'
            ? (user.total_points || 0)
            : (user.total_score || 0);

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setPage(1);
    };

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

    // Logic to separate Top 3 for Podium ONLY on first page
    // If page > 1, show normal list only.
    // Actually, traditionally Leaderboards show Podium always on top? No, only for Rank 1-3.
    // If I paginate, Rank 11-20 shouldn't show podium.
    // So distinct behavior for Page 1.
    const showPodium = page === 1 && leaderboardData.length >= 3;
    const listData = showPodium ? leaderboardData.slice(3) : leaderboardData;
    const startRank = showPodium ? 4 : (page - 1) * limit + 1;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Liderlik Tablosu</h1>
                <p className="mt-1 text-gray-500">Kullanıcı sıralamaları</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                <button
                    onClick={() => handleTabChange('points')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'points'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Star className="h-4 w-4" />
                    Puanlar
                </button>
                <button
                    onClick={() => handleTabChange('scores')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'scores'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Target className="h-4 w-4" />
                    Skorlar
                </button>
            </div>

            {/* Top 3 Podium (Only on Page 1) */}
            {showPodium && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* 2nd Place */}
                    <div className="mt-0 md:mt-8 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 p-6 text-center shadow-sm order-2 md:order-1">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-2xl font-bold text-white shadow-lg">
                            {leaderboardData[1]?.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <p className="mt-3 font-semibold text-gray-900">{leaderboardData[1]?.full_name}</p>
                        <p className="text-sm text-gray-500">
                            {activeTab === 'points' ? '⭐' : '🎯'} {getValue(leaderboardData[1]).toLocaleString('tr-TR')}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
                            🥈 2. Sıra
                        </div>
                    </div>

                    {/* 1st Place */}
                    <div className="rounded-2xl bg-gradient-to-b from-yellow-100 to-amber-50 p-6 text-center shadow-lg ring-2 ring-yellow-200 order-1 md:order-2">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-3xl font-bold text-white shadow-lg">
                            {leaderboardData[0]?.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <p className="mt-3 text-lg font-bold text-gray-900">{leaderboardData[0]?.full_name}</p>
                        <p className="text-sm text-gray-600">
                            {activeTab === 'points' ? '⭐' : '🎯'} {getValue(leaderboardData[0]).toLocaleString('tr-TR')}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-yellow-200 px-3 py-1 text-sm font-medium text-yellow-800">
                            🥇 1. Sıra
                        </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="mt-0 md:mt-8 rounded-2xl bg-gradient-to-b from-amber-100 to-orange-50 p-6 text-center shadow-sm order-3 md:order-3">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-2xl font-bold text-white shadow-lg">
                            {leaderboardData[2]?.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <p className="mt-3 font-semibold text-gray-900">{leaderboardData[2]?.full_name}</p>
                        <p className="text-sm text-gray-500">
                            {activeTab === 'points' ? '⭐' : '🎯'} {getValue(leaderboardData[2]).toLocaleString('tr-TR')}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-200 px-3 py-1 text-sm font-medium text-amber-800">
                            🥉 3. Sıra
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">
                        {activeTab === 'points' ? 'Puan Sıralaması' : 'Skor Sıralaması'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {activeTab === 'points'
                            ? 'Oyun ve görev tamamlamadan kazanılan puanlar'
                            : 'Oyunlarda elde edilen performans skorları'}
                    </p>
                </div>
                <div className="divide-y divide-gray-50">
                    {listData.map((user, index) => {
                        const currentRank = startRank + index;
                        return (
                            <div
                                key={user.id}
                                className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50 ${getRankBg(currentRank)} border-l-4`}
                            >
                                <div className="flex h-10 w-10 items-center justify-center">
                                    {getRankIcon(currentRank)}

                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-medium text-white">
                                    {user.full_name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{user.full_name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-purple-600">
                                        {getValue(user).toLocaleString('tr-TR')}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {activeTab === 'points' ? 'puan' : 'skor'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {leaderboardData.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            Kayit bulunamadı
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                    <p className="text-sm text-gray-500">
                        {totalCount} sıradan {(page - 1) * limit + 1}-
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
