import type { ReactNode } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'gray';
}

const colorClasses = {
    purple: 'from-purple-500 to-indigo-600',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-amber-500',
    pink: 'from-pink-500 to-rose-500',
    gray: 'from-gray-500 to-slate-600',
};

export default function StatsCard({ title, value, icon, trend, color = 'purple' }: StatsCardProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value.toLocaleString('tr-TR')}</p>
                    {trend && (
                        <p className={`mt-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            <span className="ml-1 text-gray-500">bu hafta</span>
                        </p>
                    )}
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
                    {icon}
                </div>
            </div>

            {/* Decorative gradient */}
            <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-br ${colorClasses[color]} opacity-10 blur-2xl`} />
        </div>
    );
}
