import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';
import { useTheme } from '../context/ThemeContext.jsx';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    role: 'MERN',
    experienceLevel: 'Beginner',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        role: user.role || 'MERN',
        experienceLevel: user.experienceLevel || 'Beginner',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

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
            <div className={`inline-block px-3 py-1 rounded-full mb-3 text-sm font-medium ${
              theme === 'dark'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-purple-100 text-purple-700'
            }`}>
              Profile Settings
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Edit Profile
            </h1>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Update your personal information and preferences
            </p>
          </div>

          {/* Messages */}
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

          {success && (
            <div className={`mb-6 px-4 py-3 rounded-xl flex items-center space-x-2 ${
              theme === 'dark'
                ? 'bg-green-900/20 border border-green-700 text-green-300'
                : 'bg-green-50 border border-green-400 text-green-700'
            }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (Disabled) */}
            <div>
              <label htmlFor="email" className={`block text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                disabled
                className={`block w-full px-4 py-3 rounded-xl border transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 text-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-500'
                }`}
              />
              <p className={`mt-2 text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Email cannot be changed
              </p>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className={`block text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`block w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="Enter your full name"
              />
            </div>

            {/* Role and Experience Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="role" className={`block text-sm font-semibold mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Target Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
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

              <div>
                <label htmlFor="experienceLevel" className={`block text-sm font-semibold mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
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
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-4 rounded-xl font-semibold text-white shadow-premium hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
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
                    Updating...
                  </span>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
