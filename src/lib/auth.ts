import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
const LOGIN_ATTEMPTS_KEY = 'csthub_login_attempts';
const SESSION_TIMEOUT_KEY = 'csthub_session_timeout';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true, message: '' };
}

export function validateName(name: string): { valid: boolean; message: string } {
  if (!name.trim()) {
    return { valid: false, message: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  return { valid: true, message: '' };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Login attempt tracking
export function getLoginAttempts(email: string): { count: number; lockedUntil: number | null } {
  const data = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
  const attempts = data ? JSON.parse(data) : {};
  const userAttempts = attempts[email.toLowerCase()] || { count: 0, lockedUntil: null };
  
  // Check if lockout has expired
  if (userAttempts.lockedUntil && Date.now() > userAttempts.lockedUntil) {
    userAttempts.count = 0;
    userAttempts.lockedUntil = null;
  }
  
  return userAttempts;
}

export function incrementLoginAttempts(email: string): void {
  const data = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
  const attempts = data ? JSON.parse(data) : {};
  const key = email.toLowerCase();
  
  if (!attempts[key]) {
    attempts[key] = { count: 0, lockedUntil: null };
  }
  
  attempts[key].count++;
  
  // Lock account if max attempts reached
  if (attempts[key].count >= MAX_LOGIN_ATTEMPTS) {
    attempts[key].lockedUntil = Date.now() + LOCKOUT_DURATION;
  }
  
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
}

export function resetLoginAttempts(email: string): void {
  const data = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
  const attempts = data ? JSON.parse(data) : {};
  delete attempts[email.toLowerCase()];
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
}

export function isAccountLocked(email: string): { locked: boolean; remainingTime?: number } {
  const { lockedUntil } = getLoginAttempts(email);
  
  if (!lockedUntil) {
    return { locked: false };
  }
  
  const remaining = lockedUntil - Date.now();
  if (remaining <= 0) {
    return { locked: false };
  }
  
  return { locked: true, remainingTime: remaining };
}

// Session timeout management
export function setSessionTimeout(): void {
  const timeout = Date.now() + SESSION_DURATION;
  localStorage.setItem(SESSION_TIMEOUT_KEY, timeout.toString());
}

export function getSessionTimeout(): number | null {
  const timeout = localStorage.getItem(SESSION_TIMEOUT_KEY);
  return timeout ? parseInt(timeout, 10) : null;
}

export function isSessionExpired(): boolean {
  const timeout = getSessionTimeout();
  if (!timeout) return false;
  return Date.now() > timeout;
}

export function refreshSessionTimeout(): void {
  if (getSessionTimeout()) {
    setSessionTimeout();
  }
}

export function clearSessionTimeout(): void {
  localStorage.removeItem(SESSION_TIMEOUT_KEY);
}

export function getRemainingSessionTime(): number {
  const timeout = getSessionTimeout();
  if (!timeout) return 0;
  return Math.max(0, timeout - Date.now());
}
