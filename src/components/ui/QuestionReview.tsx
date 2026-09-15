import { motion } from 'framer-motion';
import { useState } from 'react';

interface QuestionReviewProps {
  questions: any[];
  answers: Record<string, number>;
  index: number;
}

export default function QuestionReview({ questions, answers, index }: QuestionReviewProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="bg-white border border-stone-200 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 sm:p-5 flex items-start gap-3 hover:bg-stone-50 transition-colors text-left"
      >
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            answers[questions[index].id] === questions[index].correctAnswer
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {answers[questions[index].id] === questions[index].correctAnswer ? '✓' : '✗'}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-stone-400">Q{index + 1}</span>
          </div>
          <p className="text-sm sm:text-base font-medium text-stone-900 line-clamp-2">
            {questions[index].text}
          </p>
        </div>
        <motion.div
          className="flex-shrink-0 mt-1"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-stone-100 pt-4">
          {/* Options */}
          <div className="space-y-2">
            {questions[index].options.map((option: string, optIdx: number) => {
              const isCorrect = questions[index].correctAnswer === optIdx;
              const isUserAnswer = answers[questions[index].id] === optIdx;
              const wasAnswered = answers[questions[index].id] !== undefined;

              let bgColor = 'bg-stone-50 border-stone-200';
              let textColor = 'text-stone-700';
              let icon = null;

              if (isCorrect) {
                bgColor = 'bg-emerald-50 border-emerald-300';
                textColor = 'text-emerald-900';
                icon = <span className="text-xs font-medium text-emerald-600 ml-auto">✓ Correct</span>;
              } else if (isUserAnswer && !isCorrect) {
                bgColor = 'bg-red-50 border-red-300';
                textColor = 'text-red-900';
                icon = <span className="text-xs font-medium text-red-600 ml-auto">✗ Your answer</span>;
              }

              return (
                <div
                  key={optIdx}
                  className={`p-3 rounded-lg border ${bgColor} ${textColor} text-sm flex items-center`}
                >
                  <span className="flex-1">{option}</span>
                  {icon}
                </div>
              );
            })}
            {answers[questions[index].id] === undefined && (
              <p className="text-xs text-stone-500 italic">Not answered</p>
            )}
          </div>

          {/* Explanation */}
          {questions[index].explanation && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-medium text-blue-900 mb-1">💡 Explanation</p>
              <p className="text-sm text-blue-800">{questions[index].explanation}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
