import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { validateEmail, isAccountLocked } from '../lib/auth';
import { Button, Input, PasswordInput } from '../components/ui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check lockout status
  useEffect(() => {
    if (email) {
      const lockStatus = isAccountLocked(email);
      if (lockStatus.locked && lockStatus.remainingTime) {
        setLockoutTime(lockStatus.remainingTime);
      } else {
        setLockoutTime(null);
      }
    }
  }, [email]);

  // Countdown for lockout
  useEffect(() => {
    if (!lockoutTime) return;

    const interval = setInterval(() => {
      setLockoutTime(prev => {
        if (!prev || prev <= 1000) {
          clearInterval(interval);
          return null;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTime]);

  const formatLockoutTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if account is locked
    const lockStatus = isAccountLocked(email);
    if (lockStatus.locked) {
      setError(`Account temporarily locked. Please try again in ${formatLockoutTime(lockStatus.remainingTime || 0)}.`);
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        const session = localStorage.getItem('csthub_session');
        if (session) {
          const users = JSON.parse(localStorage.getItem('csthub_users') || '[]');
          const user = users.find((u: any) => u.id === session);
          if (user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/tests');
          }
        }
      } else {
        if (result.lockedUntil) {
          setLockoutTime(result.lockedUntil);
        }
        setError(result.error || 'Login failed');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-stone-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60 float-shape" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-stone-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-40 float-shape-delayed" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-stone-50 rounded-full opacity-30 float-shape" style={{ animationDelay: '-2s' }} />
      
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-14 h-14 bg-stone-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-white text-xl font-bold">CS</span>
          </div>
          <h1 className="text-3xl font-semibold text-stone-900 mb-2">Welcome back</h1>
          <p className="text-stone-500">Sign in to access your tests</p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {error && (
            <motion.div
              className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-stone-800 focus:ring-stone-800 transition-colors"
                />
                <span className="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">
                  Remember me
                </span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-6"
            size="lg"
            disabled={lockoutTime !== null}
          >
            {isLoading ? 'Signing in...' : lockoutTime ? `Locked (${formatLockoutTime(lockoutTime)})` : 'Sign in'}
          </Button>
        </motion.form>

        {/* Footer */}
        <motion.p
          className="text-center mt-6 text-sm text-stone-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-stone-800 font-medium hover:underline transition-colors duration-300">
            Create one
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
