import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedPage from './components/AnimatedPage';
import SessionTimeout from './components/SessionTimeout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminResults from './pages/admin/AdminResults';
import AdminStudents from './pages/admin/AdminStudents';
import AdminStudentDetail from './pages/admin/AdminStudentDetail';
import AdminResultDetail from './pages/admin/AdminResultDetail';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminTests from './pages/admin/AdminTests';

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
          <p className="text-sm text-stone-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {user && <SessionTimeout />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/tests'} replace /> : <AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/register" element={user ? <Navigate to="/tests" replace /> : <AnimatedPage><Register /></AnimatedPage>} />

          {/* Student routes */}
          <Route path="/tests" element={
            <ProtectedRoute requiredRole="student">
              <AnimatedPage><StudentDashboard /></AnimatedPage>
            </ProtectedRoute>
          } />
          <Route path="/tests/:slug" element={
            <ProtectedRoute requiredRole="student">
              <AnimatedPage><TestPage /></AnimatedPage>
            </ProtectedRoute>
          } />
          <Route path="/results/:id" element={
            <ProtectedRoute>
              <AnimatedPage><ResultPage /></AnimatedPage>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requiredRole="student">
              <AnimatedPage><Profile /></AnimatedPage>
            </ProtectedRoute>
          } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AnimatedPage><AdminDashboard /></AnimatedPage>
          </ProtectedRoute>
        } />
        <Route path="/admin/tests/:testId/results" element={
          <ProtectedRoute requiredRole="admin">
            <AnimatedPage><AdminResults /></AnimatedPage>
          </ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute requiredRole="admin">
            <AnimatedPage><AdminStudents /></AnimatedPage>
          </ProtectedRoute>
        } />
        <Route path="/admin/tests" element={
          <ProtectedRoute requiredRole="admin">
            <AnimatedPage><AdminTests /></AnimatedPage>
          </ProtectedRoute>
        } />
        <Route path="/admin/students/:studentId" element={
          <ProtectedRoute requiredRole="admin">
            <AnimatedPage><AdminStudentDetail /></AnimatedPage>
          </ProtectedRoute>
        } />
        <Route path="/admin/results/:resultId" element={
          <ProtectedRoute requiredRole="admin">
            <AnimatedPage><AdminResultDetail /></AnimatedPage>
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute requiredRole="admin">
            <AnimatedPage><AdminAnalytics /></AnimatedPage>
          </ProtectedRoute>
        } />
          {/* Default redirect */}
          <Route path="/" element={
            <Navigate to={user ? (user.role === 'admin' ? '/admin' : '/tests') : '/login'} replace />
          } />
          <Route path="*" element={
            <Navigate to={user ? (user.role === 'admin' ? '/admin' : '/tests') : '/login'} replace />
          } />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
}
