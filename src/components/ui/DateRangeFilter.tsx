import { useState } from 'react';
import { motion } from 'framer-motion';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onReset?: () => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    onStartDateChange('');
    onEndDateChange('');
    if (onReset) onReset();
  };

  const hasFilters = startDate || endDate;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
          hasFilters
            ? 'bg-stone-800 text-white'
            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {hasFilters ? 'Date Range Set' : 'Filter by Date'}
        {hasFilters && (
          <span className="w-2 h-2 bg-emerald-400 rounded-full" />
        )}
      </motion.button>

      {isOpen && (
        <motion.div
          className="absolute top-full mt-2 right-0 bg-white border border-stone-200 rounded-xl shadow-lg p-4 z-50 min-w-[280px]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-800"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleReset}
                disabled={!hasFilters}
                className="flex-1 px-3 py-2 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 text-sm font-medium bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
