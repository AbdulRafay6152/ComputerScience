import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Test, TestResult } from '../../types';
import Badge from './Badge';

interface TestCardProps {
  test: Test;
  result?: TestResult;
  index: number;
}

export default function TestCard({ test, result, index }: TestCardProps) {
  const completed = !!result;
  const progress = completed ? 100 : 0;

  const difficultyColor = {
    'Beginner': 'success' as const,
    'Intermediate': 'warning' as const,
    'Advanced': 'danger' as const,
  };

  return (
    <motion.div
      className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Progress bar at top */}
      <div className="h-1 bg-stone-100">
        <motion.div
          className={`h-full ${completed ? 'bg-emerald-500' : 'bg-stone-300'}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
        />
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-stone-400 font-medium">{test.category}</span>
              <Badge variant={difficultyColor[test.difficulty as keyof typeof difficultyColor]}>
                {test.difficulty}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-stone-900 line-clamp-2">
              {test.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-600 mb-4 line-clamp-2">
          {test.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-stone-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{test.questions.length} questions</span>
          </div>
          {completed && result && (
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-semibold ${
                result.percentage >= 70 ? 'text-emerald-600' :
                result.percentage >= 50 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {result.percentage}%
              </span>
            </div>
          )}
        </div>

        {/* Action */}
        <Link
          to={completed ? `/results/${result?.id}` : `/tests/${test.slug}`}
          className="block w-full"
        >
          <motion.button
            className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
              completed
                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {completed ? 'View Results' : 'Start Test'}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
