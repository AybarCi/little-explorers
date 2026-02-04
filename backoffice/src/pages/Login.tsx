import { useState } from 'react';
import { Lock, User, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Supervisor } from '../types/database';

interface LoginProps {
    onLogin: (supervisor: Supervisor) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Check supervisor credentials
            const { data, error: queryError } = await supabase
                .from('supervisors')
                .select('*')
                .eq('username', username)
                .eq('is_active', true)
                .single();

            if (queryError || !data) {
                setError('Kullanıcı adı veya şifre hatalı');
                setIsLoading(false);
                return;
            }

            // Simple password check (in production, use proper hashing)
            if (data.password_hash !== password) {
                setError('Kullanıcı adı veya şifre hatalı');
                setIsLoading(false);
                return;
            }

            // Save to localStorage
            localStorage.setItem('supervisor', JSON.stringify(data));
            onLogin(data);
        } catch {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md px-4">
                <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-xl">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 p-2">
                            <img src="/logo.png" alt="Küçük Kaşif" className="h-full w-full object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Küçük Kaşif</h1>
                        <p className="mt-1 text-purple-200">Admin Panel</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-500/20 p-3 text-sm text-red-200">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-purple-200">
                                Kullanıcı Adı
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-300" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="h-12 w-full rounded-lg border border-white/20 bg-white/10 pl-11 pr-4 text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                                    placeholder="admin"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-purple-200">
                                Şifre
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-300" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 w-full rounded-lg border border-white/20 bg-white/10 pl-11 pr-4 text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 font-semibold text-white transition-all duration-300 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                'Giriş Yap'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
