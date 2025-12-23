import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/interviews', label: 'Interviews', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { path: '/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { path: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-gray-900/95 border-gray-800/50 text-white shadow-premium'
        : 'bg-white/95 border-gray-200/50 text-gray-900 shadow-premium'
    }`}>
      {/* Animated gradient background */}
      <div className={`absolute inset-0 opacity-5 pointer-events-none ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
          : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
      }`}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-premium-colored'
                  : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-premium-colored'
              }`}>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <span className={`text-xl font-bold bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-blue-400 via-purple-400 to-pink-400'
                    : 'from-blue-600 via-purple-600 to-pink-600'
                } bg-clip-text text-transparent`}>
                  AI Interview
                </span>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Simulator
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                      isActive(link.path)
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white'
                          : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                      </svg>
                      <span>{link.label}</span>
                    </div>
                    {isActive(link.path) && (
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600'
                      }`}></div>
                    )}
                  </Link>
                ))}
                
                <div className={`mx-3 h-8 w-px ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`} />

                {/* User Profile */}
                <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                  }`}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {user?.name || 'User'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover-lift ${
                    theme === 'dark'
                      ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30'
                      : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-premium hover-lift transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700'
                      : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700'
                  }`}
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <div className={`ml-2 h-8 w-px ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
            }`} />
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-300 hover-lift ${
                theme === 'dark'
                  ? 'text-yellow-400 hover:bg-gray-800/50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all ${
                theme === 'dark'
                  ? 'text-yellow-400 hover:bg-gray-800/50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-all ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800/50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden py-4 border-t ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${
                        isActive(link.path)
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white'
                            : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-800/50'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                      </svg>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  <div className={`px-4 py-3 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        theme === 'dark'
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                          : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                      }`}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {user?.name || 'User'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left flex items-center space-x-3 ${
                      theme === 'dark'
                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30'
                        : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800/50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                    }`}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
