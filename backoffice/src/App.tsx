import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Purchases from './pages/Purchases';
import Leaderboard from './pages/Leaderboard';
import Games from './pages/Games';
import type { Supervisor } from './types/database';
import './index.css';

function App() {
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedSupervisor = localStorage.getItem('supervisor');
    if (savedSupervisor) {
      try {
        setSupervisor(JSON.parse(savedSupervisor));
      } catch {
        localStorage.removeItem('supervisor');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (sup: Supervisor) => {
    setSupervisor(sup);
  };

  const handleLogout = () => {
    localStorage.removeItem('supervisor');
    setSupervisor(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
      </div>
    );
  }

  if (!supervisor) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout username={supervisor.username} onLogout={handleLogout} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/games" element={<Games />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
