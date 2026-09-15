import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import * as store from '../lib/store';
import { generateId } from '../lib/auth';
import { Timer, QuestionMap, AnswerSummary, TestInstructions } from '../components/ui';

export default function TestPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [test, setTest] = useState<ReturnType<typeof store.getTestForStudent> | undefined>(undefined);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuestionMap, setShowQuestionMap] = useState(false);
  const [showAnswerSummary, setShowAnswerSummary] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  // Load test data
  useEffect(() => {
    if (slug) {
      const testData = store.getTestForStudent(slug);
      if (testData) {
        if (user && store.hasUserSubmittedTest(user.id, testData.id)) {
          navigate('/tests');
          return;
        }
        setTest(testData);
        
        // Restore auto-saved progress
        const savedProgress = localStorage.getItem(`test_progress_${testData.id}`);
        if (savedProgress) {
          try {
            const progress = JSON.parse(savedProgress);
            setAnswers(progress.answers || {});
            setFlaggedQuestions(new Set(progress.flaggedQuestions || []));
            setCurrentQuestion(progress.currentQuestion || 0);
          } catch (e) {
            console.error('Failed to restore progress:', e);
          }
        }
      } else {
        navigate('/tests');
      }
    }
  }, [slug, user, navigate]);

  // Auto-save progress
  useEffect(() => {
    if (test && testStarted) {
      const progress = {
        answers,
        flaggedQuestions: Array.from(flaggedQuestions),
        currentQuestion,
        timestamp: Date.now(),
      };
      localStorage.setItem(`test_progress_${test.id}`, JSON.stringify(progress));
    }
  }, [answers, flaggedQuestions, currentQuestion, test, testStarted]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!test || !testStarted || showQuestionMap || showAnswerSummary) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (currentQuestion > 0) {
          setDirection(-1);
          setCurrentQuestion(prev => prev - 1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (currentQuestion < test.questions.length - 1) {
          setDirection(1);
          setCurrentQuestion(prev => prev + 1);
        }
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFlag(currentQuestion);
        break;
      case '1':
      case '2':
      case '3':
      case '4':
        e.preventDefault();
        const optionIndex = parseInt(e.key) - 1;
        if (test && optionIndex < test.questions[currentQuestion].options.length) {
          handleSelectOption(optionIndex);
        }
        break;
    }
  }, [test, currentQuestion, testStarted, showQuestionMap, showAnswerSummary]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
      </div>
    );
  }

  // Show instructions screen
  if (!testStarted) {
    return <TestInstructions test={test} onStart={() => setTestStarted(true)} />;
  }

  const question = test.questions[currentQuestion];
  const totalQuestions = test.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [question.id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setDirection(1);
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const toggleFlag = (questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const fullTest = store.getTestById(test.id);
      if (!fullTest) throw new Error('Test not found');

      const { score, total, percentage } = store.gradeTest(test.id, answers);

      const resultId = generateId();
      store.createResult({
        id: resultId,
        userId: user.id,
        testId: test.id,
        score,
        total,
        percentage,
        answers,
        submittedAt: new Date().toISOString(),
      });

      // Clear auto-saved progress
      localStorage.removeItem(`test_progress_${test.id}`);

      navigate(`/results/${resultId}`);
    } catch {
      alert('An error occurred while submitting. Please try again.');
      setIsSubmitting(false);
      setShowAnswerSummary(false);
    }
  };

  const handleGoToQuestion = (index: number) => {
    setDirection(index > currentQuestion ? 1 : -1);
    setCurrentQuestion(index);
    setShowQuestionMap(false);
    setShowAnswerSummary(false);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-semibold text-stone-900">{test.title}</h1>
              <p className="text-sm text-stone-500">
                Question {currentQuestion + 1} of {totalQuestions}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Timer isRunning={testStarted} />
              <button
                onClick={() => setShowQuestionMap(true)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                title="Question Navigator"
              >
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-stone-700 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sm:p-8 mb-6"
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-medium text-stone-900 flex-1">
                {question.text}
              </h2>
              <button
                onClick={() => toggleFlag(currentQuestion)}
                className={`ml-4 p-2 rounded-lg transition-all ${
                  flaggedQuestions.has(currentQuestion)
                    ? 'bg-amber-100 text-amber-600'
                    : 'hover:bg-stone-100 text-stone-400'
                }`}
                title={flaggedQuestions.has(currentQuestion) ? 'Unflag question' : 'Flag for review'}
              >
                <svg className="w-5 h-5" fill={flaggedQuestions.has(currentQuestion) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = answers[question.id] === index;
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    className={`w-full text-left px-4 py-3.5 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-stone-800 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected ? 'border-stone-800 bg-stone-800' : 'border-stone-300'
                      }`}>
                        {isSelected && (
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                      <span className="text-sm sm:text-base text-stone-900">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="px-4 py-3 text-sm font-medium text-stone-600 border border-stone-200 rounded-lg hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            {currentQuestion === totalQuestions - 1 ? (
              <button
                onClick={() => setShowAnswerSummary(true)}
                className="px-5 py-3 text-sm font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors min-h-[44px]"
              >
                Review & Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-3 text-sm font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors min-h-[44px]"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Quick question nav */}
        <div className="mt-8 flex flex-wrap gap-2">
          {test.questions.map((q, i) => {
            const isAnswered = answers[q.id] !== undefined;
            const isFlagged = flaggedQuestions.has(i);
            const isCurrent = i === currentQuestion;

            let bgColor = 'bg-stone-100 text-stone-400 hover:bg-stone-200';
            if (isCurrent) bgColor = 'bg-stone-800 text-white';
            else if (isFlagged) bgColor = 'bg-amber-500 text-white hover:bg-amber-600';
            else if (isAnswered) bgColor = 'bg-emerald-500 text-white hover:bg-emerald-600';

            return (
              <button
                key={q.id}
                onClick={() => handleGoToQuestion(i)}
                className={`w-10 h-10 sm:w-8 sm:h-8 rounded-lg text-xs font-medium transition-all hover:scale-110 ${bgColor}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Map Modal */}
      <AnimatePresence>
        {showQuestionMap && (
          <QuestionMap
            totalQuestions={totalQuestions}
            currentQuestion={currentQuestion}
            answeredQuestions={new Set(
              test.questions
                .map((q, i) => (answers[q.id] !== undefined ? i : -1))
                .filter(i => i !== -1)
            )}
            flaggedQuestions={flaggedQuestions}
            onQuestionClick={handleGoToQuestion}
            isOpen={showQuestionMap}
            onClose={() => setShowQuestionMap(false)}
          />
        )}
      </AnimatePresence>

      {/* Answer Summary Modal */}
      <AnswerSummary
        test={test}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        onGoToQuestion={handleGoToQuestion}
        isOpen={showAnswerSummary}
        onClose={() => setShowAnswerSummary(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
