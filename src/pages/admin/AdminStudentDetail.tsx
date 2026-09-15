import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as store from '../../lib/store';
import { PerformanceTrend, ScoreDistribution, Badge } from '../../components/ui';

export default function AdminStudentDetail() {
  const { studentId } = useParams<{ studentId: string }>();
  const student = studentId ? store.getUserById(studentId) : undefined;
  const allResults = store.getResults();
  const tests = store.getTests();

  if (!student) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Student Not Found</h2>
          <p className="text-stone-600 mb-6">The student you're looking for doesn't exist.</p>
          <Link to="/admin/students" className="text-stone-800 font-medium hover:underline">
            ← Back to Students
          </Link>
        </div>
      </div>
    );
  }

  // Get student's results
  const studentResults = allResults
    .filter(r => r.userId === student.id)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  // Calculate metrics
  const totalTests = studentResults.length;
  const avgScore = totalTests > 0
    ? Math.round(studentResults.reduce((sum, r) => sum + r.percentage, 0) / totalTests)
    : 0;
  const bestScore = totalTests > 0 ? Math.max(...studentResults.map(r => r.percentage)) : 0;
  const worstScore = totalTests > 0 ? Math.min(...studentResults.map(r => r.percentage)) : 0;

  // Prepare trend data
  const trendData = studentResults.map(r => {
    const test = tests.find(t => t.id === r.testId);
    return {
      date: r.submittedAt,
      score: r.percentage,
      testTitle: test?.title || 'Unknown Test',
    };
  }).reverse(); // Oldest to newest

  // Prepare score distribution
  const scores = studentResults.map(r => r.percentage);

  // Calculate improvement
  const improvement = trendData.length >= 2
    ? trendData[trendData.length - 1].score - trendData[0].score
    : 0;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/admin/students" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
            ← Back to Students
          </Link>
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-stone-600">
                  {student.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-stone-900">{student.name}</h1>
                <p className="text-stone-600">{student.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            className="bg-white border border-stone-200 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-3xl font-bold text-stone-900">{totalTests}</p>
            <p className="text-sm text-stone-500">Tests Completed</p>
          </motion.div>
          <motion.div
            className="bg-white border border-stone-200 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-3xl font-bold text-stone-900">{avgScore}%</p>
            <p className="text-sm text-stone-500">Average Score</p>
          </motion.div>
          <motion.div
            className="bg-white border border-stone-200 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-3xl font-bold text-emerald-600">{bestScore}%</p>
            <p className="text-sm text-stone-500">Best Score</p>
          </motion.div>
          <motion.div
            className="bg-white border border-stone-200 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-stone-900">{improvement >= 0 ? '+' : ''}{improvement}%</p>
              {improvement !== 0 && (
                <span className={`text-lg ${improvement > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {improvement > 0 ? '↑' : '↓'}
                </span>
              )}
            </div>
            <p className="text-sm text-stone-500">Trend</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceTrend data={trendData} title="Performance Over Time" />
          <ScoreDistribution scores={scores} title="Score Distribution" />
        </div>

        {/* Test History */}
        <motion.div
          className="bg-white border border-stone-200 rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900">Test History</h2>
            <p className="text-sm text-stone-500 mt-1">{totalTests} tests completed</p>
          </div>

          {studentResults.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-stone-500">No tests completed yet</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {studentResults.map((result, index) => {
                const test = tests.find(t => t.id === result.testId);
                return (
                  <motion.div
                    key={result.id}
                    className="p-4 hover:bg-stone-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-stone-900">{test?.title || 'Unknown Test'}</h3>
                          <Badge variant={
                            result.percentage >= 80 ? 'success' :
                            result.percentage >= 60 ? 'warning' : 'danger'
                          }>
                            {result.percentage}%
                          </Badge>
                        </div>
                        <p className="text-sm text-stone-500">
                          Score: {result.score}/{result.total} • Submitted {new Date(result.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        to={`/admin/results/${result.id}`}
                        className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
