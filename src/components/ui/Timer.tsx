import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  isRunning: boolean;
  className?: string;
}

export default function Timer({ isRunning, className = '' }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-lg ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-2 h-2 rounded-full bg-emerald-500"
        animate={{ 
          scale: isRunning ? [1, 1.2, 1] : 1,
          opacity: isRunning ? [1, 0.6, 1] : 0.5
        }}
        transition={{ 
          duration: 1.5,
          repeat: isRunning ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      <span className="text-sm font-mono font-medium text-stone-700">
        {formatTime(seconds)}
      </span>
    </motion.div>
  );
}
