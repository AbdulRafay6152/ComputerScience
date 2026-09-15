import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import * as store from '../lib/store';
import { 
  hashPassword, 
  verifyPassword, 
  generateId,
  incrementLoginAttempts,
  resetLoginAttempts,
  isAccountLocked,
  setSessionTimeout,
  clearSessionTimeout,
  refreshSessionTimeout,
  isSessionExpired
} from '../lib/auth';

interface AuthContextType {
  user: Omit<User, 'passwordHash'> | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; lockedUntil?: number }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'passwordHash'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for data initialization
    store.dataReady.then(() => {
      const sessionId = store.getSession();
      
      // Check if session is expired
      if (sessionId && isSessionExpired()) {
        store.clearSession();
        clearSessionTimeout();
        setIsLoading(false);
        return;
      }
      
      if (sessionId) {
        const found = store.getUserById(sessionId);
        if (found) {
          const { passwordHash: _, ...safeUser } = found;
          setUser(safeUser);
          refreshSessionTimeout();
        } else {
          store.clearSession();
          clearSessionTimeout();
        }
      }
      setIsLoading(false);
    });
  }, []);

  // Listen for storage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'csthub_session') {
        if (!e.newValue) {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    // Check if account is locked
    const lockStatus = isAccountLocked(email);
    if (lockStatus.locked) {
      return { 
        success: false, 
        error: 'Too many failed attempts. Please try again later.',
        lockedUntil: lockStatus.remainingTime
      };
    }

    const found = store.getUserByEmail(email);
    if (!found) {
      incrementLoginAttempts(email);
      return { success: false, error: 'Invalid email or password' };
    }

    const valid = await verifyPassword(password, found.passwordHash);
    if (!valid) {
      incrementLoginAttempts(email);
      
      // Check if account is now locked after this attempt
      const updatedLockStatus = isAccountLocked(email);
      if (updatedLockStatus.locked) {
        return { 
          success: false, 
          error: 'Account temporarily locked. Please try again in 15 minutes.',
          lockedUntil: updatedLockStatus.remainingTime || 15 * 60 * 1000
        };
      }
      
      return { success: false, error: 'Invalid email or password' };
    }

    // Successful login
    resetLoginAttempts(email);
    store.setSession(found.id);
    setSessionTimeout();
    
    const { passwordHash: _, ...safeUser } = found;
    setUser(safeUser);
    return { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const existing = store.getUserByEmail(email);
    if (existing) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    store.createUser(newUser);
    store.setSession(newUser.id);
    setSessionTimeout();
    
    const { passwordHash: _, ...safeUser } = newUser;
    setUser(safeUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    store.clearSession();
    clearSessionTimeout();
    setUser(null);
  }, []);

  const refreshSession = useCallback(() => {
    refreshSessionTimeout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
