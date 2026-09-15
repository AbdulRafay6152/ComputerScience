import { motion } from 'framer-motion';

interface PerformanceBreakdownProps {
  score: number;
  total: number;
  percentage: number;
  timeTaken?: number; // in seconds
}

export default function PerformanceBreakdown({ score, total, percentage, timeTaken }: PerformanceBreakdownProps) {
  const incorrect = total - score;
  const avgTimePerQuestion = timeTaken ? Math.round(timeTaken / total) : 0;

  const stats = [
    {
      label: 'Correct',
      value: score,
      icon: '✓',
      color: 'emerald',
      delay: 0.2,
    },
    {
      label: 'Incorrect',
      value: incorrect,
      icon: '✗',
      color: 'red',
      delay: 0.3,
    },
    {
      label: 'Accuracy',
      value: `${percentage}%`,
      icon: '◎',
      color: 'blue',
      delay: 0.4,
    },
    {
      label: 'Avg Time',
      value: avgTimePerQuestion ? `${avgTimePerQuestion}s` : '—',
      icon: '⏱',
      color: 'amber',
      delay: 0.5,
    },
  ];

  const colorClasses = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={`p-4 rounded-xl border-2 ${colorClasses[stat.color as keyof typeof colorClasses]}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: stat.delay, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.05, y: -4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <div className="text-2xl font-bold mb-1">{stat.value}</div>
          <div className="text-xs font-medium opacity-80">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
