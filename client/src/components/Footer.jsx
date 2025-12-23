import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`relative border-t overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-gray-800/50 text-gray-300' 
        : 'bg-gradient-to-b from-white via-gray-50 to-gray-100 border-gray-200 text-gray-600'
    }`}>
      {/* Decorative gradient background */}
      <div className={`absolute inset-0 opacity-10 pointer-events-none ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
          : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
      }`}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6 group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 transition-all group-hover:scale-110 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-premium-colored'
                  : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-premium-colored'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <span className={`text-2xl font-bold block ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  AI Interview Simulator
                </span>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Powered by AI
                </span>
              </div>
            </Link>
            <p className={`text-sm mb-6 leading-relaxed max-w-md ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Master your interview skills with AI-powered practice sessions. 
              Get real-time feedback, detailed insights, and track your progress over time.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all hover-lift ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-blue-400'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-blue-600 shadow-sm'
                }`}
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all hover-lift ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-purple-400'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-purple-600 shadow-sm'
                }`}
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all hover-lift ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-blue-500'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-blue-600 shadow-sm'
                }`}
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { path: '/dashboard', label: 'Dashboard' },
                { path: '/interviews', label: 'Interviews' },
                { path: '/analytics', label: 'Analytics' },
                { path: '/profile', label: 'Profile' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-all duration-300 flex items-center group ${
                      theme === 'dark' 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className={`text-lg font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { href: '#', label: 'Documentation' },
                { href: '#', label: 'Help Center' },
                { href: '#', label: 'Contact Us' },
                { href: '#', label: 'Privacy Policy' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-sm transition-all duration-300 flex items-center group ${
                      theme === 'dark' 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`mt-12 pt-8 border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              © {new Date().getFullYear()} AI Interview Simulator. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`text-sm transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
