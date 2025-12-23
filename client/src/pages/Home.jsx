import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-float ${
          theme === 'dark' ? 'bg-purple-500' : 'bg-blue-400'
        }`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float ${
          theme === 'dark' ? 'bg-pink-500' : 'bg-purple-400'
        }`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 animate-float ${
          theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-300'
        }`} style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Logo/Brand */}
          <div className="mb-8 flex justify-center">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-premium-colored animate-pulse-glow ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                : 'bg-gradient-to-br from-blue-500 to-purple-500'
            }`}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className={`text-6xl lg:text-7xl font-extrabold mb-4 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
          } bg-clip-text text-transparent animate-gradient`}>
            AI Interview Simulator
          </h1>
          
          {/* Subtitle */}
          <p className={`text-lg lg:text-xl mb-6 max-w-2xl mx-auto font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Practice Makes Perfect
          </p>
          
          {/* Description */}
          <p className={`text-xl lg:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Master your interview skills with AI-powered practice sessions. 
            Get <span className={`font-semibold ${
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
            }`}>real-time feedback</span> and 
            track your progress over time.
          </p>

          {/* CTA Buttons */}
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/dashboard"
                className={`group relative px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-premium hover-lift overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}
              >
                <span className="relative z-10">Go to Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/interviews/new"
                className={`px-8 py-4 rounded-xl text-lg font-semibold border-2 transition-all hover-lift ${
                  theme === 'dark'
                    ? 'border-purple-500 text-purple-400 hover:bg-purple-500/10'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                Start Interview
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/register"
                className={`group relative px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-premium hover-lift overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/login"
                className={`px-8 py-4 rounded-xl text-lg font-semibold border-2 transition-all hover-lift ${
                  theme === 'dark'
                    ? 'border-purple-500 text-purple-400 hover:bg-purple-500/10'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className={`group relative p-8 rounded-2xl transition-all hover-lift ${
              theme === 'dark' ? 'card-premium-dark' : 'card-premium'
            }`}>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                  : 'bg-gradient-to-br from-blue-500 to-purple-500'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                AI-Powered Interviews
              </h3>
              <p className={`leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Experience realistic interviews with AI that asks contextual follow-up questions
                and evaluates your responses like a senior interviewer.
              </p>
            </div>

            <div className={`group relative p-8 rounded-2xl transition-all hover-lift ${
              theme === 'dark' ? 'card-premium-dark' : 'card-premium'
            }`}>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-green-600 to-emerald-600'
                  : 'bg-gradient-to-br from-green-500 to-emerald-500'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Track Progress
              </h3>
              <p className={`leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Monitor your performance over time with detailed analytics, score trends, and
                personalized improvement suggestions.
              </p>
            </div>

            <div className={`group relative p-8 rounded-2xl transition-all hover-lift ${
              theme === 'dark' ? 'card-premium-dark' : 'card-premium'
            }`}>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-pink-600 to-rose-600'
                  : 'bg-gradient-to-br from-pink-500 to-rose-500'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Voice & Text
              </h3>
              <p className={`leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Answer questions using voice recognition or text input. Practice speaking your
                answers just like in real interviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
