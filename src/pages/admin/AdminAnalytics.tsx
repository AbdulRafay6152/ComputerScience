import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as store from '../../lib/store';
import { 
  StatCard, 
  AnalyticsChart, 
  PerformanceTrend, 
  ScoreDistribution, 
  DateRangeFilter
} from '../../components/ui';

export default function AdminAnalytics() {
  const tests = store.getTests();
  const allResults = store.getResults();
  const allUsers = store.getUsers();
  const students = allUsers.filter(u => u.role === 'student');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter results by date range
  const filteredResults = useMemo(() => {
    if (!startDate && !endDate) return allResults;
    
    return allResults.filter(r => {
      const resultDate = new Date(r.submittedAt);
      if (startDate && resultDate < new Date(startDate)) return false;
      if (endDate && resultDate > new Date(endDate + 'T23:59:59')) return false;
      return true;
    });
  }, [allResults, startDate, endDate]);

  // Calculate metrics
  const totalSubmissions = filteredResults.length;
  const avgScore = totalSubmissions > 0
    ? Math.round(filteredResults.reduce((sum, r) => sum + r.percentage, 0) / totalSubmissions)
    : 0;
  const passRate = totalSubmissions > 0
    ? Math.round((filteredResults.filter(r => r.percentage >= 60).length / totalSubmissions) * 100)
    : 0;

  // Prepare trend data (last 10 submissions)
  const trendData = filteredResults
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
    .slice(-10)
    .map(r => {
      const test = tests.find(t => t.id === r.testId);
      const student = students.find(s => s.id === r.userId);
      return {
        date: r.submittedAt,
        score: r.percentage,
        testTitle: test?.title || 'Unknown',
      };
    });

  // Prepare score distribution
  const allScores = filteredResults.map(r => r.percentage);

  // Test performance comparison
  const testPerformance = tests.map(test => {
    const testResults = filteredResults.filter(r => r.testId === test.id);
    const avgScore = testResults.length > 0
      ? Math.round(testResults.reduce((sum, r) => sum + r.percentage, 0) / testResults.length)
      : 0;
    return {
      label: test.title.split(' ').slice(-1)[0] || test.title.substring(0, 10),
      value: avgScore,
    };
  });

  // Top performing students
  const studentPerformance = students.map(student => {
    const studentResults = filteredResults.filter(r => r.userId === student.id);
    const avgScore = studentResults.length > 0
      ? Math.round(studentResults.reduce((sum, r) => sum + r.percentage, 0) / studentResults.length)
      : 0;
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      testsCompleted: studentResults.length,
      averageScore: avgScore,
    };
  }).filter(s => s.testsCompleted > 0)
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 10);

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
          <Link to="/admin" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Advanced Analytics</h1>
              <p className="text-stone-600 mt-1">Deep insights into test performance</p>
            </div>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onReset={() => { setStartDate(''); setEndDate(''); }}
            />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Submissions"
            value={totalSubmissions}
            icon="📝"
            color="blue"
            delay={0.1}
          />
          <StatCard
            label="Average Score"
            value={`${avgScore}%`}
            icon="📊"
            color="amber"
            delay={0.2}
          />
          <StatCard
            label="Pass Rate"
            value={`${passRate}%`}
            icon="✓"
            color="green"
            delay={0.3}
          />
          <StatCard
            label="Active Students"
            value={students.filter(s => filteredResults.some(r => r.userId === s.id)).length}
            icon="👥"
            color="purple"
            delay={0.4}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceTrend data={trendData} title="Performance Trend (Last 10 Submissions)" />
          <ScoreDistribution scores={allScores} title="Score Distribution" />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            data={testPerformance}
            title="Average Score by Test"
            type="bar"
          />
          
          {/* Top Performers */}
          <motion.div
            className="bg-white border border-stone-200 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-stone-900 mb-4">🏆 Top Performers</h3>
            <div className="space-y-3">
              {studentPerformance.slice(0, 5).map((student, index) => (
                <motion.div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                    </div>
                    <div>
                      <Link 
                        to={`/admin/students/${student.id}`}
                        className="font-medium text-stone-900 hover:text-stone-700 transition-colors"
                      >
                        {student.name}
                      </Link>
                      <p className="text-xs text-stone-500">{student.testsCompleted} tests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-stone-900">{student.averageScore}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Insights */}
        <motion.div
          className="bg-gradient-to-br from-stone-900 to-stone-700 rounded-xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4">📈 Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">{avgScore >= 70 ? '👍' : '⚠️'}</p>
              <p className="text-sm font-medium mb-1">Overall Performance</p>
              <p className="text-xs opacity-80">
                {avgScore >= 70 
                  ? 'Students are performing well overall'
                  : 'Consider reviewing difficult topics'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">{passRate >= 70 ? '🎯' : '📚'}</p>
              <p className="text-sm font-medium mb-1">Pass Rate</p>
              <p className="text-xs opacity-80">
                {passRate >= 70
                  ? 'High pass rate indicates good preparation'
                  : 'Students may need additional support'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">{totalSubmissions > 10 ? '📊' : '📈'}</p>
              <p className="text-sm font-medium mb-1">Engagement</p>
              <p className="text-xs opacity-80">
                {totalSubmissions > 10
                  ? 'Good student engagement with tests'
                  : 'Encourage more test participation'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
