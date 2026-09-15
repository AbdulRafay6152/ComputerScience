import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/ui';
import EditTestModal from '../../components/admin/EditTestModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import PDFImport from '../../components/admin/PDFImport';
import * as store from '../../lib/store';

export default function AdminTests() {
  const tests = store.getTests();
  const allResults = store.getResults();

  const [editingTest, setEditingTest] = useState<any>(null);
  const [deletingTest, setDeletingTest] = useState<any>(null);
  const [showPDFImport, setShowPDFImport] = useState(false);
  const [, setRefresh] = useState(0);

  // Handlers
  const handleEdit = (testId: string) => {
    const test = store.getTestById(testId);
    if (test) {
      setEditingTest(test);
    }
  };

  const handleDelete = (testId: string) => {
    const test = store.getTestById(testId);
    if (test) {
      setDeletingTest(test);
    }
  };

  const confirmDelete = () => {
    if (deletingTest) {
      store.deleteTest(deletingTest.id);
      setDeletingTest(null);
      setRefresh(r => r + 1);
    }
  };

  const handleSave = () => {
    setRefresh(r => r + 1);
  };

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <Link to="/admin" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">Tests</h1>
              <p className="text-stone-600 mt-1">Manage and monitor tests</p>
            </div>
            <button
              onClick={() => setShowPDFImport(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import Test from PDF
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-stone-900">{tests.length}</p>
            <p className="text-sm text-stone-500">Total Tests</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-stone-900">
              {tests.reduce((sum, t) => sum + t.questions.length, 0)}
            </p>
            <p className="text-sm text-stone-500">Total Questions</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-stone-900">{allResults.length}</p>
            <p className="text-sm text-stone-500">Total Submissions</p>
          </div>
        </motion.div>

        {/* Tests List */}
        {tests.length === 0 ? (
          <EmptyState
            title="No tests yet"
            description="Tests will appear here once they are created"
          />
        ) : (
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {tests.map((test) => {
              const testResults = allResults.filter(r => r.testId === test.id);
              const avgScore = testResults.length > 0
                ? Math.round(testResults.reduce((sum, r) => sum + r.percentage, 0) / testResults.length)
                : 0;

              return (
                <motion.div
                  key={test.id}
                  className="bg-white border border-stone-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">
                        {test.category}
                      </span>
                      <h3 className="font-semibold text-stone-900 mt-1">{test.title}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(test.id)}
                        className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Edit test"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete test"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-stone-500 mb-4 line-clamp-2">{test.description}</p>

                  <div className="flex items-center gap-4 text-xs text-stone-400 mb-4">
                    <span>{test.questions.length} questions</span>
                    <span>{testResults.length} submissions</span>
                  </div>

                  {testResults.length > 0 && (
                    <div className="mb-4">
                      <span className="text-xs text-stone-500">Avg. Score: </span>
                      <span className="text-xs font-medium text-stone-700">{avgScore}%</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link
                      to={`/admin/tests/${test.id}/results`}
                      className="flex-1 text-center px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-900 transition-colors"
                    >
                      View Results
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Edit Test Modal */}
        {editingTest && (
          <EditTestModal
            test={editingTest}
            isOpen={!!editingTest}
            onClose={() => setEditingTest(null)}
            onSave={handleSave}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={!!deletingTest}
          title="Delete Test"
          message={`Are you sure you want to delete "${deletingTest?.title}"? This will also delete all submissions for this test. This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingTest(null)}
        />

        {/* PDF Import Modal */}
        <PDFImport
          isOpen={showPDFImport}
          onClose={() => setShowPDFImport(false)}
          onImport={handleSave}
        />
      </div>
    </div>
  );
}
