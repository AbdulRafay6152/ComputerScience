import { motion, AnimatePresence } from 'framer-motion';

interface AnswerSummaryProps {
  test: any;
  answers: Record<string, number>;
  flaggedQuestions: Set<number>;
  onGoToQuestion: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function AnswerSummary({
  test,
  answers,
  flaggedQuestions,
  onGoToQuestion,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AnswerSummaryProps) {
  if (!isOpen) return null;

  const totalQuestions = test.questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-stone-900">Review Your Answers</h3>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      {answeredCount} of {totalQuestions} questions answered
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Warning if unanswered */}
                {unansweredCount > 0 && (
                  <motion.div
                    className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-amber-900">
                          You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Unanswered questions will be marked as incorrect.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Flagged questions */}
                {flaggedQuestions.size > 0 && (
                  <motion.div
                    className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {flaggedQuestions.size} question{flaggedQuestions.size !== 1 ? 's' : ''} flagged for review
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Review your flagged questions before submitting.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Questions List */}
                <div className="space-y-3">
                  {test.questions.map((question: any, index: number) => {
                    const answer = answers[question.id];
                    const isAnswered = answer !== undefined;
                    const isFlagged = flaggedQuestions.has(index);

                    return (
                      <motion.div
                        key={question.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isFlagged
                            ? 'border-blue-300 bg-blue-50'
                            : isAnswered
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-stone-200 bg-stone-50'
                        } hover:shadow-md`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => onGoToQuestion(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                              isFlagged
                                ? 'bg-blue-500 text-white'
                                : isAnswered
                                ? 'bg-emerald-500 text-white'
                                : 'bg-stone-300 text-stone-600'
                            }`}>
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 line-clamp-2">
                              {question.text}
                            </p>
                            {isAnswered && (
                              <p className="text-xs text-stone-600 mt-1">
                                Your answer: {question.options[answer]}
                              </p>
                            )}
                            {!isAnswered && (
                              <p className="text-xs text-stone-500 mt-1 italic">
                                Not answered
                              </p>
                            )}
                            {isFlagged && (
                              <p className="text-xs text-blue-600 mt-1 font-medium">
                                🚩 Flagged for review
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-100 transition-colors min-h-[44px]"
                  >
                    Back to Test
                  </button>
                  <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Test'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
