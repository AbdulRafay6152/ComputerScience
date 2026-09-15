import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import * as store from '../lib/store';
import { TestCard, StatCard, SearchInput, FilterBar, EmptyState } from '../components/ui';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const { user } = useAuth();
  const tests = store.getTests();
  const results = user ? store.getResultsByUserId(user.id) : [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get unique categories and difficulties
  const categories = useMemo(() => {
    const cats = new Set(tests.map(t => t.category));
    return Array.from(cats);
  }, [tests]);

  const difficulties = useMemo(() => {
    const diffs = new Set(tests.map(t => t.difficulty));
    return Array.from(diffs);
  }, [tests]);

  // Filter tests
  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           test.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || test.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || test.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [tests, searchQuery, selectedCategory, selectedDifficulty]);

  // Calculate stats
  const completedTests = results.length;
  const totalTests = tests.length;
  const avgScore = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;
  const bestScore = results.length > 0 
    ? Math.max(...results.map(r => r.percentage))
    : 0;

  // Recent activity (last 3 tests)
  const recentActivity = results
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with greeting */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-stone-600">
          {completedTests === 0 
            ? 'Ready to start your first test?'
            : `You've completed ${completedTests} test${completedTests !== 1 ? 's' : ''}. Keep it up!`
          }
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Tests Completed"
          value={completedTests}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="emerald"
          delay={0.1}
        />
        <StatCard
          label="Available Tests"
          value={totalTests}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          color="blue"
          delay={0.2}
        />
        <StatCard
          label="Average Score"
          value={`${avgScore}%`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          color="amber"
          delay={0.3}
        />
        <StatCard
          label="Best Score"
          value={`${bestScore}%`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.757 2.143L13 21l-2.286-6.857L5 12l5.757-2.143L13 3z" />
            </svg>
          }
          color="stone"
          delay={0.4}
        />
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search tests by title or description..."
        />
        <FilterBar
          categories={categories}
          difficulties={difficulties}
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
          onCategoryChange={setSelectedCategory}
          onDifficultyChange={setSelectedDifficulty}
        />
      </div>

      {/* Tests Grid */}
      {filteredTests.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="No tests found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test, index) => (
            <TestCard
              key={test.id}
              test={test}
              result={results.find(r => r.testId === test.id)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-stone-900 mb-4">Recent Activity</h2>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            {recentActivity.map((result, index) => {
              const test = tests.find(t => t.id === result.testId);
              return (
                <motion.div
                  key={result.id}
                  className={`p-4 flex items-center justify-between hover:bg-stone-50 transition-colors ${
                    index !== recentActivity.length - 1 ? 'border-b border-stone-100' : ''
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex-1">
                    <p className="font-medium text-stone-900">{test?.title}</p>
                    <p className="text-sm text-stone-500">
                      {new Date(result.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      result.percentage >= 70 ? 'text-emerald-600' :
                      result.percentage >= 50 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {result.percentage}%
                    </p>
                    <p className="text-sm text-stone-500">
                      {result.score}/{result.total} correct
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
