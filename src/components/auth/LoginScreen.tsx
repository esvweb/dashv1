import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
    onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'dash') {
            onLogin();
        } else {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className={`bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${shake ? 'animate-shake' : ''}`}>
                <div className="p-8 pb-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} />
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Executive Access</h1>
                        <p className="text-slate-500 text-sm">Please enter your secure access key to view the dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(false);
                                    }}
                                    className={`w-full pl-4 pr-4 py-3 bg-slate-50 border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'} rounded-xl outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700`}
                                    placeholder="Enter access key..."
                                    autoFocus
                                />
                            </div>
                            {error && <p className="text-red-500 text-xs font-medium mt-2 pl-1 flex items-center gap-1">Invalid access key</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-200"
                        >
                            <span>Access Dashboard</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
                <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                        <ShieldCheck size={14} />
                        <span>Secure Enterprise Environment</span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    50% { transform: translateX(5px); }
                    75% { transform: translateX(-5px); }
                }
                .animate-shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
};
