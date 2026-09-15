import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {!isAuthPage && (
        <motion.header 
          className="bg-white/80 backdrop-blur-md border-b border-stone-200/50 sticky top-0 z-50"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link 
                to={isAdmin ? '/admin' : '/tests'} 
                className="flex items-center gap-2.5 group"
              >
                <motion.div 
                  className="w-9 h-9 bg-stone-800 rounded-lg flex items-center justify-center shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white text-sm font-bold">CS</span>
                </motion.div>
                <span className="text-stone-800 font-semibold text-lg hidden sm:block">Test Hub</span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-8">
                <NavLink to={isAdmin ? '/admin' : '/tests'} isActive={location.pathname === '/admin' || location.pathname === '/tests'}>
                  {isAdmin ? 'Dashboard' : 'Tests'}
                </NavLink>
                {!isAdmin && (
                  <NavLink to="/profile" isActive={location.pathname === '/profile'}>
                    Profile
                  </NavLink>
                )}
                <div className="flex items-center gap-4 pl-6 border-l border-stone-200/50">
                  <span className="text-sm text-stone-500">{user?.name}</span>
                  <motion.button
                    onClick={handleLogout}
                    className="text-sm text-stone-500 hover:text-stone-800"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    Logout
                  </motion.button>
                </div>
              </nav>

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-stone-600 hover:text-stone-900"
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="md:hidden border-t border-stone-200/50 bg-white overflow-hidden"
              >
                <div className="px-4 py-4 space-y-1">
                  <MobileNavLink to={isAdmin ? '/admin' : '/tests'} onClick={() => setMobileMenuOpen(false)}>
                    {isAdmin ? 'Dashboard' : 'Tests'}
                  </MobileNavLink>
                  {!isAdmin && (
                    <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      Profile
                    </MobileNavLink>
                  )}
                  <div className="pt-3 mt-3 border-t border-stone-100">
                    <p className="text-xs text-stone-400 mb-2">{user?.email}</p>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="text-sm text-stone-600 hover:text-stone-900"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function NavLink({ to, children, isActive }: { to: string; children: React.ReactNode; isActive: boolean }) {
  return (
    <Link
      to={to}
      className={`relative text-sm font-medium transition-colors duration-300 ${
        isActive ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-stone-800"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block py-2.5 text-sm text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-lg px-2 -mx-2 transition-colors duration-200"
    >
      {children}
    </Link>
  );
}
