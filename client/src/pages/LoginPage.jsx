import React, { useState } from 'react';

const API_BASE = 'http://localhost:8000';

const LoginPage = ({ onLogin }) => {
    const [form, setForm] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            setError('Please enter username and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await res.json();

            // Save token (optional)
            localStorage.setItem('token', data.access_token);

            // Notify parent (App.jsx)
            onLogin?.(data);

        } catch (err) {
            console.error(err);
            setError('Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    Login
                </h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-slate-300 text-sm mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring focus:ring-blue-500"
                            placeholder="Enter your username"
                            autoComplete="username"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-slate-300 text-sm mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring focus:ring-blue-500"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg font-semibold transition ${loading
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;