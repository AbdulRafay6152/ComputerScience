import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StatCard, AnalyticsChart, ActivityFeed, StudentList } from '../../components/ui';
import * as store from '../../lib/store';

export default function AdminDashboard() {
  const tests = store.getTests();
  const allResults = store.getResults();
  const allUsers = store.getUsers();
  const students = allUsers.filter(u => u.role === 'student');

  // Calculate analytics
  const totalTests = tests.length;
  const totalStudents = students.length;
  const totalSubmissions = allResults.length;
  const averageScore = totalSubmissions > 0 
    ? Math.round(allResults.reduce((sum, r) => sum + r.percentage, 0) / totalSubmissions)
    : 0;

  // Prepare chart data - submissions per test
  const testData = tests.map(test => {
    const testResults = allResults.filter(r => r.testId === test.id);
    return {
      label: test.title.split(' ').slice(-1)[0] || test.title.substring(0, 10),
      value: testResults.length,
    };
  });

  // Prepare student data
  const studentData = students.map(student => {
    const studentResults = allResults.filter(r => r.userId === student.id);
    const avgScore = studentResults.length > 0
      ? Math.round(studentResults.reduce((sum, r) => sum + r.percentage, 0) / studentResults.length)
      : 0;
    const lastActive = studentResults.length > 0
      ? studentResults.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0].submittedAt
      : student.createdAt;

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      testsCompleted: studentResults.length,
      averageScore: avgScore,
      lastActive,
    };
  });

  // Prepare activity feed
  const activities = allResults
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5)
    .map(result => {
      const student = allUsers.find(u => u.id === result.userId);
      const test = tests.find(t => t.id === result.testId);
      return {
        id: result.id,
        type: 'test_submitted' as const,
        title: `${student?.name || 'Unknown'} completed ${test?.title || 'a test'}`,
        description: `Score: ${result.score}/${result.total} (${result.percentage}%)`,
        timestamp: result.submittedAt,
      };
    });

  // Top performing students
  const topStudents = [...studentData]
    .filter(s => s.testsCompleted > 0)
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 5);

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
          <h1 className="text-3xl font-bold text-stone-900">Admin Dashboard</h1>
          <p className="text-stone-600 mt-2">Monitor test performance and student progress</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Tests"
            value={totalTests}
            icon="📚"
            color="blue"
            delay={0.1}
          />
          <StatCard
            label="Total Students"
            value={totalStudents}
            icon="👥"
            color="purple"
            delay={0.2}
          />
          <StatCard
            label="Total Submissions"
            value={totalSubmissions}
            icon="📝"
            color="green"
            delay={0.3}
          />
          <StatCard
            label="Average Score"
            value={`${averageScore}%`}
            icon="📊"
            color="amber"
            delay={0.4}
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            data={testData}
            title="Submissions per Test"
            type="bar"
          />
          
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/admin/analytics"
                className="block w-full px-4 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors text-center"
              >
                📊 Advanced Analytics
              </Link>
              <Link
                to="/admin/students"
                className="block w-full px-4 py-3 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors text-center"
              >
                👥 Manage Students
              </Link>
              <Link
                to="/admin/tests"
                className="block w-full px-4 py-3 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors text-center"
              >
                📚 View All Tests
              </Link>
            </div>
          </div>
        </div>

        {/* Activity and Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ActivityFeed activities={activities} />
          <StudentList students={studentData.slice(0, 5)} showLink={true} />
        </div>

        {/* Top Performers */}
        {topStudents.length > 0 && (
          <motion.div
            className="bg-white border border-stone-200 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-stone-900 mb-4">🏆 Top Performers</h3>
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">{student.name}</p>
                      <p className="text-xs text-stone-500">{student.testsCompleted} tests completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-stone-900">{student.averageScore}%</p>
                    <p className="text-xs text-stone-500">average score</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}


      </div>
    </div>
  );
}
