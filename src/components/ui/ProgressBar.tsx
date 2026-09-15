import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-stone-600">
            {value} / {max}
          </span>
          <span className="text-xs font-medium text-stone-600">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-stone-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full bg-stone-700 rounded-full progress-bar`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
