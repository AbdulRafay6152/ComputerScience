import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateName } from '../lib/auth';
import { Button, Input, PasswordInput } from '../components/ui';
import PasswordRequirements from '../components/ui/PasswordRequirements';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Real-time validation
  const validateField = (field: string, value: string) => {
    const errors = { ...fieldErrors };
    
    switch (field) {
      case 'name':
        const nameCheck = validateName(value);
        if (!nameCheck.valid) {
          errors.name = nameCheck.message;
        } else {
          delete errors.name;
        }
        break;
      case 'email':
        if (value && !validateEmail(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        const passCheck = validatePassword(value);
        if (!passCheck.valid) {
          errors.password = passCheck.message;
        } else {
          delete errors.password;
        }
        // Also check confirm password if it has a value
        if (confirmPassword && value !== confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        } else if (confirmPassword) {
          delete errors.confirmPassword;
        }
        break;
      case 'confirmPassword':
        if (value !== password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;
    }
    
    setFieldErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Final validation
    const nameCheck = validateName(name);
    if (!nameCheck.valid) {
      setFieldErrors(prev => ({ ...prev, name: nameCheck.message }));
      return;
    }

    if (!validateEmail(email)) {
      setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    const passCheck = validatePassword(password);
    if (!passCheck.valid) {
      setFieldErrors(prev => ({ ...prev, password: passCheck.message }));
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/tests');
      } else {
        setError(result.error || 'Registration failed');
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
          <h1 className="text-3xl font-semibold text-stone-900 mb-2">Create your account</h1>
          <p className="text-stone-500">Start taking tests in minutes</p>
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
              id="name"
              type="text"
              label="Full Name"
              value={name}
              onChange={e => {
                setName(e.target.value);
                validateField('name', e.target.value);
              }}
              onBlur={e => validateField('name', e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              error={fieldErrors.name}
            />

            <Input
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                validateField('email', e.target.value);
              }}
              onBlur={e => validateField('email', e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              error={fieldErrors.email}
            />

            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                validateField('password', e.target.value);
              }}
              onBlur={e => validateField('password', e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              error={fieldErrors.password}
              showStrength={true}
            />
            <PasswordRequirements password={password} />

            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value);
                validateField('confirmPassword', e.target.value);
              }}
              onBlur={e => validateField('confirmPassword', e.target.value)}
              placeholder="Re-enter password"
              autoComplete="new-password"
              error={fieldErrors.confirmPassword}
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-6"
            size="lg"
            disabled={Object.keys(fieldErrors).length > 0}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </motion.form>

        {/* Footer */}
        <motion.p
          className="text-center mt-6 text-sm text-stone-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Already have an account?{' '}
          <Link to="/login" className="text-stone-800 font-medium hover:underline transition-colors duration-300">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
