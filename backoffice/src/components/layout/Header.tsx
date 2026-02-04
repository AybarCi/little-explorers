import { Bell, Search, Menu } from 'lucide-react';

interface HeaderProps {
    username: string;
    onMenuClick: () => void;
}

export default function Header({ username, onMenuClick }: HeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
            <div className="flex items-center gap-3 md:gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Kullanıcı ara..."
                        className="h-10 w-72 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {/* User */}
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-medium text-white">
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{username}</span>
                </div>
            </div>
        </header>
    );
}
