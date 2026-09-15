import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRemainingSessionTime } from '../lib/auth';
import { Modal, Button } from './ui';

const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry

export default function SessionTimeout() {
  const { logout, refreshSession, user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      const remaining = getRemainingSessionTime();
      setRemainingTime(remaining);

      if (remaining <= 0) {
        logout();
      } else if (remaining <= WARNING_TIME && !showWarning) {
        setShowWarning(true);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, logout, showWarning]);

  const handleExtend = () => {
    refreshSession();
    setShowWarning(false);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <Modal
      isOpen={showWarning}
      onClose={() => {}}
      title="Session Expiring Soon"
    >
      <p className="text-sm text-stone-600 mb-4">
        Your session will expire in <span className="font-semibold text-stone-900">{formatTime(remainingTime)}</span>.
        Would you like to extend it?
      </p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={logout}
          className="flex-1"
        >
          Logout
        </Button>
        <Button
          onClick={handleExtend}
          className="flex-1"
        >
          Extend Session
        </Button>
      </div>
    </Modal>
  );
}
