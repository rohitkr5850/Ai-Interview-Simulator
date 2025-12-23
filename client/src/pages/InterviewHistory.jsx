import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interviewService } from '../services/interviewService.js';
import { useTheme } from '../context/ThemeContext.jsx';

const InterviewHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await interviewService.getInterviewHistory();
      setSessions(response.sessions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load interview history');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return theme === 'dark' ? 'bg-green-600/20 text-green-300 border-green-600' : 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return theme === 'dark' ? 'bg-blue-600/20 text-blue-300 border-blue-600' : 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 40) return theme === 'dark' ? 'bg-yellow-600/20 text-yellow-300 border-yellow-600' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return theme === 'dark' ? 'bg-red-600/20 text-red-300 border-red-600' : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return theme === 'dark' ? 'bg-green-600/20 text-green-300 border-green-600' : 'bg-green-100 text-green-800 border-green-200';
    if (status === 'in-progress') return theme === 'dark' ? 'bg-yellow-600/20 text-yellow-300 border-yellow-600' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return theme === 'dark' ? 'bg-gray-600/20 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
          theme === 'dark' ? 'border-purple-500' : 'border-blue-600'
        }`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className={`inline-block px-3 py-1 rounded-full mb-3 text-sm font-medium ${
              theme === 'dark'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-purple-100 text-purple-700'
            }`}>
              Interview History
            </div>
            <h1 className={`text-4xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Your Interviews
            </h1>
            <p className={`mt-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Review your past interview sessions and track your progress
            </p>
          </div>
          <Link
            to="/interviews/new"
            className={`px-6 py-3 rounded-xl font-semibold text-white shadow-premium hover-lift transition-all ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            Start New Interview
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 px-4 py-3 rounded-xl flex items-center space-x-2 ${
            theme === 'dark'
              ? 'bg-red-900/20 border border-red-700 text-red-300'
              : 'bg-red-50 border border-red-400 text-red-700'
          }`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {sessions.length === 0 ? (
          <div className={`rounded-2xl shadow-premium-lg p-12 text-center ${
            theme === 'dark' ? 'card-premium-dark' : 'card-premium'
          }`}>
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              theme === 'dark'
                ? 'bg-gray-800'
                : 'bg-gray-100'
            }`}>
              <svg className={`w-10 h-10 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No interviews yet
            </h3>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Start your first interview to begin tracking your progress
            </p>
            <Link
              to="/interviews/new"
              className={`inline-block px-6 py-3 rounded-xl font-semibold text-white shadow-premium hover-lift transition-all ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              Start Your First Interview
            </Link>
          </div>
        ) : (
          /* Interview Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session._id}
                className={`group relative rounded-2xl shadow-premium hover-lift transition-all overflow-hidden ${
                  theme === 'dark' ? 'card-premium-dark' : 'card-premium'
                }`}
              >
                {/* Gradient Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${
                  session.status === 'completed'
                    ? 'bg-green-500'
                    : session.status === 'in-progress'
                    ? 'bg-yellow-500'
                    : 'bg-gray-500'
                }`}></div>

                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {session.role}
                      </h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {formatDate(session.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        getStatusColor(session.status)
                      }`}
                    >
                      {session.status === 'completed' ? '✓ Completed' : session.status === 'in-progress' ? '⏳ In Progress' : session.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className={`space-y-3 mb-6 ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                  } p-4 rounded-xl`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Difficulty
                      </span>
                      <span className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {session.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Type
                      </span>
                      <span className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {session.interviewType}
                      </span>
                    </div>
                    {session.score !== undefined && (
                      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                        <span className={`text-sm font-semibold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Score
                        </span>
                        <span className={`px-4 py-1.5 rounded-lg text-lg font-bold border ${
                          getScoreColor(session.score)
                        }`}>
                          {session.score}/100
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/interviews/${session._id}`}
                    className={`block w-full text-center px-4 py-3 rounded-xl font-semibold transition-all ${
                      theme === 'dark'
                        ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-600'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
