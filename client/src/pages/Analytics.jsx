import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { interviewService } from '../services/interviewService.js';
import { useTheme } from '../context/ThemeContext.jsx';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await interviewService.getAnalytics();
      setAnalytics(response.analytics);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = theme === 'dark' 
    ? ['#60a5fa', '#34d399', '#fbbf24', '#f87171']
    : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

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

  if (error) {
    return (
      <div className={`min-h-screen ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className={`px-4 py-3 rounded-xl flex items-center space-x-2 ${
            theme === 'dark'
              ? 'bg-red-900/20 border border-red-700 text-red-300'
              : 'bg-red-50 border border-red-400 text-red-700'
          }`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.totalInterviews === 0) {
    return (
      <div className={`min-h-screen ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className={`rounded-2xl shadow-premium-lg p-12 text-center ${
            theme === 'dark' ? 'card-premium-dark' : 'card-premium'
          }`}>
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <svg className={`w-10 h-10 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No Analytics Data
            </h3>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Complete some interviews to see your analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const progressData = analytics.progressOverTime.map((item, index) => ({
    name: `Interview ${index + 1}`,
    score: item.score,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const scoreDistributionData = [
    { name: 'Excellent (80+)', value: analytics.scoreDistribution.excellent },
    { name: 'Good (60-79)', value: analytics.scoreDistribution.good },
    { name: 'Average (40-59)', value: analytics.scoreDistribution.average },
    { name: 'Needs Improvement (<40)', value: analytics.scoreDistribution.needsImprovement },
  ];

  const roleData = Object.entries(analytics.roleDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const difficultyData = Object.entries(analytics.difficultyDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const textColor = theme === 'dark' ? '#e5e7eb' : '#111827';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className={`inline-block px-3 py-1 rounded-full mb-3 text-sm font-medium ${
            theme === 'dark'
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-purple-100 text-purple-700'
          }`}>
            Analytics Dashboard
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Performance Insights
          </h1>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Track your progress and identify areas for improvement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-2xl shadow-premium p-6 hover-lift transition-all ${
            theme === 'dark' ? 'card-premium-dark' : 'card-premium'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-blue-600/20'
                  : 'bg-blue-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className={`text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Total Interviews
            </div>
            <div className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {analytics.totalInterviews}
            </div>
          </div>

          <div className={`rounded-2xl shadow-premium p-6 hover-lift transition-all ${
            theme === 'dark' ? 'card-premium-dark' : 'card-premium'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-purple-600/20'
                  : 'bg-purple-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className={`text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Average Score
            </div>
            <div className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {analytics.averageScore.toFixed(1)}
            </div>
          </div>

          <div className={`rounded-2xl shadow-premium p-6 hover-lift transition-all ${
            theme === 'dark' ? 'card-premium-dark' : 'card-premium'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-green-600/20'
                  : 'bg-green-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className={`text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Completion Rate
            </div>
            <div className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              100%
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`rounded-2xl shadow-premium p-6 ${
            theme === 'dark' ? 'card-premium-dark' : 'card-premium'
          }`}>
            <h2 className={`text-xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Progress Over Time
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} />
                <YAxis domain={[0, 100]} stroke={textColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: textColor,
                  }}
                />
                <Legend wrapperStyle={{ color: textColor }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={theme === 'dark' ? '#818cf8' : '#3b82f6'}
                  strokeWidth={3}
                  name="Score"
                  dot={{ fill: theme === 'dark' ? '#818cf8' : '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`rounded-2xl shadow-premium p-6 ${
            theme === 'dark' ? 'card-premium-dark' : 'card-premium'
          }`}>
            <h2 className={`text-xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Score Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: textColor,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`rounded-2xl shadow-premium p-6 ${
            theme === 'dark' ? 'card-premium-dark' : 'card-premium'
          }`}>
            <h2 className={`text-xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Interviews by Role
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: textColor,
                  }}
                />
                <Bar dataKey="value" fill={theme === 'dark' ? '#818cf8' : '#3b82f6'} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`rounded-2xl shadow-premium p-6 ${
            theme === 'dark' ? 'card-premium-dark' : 'card-premium'
          }`}>
            <h2 className={`text-xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Interviews by Difficulty
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: textColor,
                  }}
                />
                <Bar dataKey="value" fill={theme === 'dark' ? '#34d399' : '#10b981'} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
