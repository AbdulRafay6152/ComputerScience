import { motion } from 'framer-motion';

interface ScoreRingProps {
  percentage: number;
  score: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
}

export default function ScoreRing({ percentage, score, total, size = 'lg', delay = 0 }: ScoreRingProps) {
  const sizes = {
    sm: { container: 120, stroke: 8, text: 'text-2xl' },
    md: { container: 160, stroke: 10, text: 'text-3xl' },
    lg: { container: 200, stroke: 12, text: 'text-4xl' },
  };

  const { container, stroke, text } = sizes[size];
  const radius = (container - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 80) return { stroke: '#10b981', bg: '#d1fae5', text: '#065f46' };
    if (percentage >= 60) return { stroke: '#f59e0b', bg: '#fef3c7', text: '#92400e' };
    if (percentage >= 40) return { stroke: '#f97316', bg: '#fed7aa', text: '#9a3412' };
    return { stroke: '#ef4444', bg: '#fee2e2', text: '#991b1b' };
  };

  const colors = getColor();

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: container, height: container }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg width={container} height={container} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          stroke="#e7e5e4"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay: delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className={`${text} font-bold`}
          style={{ color: colors.text }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.8 }}
        >
          {percentage}%
        </motion.div>
        <motion.div
          className="text-sm text-stone-500 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 1 }}
        >
          {score}/{total}
        </motion.div>
      </div>
    </motion.div>
  );
}
