import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as store from '../../lib/store';
import { ScoreRing, Badge } from '../../components/ui';

export default function AdminResultDetail() {
  const { resultId } = useParams<{ resultId: string }>();
  const result = resultId ? store.getResultById(resultId) : undefined;
  const test = result ? store.getTestById(result.testId) : undefined;
  const student = result ? store.getUserById(result.userId) : undefined;

  if (!result || !test || !student) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Result Not Found</h2>
          <p className="text-stone-600 mb-6">The test result you're looking for doesn't exist.</p>
          <Link to="/admin" className="text-stone-800 font-medium hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={`/admin/students/${student.id}`} className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
            ← Back to {student.name}
          </Link>
          <h1 className="text-3xl font-bold text-stone-900 mt-4">Test Result Details</h1>
          <p className="text-stone-600 mt-1">{test.title}</p>
        </motion.div>

        {/* Student Info */}
        <motion.div
          className="bg-white border border-stone-200 rounded-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-stone-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-stone-600">
                {student.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-900">{student.name}</h2>
              <p className="text-stone-600">{student.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Score Overview */}
        <motion.div
          className="bg-white border border-stone-200 rounded-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing
              percentage={result.percentage}
              score={result.score}
              total={result.total}
              size="md"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-4">
                <Badge variant={
                  result.percentage >= 80 ? 'success' :
                  result.percentage >= 60 ? 'warning' : 'danger'
                }>
                  {result.percentage >= 80 ? 'Excellent' :
                   result.percentage >= 60 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-stone-500">Correct Answers</p>
                  <p className="text-2xl font-bold text-emerald-600">{result.score}</p>
                </div>
                <div>
                  <p className="text-stone-500">Incorrect Answers</p>
                  <p className="text-2xl font-bold text-red-600">{result.total - result.score}</p>
                </div>
                <div>
                  <p className="text-stone-500">Total Questions</p>
                  <p className="text-2xl font-bold text-stone-900">{result.total}</p>
                </div>
                <div>
                  <p className="text-stone-500">Submitted</p>
                  <p className="text-sm font-medium text-stone-900">
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-stone-500">
                    {new Date(result.submittedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Question Review */}
        <motion.div
          className="bg-white border border-stone-200 rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900">Question Review</h2>
            <p className="text-sm text-stone-500 mt-1">Detailed breakdown of answers</p>
          </div>

          <div className="divide-y divide-stone-100">
            {test.questions.map((question, index) => {
              const userAnswer = result.answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              const wasAnswered = userAnswer !== undefined;

              return (
                <motion.div
                  key={question.id}
                  className="p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-400 mb-1">Question {index + 1}</p>
                      <p className="text-stone-900 font-medium">{question.text}</p>
                    </div>
                  </div>

                  <div className="ml-11 space-y-2">
                    {question.options.map((option, optIndex) => {
                      const isUserAnswer = userAnswer === optIndex;
                      const isCorrectAnswer = question.correctAnswer === optIndex;

                      let bgColor = 'bg-stone-50';
                      let borderColor = 'border-stone-200';
                      let textColor = 'text-stone-700';

                      if (isCorrectAnswer) {
                        bgColor = 'bg-emerald-50';
                        borderColor = 'border-emerald-300';
                        textColor = 'text-emerald-900';
                      } else if (isUserAnswer && !isCorrect) {
                        bgColor = 'bg-red-50';
                        borderColor = 'border-red-300';
                        textColor = 'text-red-900';
                      }

                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border ${bgColor} ${borderColor} ${textColor} text-sm`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {isCorrectAnswer && (
                              <span className="text-xs font-medium text-emerald-600">✓ Correct</span>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <span className="text-xs font-medium text-red-600">✗ Selected</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {!wasAnswered && (
                      <p className="text-xs text-stone-500 italic">Not answered</p>
                    )}
                  </div>

                  {question.explanation && (
                    <div className="ml-11 mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs font-medium text-blue-900 mb-1">💡 Explanation</p>
                      <p className="text-sm text-blue-800">{question.explanation}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
