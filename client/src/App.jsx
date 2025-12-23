import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Layout from './components/Layout.jsx';
import PrivateRoute from './utils/PrivateRoute.jsx';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewInterview from './pages/NewInterview.jsx';
import Interview from './pages/Interview.jsx';
import InterviewHistory from './pages/InterviewHistory.jsx';
import Analytics from './pages/Analytics.jsx';
import Profile from './pages/Profile.jsx';
import OAuthCallback from './pages/OAuthCallback.jsx';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_relativeSplatPath: true }}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/interviews/new"
                element={
                  <PrivateRoute>
                    <NewInterview />
                  </PrivateRoute>
                }
              />
              <Route
                path="/interviews/:sessionId"
                element={
                  <PrivateRoute>
                    <Interview />
                  </PrivateRoute>
                }
              />
              <Route
                path="/interviews"
                element={
                  <PrivateRoute>
                    <InterviewHistory />
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <Analytics />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
