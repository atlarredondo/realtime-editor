import React, {useState} from 'react';
import {api} from './lib/api';


export const AuthPage = ({ mode }: { mode: 'login' | 'signup' }) => {
    // 1. State handling same as your original code
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 2. Submission logic same as your original code
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const endpoint = mode === 'login' ? '/login' : '/signup';

        try {
            const res = await api(endpoint, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                window.location.href = '/projects';
            } else {
                alert(`${mode} failed: Invalid credentials or server error`);
            }
        } catch (error) {
            alert("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 capitalize tracking-tight">
                        {mode}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {mode === 'login' ? 'Welcome back! Enter your details.' : 'Join us today! Create your account.'}
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="name@company.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        className={`w-full py-3.5 rounded-xl font-bold text-black shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] ${
                            isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo hover:bg-indigo-700'
                        }`}
                    >
                        {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <a
                        href={mode === 'login' ? "/signup" : "/login"}
                        className="ml-1 text-indigo-600 font-bold hover:underline"
                    >
                        {mode === 'login' ? "Sign up" : "Log in"}
                    </a>
                </div>
            </div>
        </div>
    );
};