import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Diamond, Smartphone, Apple, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { backofficeApi } from '../lib/supabase';

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
    user: {
        id: string;
        full_name: string | null;
        email: string;
    } | null;
}

interface PurchaseStats {
    total: number;
    totalDiamonds: number;
    totalRevenue: number;
    iosPurchases: number;
    androidPurchases: number;
}

interface PurchasesResponse {
    purchases: DiamondPurchase[];
    count: number;
    stats: PurchaseStats;
}

export default function Purchases() {
    // Filters
    const [platformFilter, setPlatformFilter] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [page, setPage] = useState(1);
    const limit = 10;

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [platformFilter, startDate, endDate]);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['purchases', page, limit, platformFilter, startDate, endDate],
        queryFn: () => {
            const params: any = {
                page: page.toString(),
                limit: limit.toString(),
            };
            if (platformFilter) params.platform = platformFilter;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            return backofficeApi<PurchasesResponse>('purchases', params);
        },
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
    });

    const purchases = data?.purchases || [];
    const stats = data?.stats || null;
    const totalCount = data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const clearFilters = () => {
        setPlatformFilter('');
        setStartDate('');
        setEndDate('');
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
                <button onClick={() => refetch()} className="text-purple-600 hover:underline">
                    Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Satın Almalar</h1>
                    <p className="text-gray-500">Tüm elmas satın alma işlemleri</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                >
                    <RefreshCw className="h-4 w-4" />
                    Yenile
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2">
                                <CreditCard className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-xs text-gray-500">Toplam Satış</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <Diamond className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalDiamonds.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Toplam Elmas</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2">
                                <span className="text-lg">💰</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">Toplam Gelir</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gray-100 p-2">
                                <Apple className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.iosPurchases}</p>
                                <p className="text-xs text-gray-500">iOS Satışları</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2">
                                <Smartphone className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.androidPurchases}</p>
                                <p className="text-xs text-gray-500">Android Satışları</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Filtreler:</span>
                    </div>
                    <select
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                    >
                        <option value="">Tüm Platformlar</option>
                        <option value="ios">iOS</option>
                        <option value="android">Android</option>
                    </select>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                        placeholder="Başlangıç"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                        placeholder="Bitiş"
                    />
                    <button
                        onClick={clearFilters}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Temizle
                    </button>
                </div>
            </div>

            {/* Purchases Table */}
            <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Kullanıcı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Paket
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Elmas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Fiyat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Platform
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Tarih
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {purchases.map((purchase) => (
                                <tr key={purchase.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/users/${purchase.user_id}`}
                                            className="flex items-center gap-2 hover:text-purple-600"
                                        >
                                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-600">
                                                {purchase.user?.full_name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {purchase.user?.full_name || 'Bilinmeyen'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {purchase.user?.email || '-'}
                                                </p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                            {purchase.product_id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg">💎</span>
                                            <span className="font-medium text-gray-900">
                                                +{purchase.diamond_amount}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-green-600">
                                            {purchase.price_amount
                                                ? `${purchase.price_amount} ${purchase.price_currency || ''}`
                                                : '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${purchase.platform === 'ios'
                                                ? 'bg-gray-100 text-gray-700'
                                                : 'bg-green-100 text-green-700'
                                                }`}
                                        >
                                            {purchase.platform === 'ios' ? '🍎 iOS' : '🤖 Android'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(purchase.created_at).toLocaleDateString('tr-TR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                </tr>
                            ))}
                            {purchases.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Henüz satın alma kaydı yok
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                    <p className="text-sm text-gray-500">
                        {totalCount} işlemden {(page - 1) * limit + 1}-
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
