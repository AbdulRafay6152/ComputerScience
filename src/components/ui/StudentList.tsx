import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface StudentListProps {
  students: Array<{
    id: string;
    name: string;
    email: string;
    testsCompleted: number;
    averageScore: number;
    lastActive: string;
  }>;
  showLink?: boolean;
}

export default function StudentList({ students, showLink = false }: StudentListProps) {
  if (students.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Students</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-stone-500 text-sm">No students registered yet</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white border border-stone-200 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-stone-200">
        <h3 className="text-lg font-semibold text-stone-900">Students</h3>
        <p className="text-sm text-stone-500 mt-1">{students.length} total students</p>
      </div>

      <div className="divide-y divide-stone-100">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            className="p-4 hover:bg-stone-50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-stone-600">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  {showLink ? (
                    <Link 
                      to={`/admin/students/${student.id}`}
                      className="font-medium text-stone-900 text-sm hover:text-stone-700 transition-colors"
                    >
                      {student.name}
                    </Link>
                  ) : (
                    <p className="font-medium text-stone-900 text-sm">{student.name}</p>
                  )}
                  <p className="text-xs text-stone-500">{student.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-stone-900">
                    {student.averageScore}%
                  </span>
                  <span className="text-xs text-stone-500">
                    avg
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {student.testsCompleted} test{student.testsCompleted !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
