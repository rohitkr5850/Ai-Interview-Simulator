import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewService } from '../services/interviewService.js';
import { useTheme } from '../context/ThemeContext.jsx';

const NewInterview = () => {
  const [config, setConfig] = useState({
    role: 'MERN',
    difficulty: 'Intermediate',
    interviewType: 'Technical',
    totalQuestions: 7,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleChange = (e) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await interviewService.startInterview(config);
      navigate(`/interviews/${response.session.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const isQuotaError = error.includes('quota exceeded') || error.includes('billing');
  const isInvalidApiKeyError = error.includes('API key is invalid');
  const isRateLimitError = error.includes('rate limit exceeded');

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`rounded-2xl shadow-premium-lg p-8 lg:p-12 ${
          theme === 'dark' ? 'card-premium-dark' : 'card-premium'
        }`}>
          {/* Header */}
          <div className="mb-8">
            <div className={`inline-block px-3 py-1 rounded-full mb-4 text-sm font-medium ${
              theme === 'dark'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-purple-100 text-purple-700'
            }`}>
              Configure Interview
            </div>
            <h1 className={`text-4xl font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Start New Interview
            </h1>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Customize your interview settings to match your practice goals
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 px-4 py-4 rounded-xl flex items-start space-x-3 ${
              isQuotaError
                ? theme === 'dark'
                  ? 'bg-yellow-900/20 border border-yellow-700 text-yellow-300'
                  : 'bg-yellow-50 border border-yellow-400 text-yellow-800'
                : theme === 'dark'
                  ? 'bg-red-900/20 border border-red-700 text-red-300'
                  : 'bg-red-50 border border-red-400 text-red-700'
            }`}>
              <svg className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                isQuotaError ? 'text-yellow-500' : 'text-red-500'
              }`} fill="currentColor" viewBox="0 0 20 20">
                {isQuotaError ? (
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              <div className="flex-1">
                <p className="font-semibold mb-1">{error}</p>
                {isQuotaError && (
                  <div className="mt-2 space-y-1">
                    <a
                      href="https://platform.openai.com/account/billing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm underline block ${
                        theme === 'dark' ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-900 hover:text-yellow-800'
                      }`}
                    >
                      Add credits to your OpenAI account →
                    </a>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm underline block ${
                        theme === 'dark' ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-900 hover:text-yellow-800'
                      }`}
                    >
                      Get a free Gemini API key →
                    </a>
                  </div>
                )}
                {isInvalidApiKeyError && (
                  <p className={`text-sm mt-1 ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}>
                    Please check your <code>OPENAI_API_KEY</code> or <code>GEMINI_API_KEY</code> in <code>server/.env</code>.
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label htmlFor="role" className={`block text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Target Role
              </label>
              <select
                id="role"
                name="role"
                value={config.role}
                onChange={handleChange}
                className={`block w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              >
                <option value="Frontend">Frontend Developer</option>
                <option value="Backend">Backend Developer</option>
                <option value="MERN">MERN Stack Developer</option>
                <option value="Full Stack">Full Stack Developer</option>
              </select>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label htmlFor="difficulty" className={`block text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Difficulty Level
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={config.difficulty}
                onChange={handleChange}
                className={`block w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Interview Type */}
            <div>
              <label htmlFor="interviewType" className={`block text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Interview Type
              </label>
              <select
                id="interviewType"
                name="interviewType"
                value={config.interviewType}
                onChange={handleChange}
                className={`block w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              >
                <option value="Technical">Technical</option>
                <option value="HR">HR / Behavioral</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div>
              <label htmlFor="totalQuestions" className={`block text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Number of Questions
              </label>
              <input
                type="number"
                id="totalQuestions"
                name="totalQuestions"
                min="5"
                max="10"
                value={config.totalQuestions}
                onChange={handleChange}
                className={`block w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              <p className={`mt-2 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Between 5 and 10 questions
              </p>
            </div>

            {/* Info Box */}
            <div className={`p-6 rounded-xl border-2 ${
              theme === 'dark'
                ? 'bg-blue-900/20 border-blue-700'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start">
                <svg className={`w-6 h-6 mr-3 flex-shrink-0 mt-0.5 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
                  }`}>
                    Important Note
                  </p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-blue-200' : 'text-blue-800'
                  }`}>
                    The AI interviewer will ask contextual follow-up questions based on your answers.
                    Be prepared to explain your responses in detail.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-4 rounded-xl font-semibold text-white shadow-premium hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Starting Interview...
                  </span>
                ) : (
                  'Start Interview'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className={`px-6 py-4 rounded-xl font-semibold border-2 transition-all hover-lift ${
                  theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewInterview;
