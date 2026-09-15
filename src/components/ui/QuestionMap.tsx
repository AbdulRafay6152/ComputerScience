import { motion } from 'framer-motion';

interface QuestionMapProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onQuestionClick: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuestionMap({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  flaggedQuestions,
  onQuestionClick,
  isOpen,
  onClose,
}: QuestionMapProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/40 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed right-0 top-0 bottom-0 w-full sm:w-80 bg-white shadow-2xl z-50 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-stone-900">Question Navigator</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Legend */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-stone-800" />
              <span className="text-stone-600">Current question</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-emerald-500" />
              <span className="text-stone-600">Answered</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-amber-500" />
              <span className="text-stone-600">Flagged for review</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-stone-200" />
              <span className="text-stone-600">Not answered</span>
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: totalQuestions }, (_, i) => {
              const isCurrent = i === currentQuestion;
              const isAnswered = answeredQuestions.has(i);
              const isFlagged = flaggedQuestions.has(i);

              let bgColor = 'bg-stone-200 text-stone-600';
              if (isCurrent) bgColor = 'bg-stone-800 text-white';
              else if (isFlagged) bgColor = 'bg-amber-500 text-white';
              else if (isAnswered) bgColor = 'bg-emerald-500 text-white';

              return (
                <motion.button
                  key={i}
                  onClick={() => {
                    onQuestionClick(i);
                    onClose();
                  }}
                  className={`aspect-square rounded-lg font-medium text-sm ${bgColor} hover:scale-110 transition-transform`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {i + 1}
                  {isFlagged && !isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-stone-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Answered:</span>
              <span className="font-medium text-stone-900">{answeredQuestions.size}/{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Flagged:</span>
              <span className="font-medium text-stone-900">{flaggedQuestions.size}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Remaining:</span>
              <span className="font-medium text-stone-900">{totalQuestions - answeredQuestions.size}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
