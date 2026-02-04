import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
    username: string;
    onLogout: () => void;
}

export default function DashboardLayout({ username, onLogout }: DashboardLayoutProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    username={username}
                    onMenuClick={() => setSidebarOpen(true)}
                />
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
