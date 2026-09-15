import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SearchInput, EmptyState } from '../../components/ui';
import EditStudentModal from '../../components/admin/EditStudentModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import * as store from '../../lib/store';

export default function AdminStudents() {
  const allUsers = store.getUsers();
  const allResults = store.getResults();
  const students = allUsers.filter(u => u.role === 'student');

  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [deletingStudent, setDeletingStudent] = useState<any>(null);
  const [, setRefresh] = useState(0);

  // Prepare student data with performance metrics
  const studentData = useMemo(() => {
    return students.map(student => {
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
  }, [students, allResults]);

  // Filter students
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return studentData;
    
    const query = searchQuery.toLowerCase();
    return studentData.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
  }, [studentData, searchQuery]);

  // Sort students by average score
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => b.averageScore - a.averageScore);
  }, [filteredStudents]);

  // Handlers
  const handleEdit = (studentId: string) => {
    const student = store.getUserById(studentId);
    if (student) {
      setEditingStudent(student);
    }
  };

  const handleDelete = (studentId: string) => {
    const student = store.getUserById(studentId);
    if (student) {
      setDeletingStudent(student);
    }
  };

  const confirmDelete = () => {
    if (deletingStudent) {
      store.deleteUser(deletingStudent.id);
      setDeletingStudent(null);
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
          <div className="mb-4">
            <Link to="/admin" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-stone-900 mt-2">Students</h1>
            <p className="text-stone-600 mt-1">Manage and monitor student performance</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search students by name or email..."
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-stone-900">{students.length}</p>
            <p className="text-sm text-stone-500">Total Students</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-stone-900">
              {studentData.filter(s => s.testsCompleted > 0).length}
            </p>
            <p className="text-sm text-stone-500">Active Students</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-stone-900">
              {studentData.length > 0
                ? Math.round(studentData.reduce((sum, s) => sum + s.averageScore, 0) / studentData.length)
                : 0}%
            </p>
            <p className="text-sm text-stone-500">Average Score</p>
          </div>
        </motion.div>

        {/* Student List */}
        {sortedStudents.length === 0 ? (
          <EmptyState
            title={searchQuery ? "No students found" : "No students yet"}
            description={searchQuery ? "Try adjusting your search" : "Students will appear here once they register"}
          />
        ) : (
          <motion.div
            className="bg-white border border-stone-200 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="divide-y divide-stone-100">
              {sortedStudents.map((student) => (
                <div key={student.id} className="p-4 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-stone-600">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <Link 
                          to={`/admin/students/${student.id}`}
                          className="font-medium text-stone-900 hover:text-stone-700 transition-colors"
                        >
                          {student.name}
                        </Link>
                        <p className="text-xs text-stone-500">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-stone-900">{student.averageScore}%</p>
                        <p className="text-xs text-stone-500">{student.testsCompleted} tests</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(student.id)}
                          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit student"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete student"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Edit Student Modal */}
        {editingStudent && (
          <EditStudentModal
            student={editingStudent}
            isOpen={!!editingStudent}
            onClose={() => setEditingStudent(null)}
            onSave={handleSave}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={!!deletingStudent}
          title="Delete Student"
          message={`Are you sure you want to delete ${deletingStudent?.name}? This will also delete all their test results. This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingStudent(null)}
        />
      </div>
    </div>
  );
}
