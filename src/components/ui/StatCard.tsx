import { motion } from 'framer-motion';
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'stone' | 'emerald' | 'amber' | 'blue' | 'purple' | 'green';
  delay?: number;
}

export default function StatCard({ 
  label, 
  value, 
  icon, 
  trend,
  color = 'stone',
  delay = 0 
}: StatCardProps) {
  const colors = {
    stone: 'from-stone-50 to-white border-stone-200',
    emerald: 'from-emerald-50 to-white border-emerald-200',
    amber: 'from-amber-50 to-white border-amber-200',
    blue: 'from-blue-50 to-white border-blue-200',
    purple: 'from-purple-50 to-white border-purple-200',
    green: 'from-green-50 to-white border-green-200',
  };

  const iconColors = {
    stone: 'text-stone-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
  };

  return (
    <motion.div
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4 sm:p-5`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs sm:text-sm text-stone-500 font-medium">{label}</p>
        {icon && (
          <div className={`${iconColors[color]} opacity-60`}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-stone-900">{value}</p>
      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <span className={`text-xs font-medium ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-stone-400">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}
