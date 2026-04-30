'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowRightLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.replace('/dashboard');
    } else {
      setError(result.error ?? 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f1f5f9]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-[#0f1d35] text-white p-10">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white leading-none">TransferIQ</p>
              <p className="text-xs text-blue-300">Call Transfer Analytics</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3 leading-snug">
            Smarter transfer management for your team.
          </h2>
          <p className="text-blue-200/70 text-sm leading-relaxed">
            Log, track, and reduce unnecessary call transfers with real-time analytics, coaching insights, and team performance dashboards.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { stat: '1,248', label: 'Transfers tracked this week' },
            { stat: '86', label: 'Transfers flagged & resolved' },
            { stat: '14', label: 'Agents supported via coaching' },
          ].map((item) => (
            <div key={item.stat} className="flex items-center gap-4">
              <span className="text-2xl font-bold text-blue-400">{item.stat}</span>
              <span className="text-sm text-blue-200/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">TransferIQ</span>
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in</h1>
            <p className="text-sm text-gray-500 mb-6">Welcome back. Sign in to your account.</p>

            {/* Demo hint */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 text-xs text-blue-700 space-y-1">
              <p className="font-semibold">Demo credentials:</p>
              <p><strong>Manager:</strong> alex.carter@transferiq.internal / manager123</p>
              <p><strong>Agent:</strong> jessica.lee@transferiq.internal / agent123</p>
              <p><strong>Admin:</strong> admin@transferiq.internal / admin123</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email"
                type="email"
                placeholder="you@transferiq.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
                  {error}
                </p>
              )}

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Sign in
              </Button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              Internal use only. All sessions are logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
