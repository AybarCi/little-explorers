import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Trophy,
    Gamepad2,
    CreditCard,
    LogOut,
    X
} from 'lucide-react';

const navigation = [
    { name: 'Panel', href: '/', icon: LayoutDashboard },
    { name: 'Kullanıcılar', href: '/users', icon: Users },
    { name: 'Satın Almalar', href: '/purchases', icon: CreditCard },
    { name: 'Liderlik Tablosu', href: '/leaderboard', icon: Trophy },
    { name: 'Oyunlar', href: '/games', icon: Gamepad2 },
];

interface SidebarProps {
    onLogout: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ onLogout, isOpen, onClose }: SidebarProps) {
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <div className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col bg-gradient-to-b from-purple-900 to-indigo-900 transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-purple-700/50 px-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Küçük Kaşif" className="h-8 w-8 object-contain" />
                        <span className="text-lg font-bold text-white">Küçük Kaşif</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-purple-200 hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => onClose()}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-white/20 text-white shadow-lg'
                                    : 'text-purple-200 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="border-t border-purple-700/50 p-3">
                    <button
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-purple-200 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
                    >
                        <LogOut className="h-5 w-5" />
                        Çıkış Yap
                    </button>
                </div>
            </div>
        </>
    );
}
