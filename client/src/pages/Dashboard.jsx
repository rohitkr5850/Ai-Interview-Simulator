import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className={`inline-block px-4 py-2 rounded-full mb-4 ${
            theme === 'dark' 
              ? 'bg-purple-500/20 text-purple-300' 
              : 'bg-purple-100 text-purple-700'
          }`}>
            <span className="text-sm font-medium">Welcome Back!</span>
          </div>
          <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Hello, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.name}</span>! 👋
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Ready to practice your interview skills? Select a role and difficulty to get started.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/interviews/new"
            className={`group relative p-8 rounded-2xl transition-all hover-lift overflow-hidden ${
              theme === 'dark' ? 'card-premium-dark' : 'card-premium'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-blue-500 to-purple-600 shadow-premium-colored`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Start New Interview
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Begin a practice interview session
              </p>
              <div className="mt-4 flex items-center text-blue-600 group-hover:translate-x-2 transition-transform">
                <span className="font-semibold">Get Started</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            to="/interviews"
            className={`group relative p-8 rounded-2xl transition-all hover-lift overflow-hidden ${
              theme === 'dark' ? 'card-premium-dark' : 'card-premium'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-green-500 to-emerald-600 shadow-premium-colored`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Interview History
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                View and review past interviews
              </p>
              <div className="mt-4 flex items-center text-green-600 group-hover:translate-x-2 transition-transform">
                <span className="font-semibold">View All</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            to="/analytics"
            className={`group relative p-8 rounded-2xl transition-all hover-lift overflow-hidden ${
              theme === 'dark' ? 'card-premium-dark' : 'card-premium'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-purple-500 to-pink-600 shadow-premium-colored`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Analytics
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Track your progress and insights
              </p>
              <div className="mt-4 flex items-center text-purple-600 group-hover:translate-x-2 transition-transform">
                <span className="font-semibold">View Stats</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Profile Card */}
        <div className={`p-8 rounded-2xl transition-all hover-lift ${
          theme === 'dark' ? 'card-premium-dark' : 'card-premium'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Your Profile
            </h2>
            <Link
              to="/profile"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Edit Profile
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center mb-2">
                <svg className={`w-5 h-5 mr-2 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-blue-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Target Role
                </p>
              </div>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.role || 'Not set'}
              </p>
            </div>
            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center mb-2">
                <svg className={`w-5 h-5 mr-2 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-blue-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Experience Level
                </p>
              </div>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.experienceLevel || 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
