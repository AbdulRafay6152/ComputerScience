import { motion } from 'framer-motion';

interface TestInstructionsProps {
  test: any;
  onStart: () => void;
}

export default function TestInstructions({ test, onStart }: TestInstructionsProps) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-700 p-4 sm:p-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                {test.category}
              </span>
              <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                {test.difficulty}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">{test.title}</h1>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-stone-600 mb-6">{test.description}</p>

            {/* Test Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-stone-700">Questions</span>
                </div>
                <p className="text-2xl font-bold text-stone-900">{test.questions.length}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-stone-700">Type</span>
                </div>
                <p className="text-2xl font-bold text-stone-900">MCQ</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-3">Instructions</h3>
              <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Each question has only one correct answer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>You can navigate between questions freely</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Use the flag button to mark questions for review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Your progress is automatically saved</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Review all answers before submitting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>You cannot change answers after submission</span>
                </li>
              </ul>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Keyboard Shortcuts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-800">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded border border-blue-300 font-mono">←</kbd>
                  <span>Previous question</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded border border-blue-300 font-mono">→</kbd>
                  <span>Next question</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded border border-blue-300 font-mono">1-4</kbd>
                  <span>Select answer</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded border border-blue-300 font-mono">F</kbd>
                  <span>Flag question</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200">
          <motion.button
            onClick={onStart}
            className="w-full px-6 py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Start Test
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
