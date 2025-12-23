import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '../services/interviewService.js';
import { useSpeechToText } from '../hooks/useSpeechToText.js';
import { useTheme } from '../context/ThemeContext.jsx';

const Interview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);
  const answerTextareaRef = useRef(null);
  const { theme } = useTheme();

  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText();

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  useEffect(() => {
    if (transcript && !isListening) {
      setCurrentAnswer(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    if (session && session.status === 'in-progress') {
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session]);

  const loadSession = async () => {
    try {
      const response = await interviewService.getInterviewSession(sessionId);
      const sessionData = response.session;
      
      // Ensure all required fields exist
      if (!sessionData.questions) {
        sessionData.questions = [];
      }
      if (!sessionData.answers) {
        sessionData.answers = [];
      }
      if (!sessionData.conversationHistory) {
        sessionData.conversationHistory = [];
      }
      
      setSession(sessionData);

      if (sessionData.status === 'completed' && sessionData.aiFeedback) {
        setFeedback(sessionData.aiFeedback);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load interview');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      setError('Please provide an answer before submitting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await interviewService.submitAnswer(
        sessionId,
        currentAnswer,
        timeSpent,
        isListening
      );

      if (response.completed) {
        setFeedback(response.session.feedback);
        setSession({ ...session, status: 'completed' });
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      } else {
        // Reload the full session to get the updated question
        await loadSession();
        setCurrentAnswer('');
        setTimeSpent(0);
        resetTranscript();
        answerTextareaRef.current?.focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) {
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

  // Ensure session has required properties
  if (!session.questions || !Array.isArray(session.questions)) {
    session.questions = [];
  }

  if (session.status === 'completed' && feedback) {
    return (
      <div className={`min-h-screen ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className={`rounded-2xl shadow-premium-lg p-8 lg:p-12 ${
            theme === 'dark' ? 'card-premium-dark' : 'card-premium'
          }`}>
            <div className="text-center mb-10">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-green-600 to-emerald-600'
                  : 'bg-gradient-to-br from-green-500 to-emerald-500'
              }`}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className={`text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Interview Completed! 🎉
              </h1>
              <div className={`inline-block text-3xl font-bold px-8 py-4 rounded-xl shadow-premium ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
              }`}>
                Score: {feedback.overallScore}/100
              </div>
            </div>

            <div className="space-y-8">
              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-blue-50/50'
              }`}>
                <h2 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Overall Evaluation
                </h2>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {feedback.detailedEvaluation}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-xl border-2 ${
                  theme === 'dark'
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      theme === 'dark' ? 'bg-green-600' : 'bg-green-500'
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className={`text-xl font-bold ${
                      theme === 'dark' ? 'text-green-300' : 'text-green-900'
                    }`}>
                      Strengths
                    </h3>
                  </div>
                  <ul className={`space-y-2 ${
                    theme === 'dark' ? 'text-green-200' : 'text-green-800'
                  }`}>
                    {(feedback.strengths || []).map((strength, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-6 rounded-xl border-2 ${
                  theme === 'dark'
                    ? 'bg-red-900/20 border-red-700'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      theme === 'dark' ? 'bg-red-600' : 'bg-red-500'
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className={`text-xl font-bold ${
                      theme === 'dark' ? 'text-red-300' : 'text-red-900'
                    }`}>
                      Areas for Improvement
                    </h3>
                  </div>
                  <ul className={`space-y-2 ${
                    theme === 'dark' ? 'text-red-200' : 'text-red-800'
                  }`}>
                    {(feedback.weaknesses || []).map((weakness, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {feedback.missedTopics && feedback.missedTopics.length > 0 && (
                <div className={`p-6 rounded-xl ${
                  theme === 'dark' ? 'bg-yellow-900/20 border-2 border-yellow-700' : 'bg-yellow-50 border-2 border-yellow-200'
                }`}>
                  <h3 className={`text-xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-yellow-300' : 'text-yellow-900'
                  }`}>
                    Missed Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(feedback.missedTopics || []).map((topic, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          theme === 'dark'
                            ? 'bg-yellow-600/30 text-yellow-200'
                            : 'bg-yellow-200 text-yellow-800'
                        }`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-purple-900/20 border-2 border-purple-700' : 'bg-purple-50 border-2 border-purple-200'
              }`}>
                <h3 className={`text-xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-purple-300' : 'text-purple-900'
                }`}>
                  Suggestions
                </h3>
                <ul className={`space-y-2 ${
                  theme === 'dark' ? 'text-purple-200' : 'text-purple-800'
                }`}>
                  {(feedback.suggestions || []).map((suggestion, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">💡</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {feedback.roleSpecificFeedback && (
                <div className={`p-6 rounded-xl border-2 ${
                  theme === 'dark'
                    ? 'bg-blue-900/20 border-blue-700'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <h3 className={`text-xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
                  }`}>
                    Role-Specific Feedback
                  </h3>
                  <p className={`leading-relaxed ${
                    theme === 'dark' ? 'text-blue-200' : 'text-blue-800'
                  }`}>
                    {feedback.roleSpecificFeedback}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/interviews')}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white shadow-premium hover-lift transition-all ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                View All Interviews
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all hover-lift ${
                  theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = (session.questions && session.questions.length > 0)
    ? session.questions[session.questions.length - 1]?.question || ''
    : 'Loading question...';

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`rounded-2xl shadow-premium-lg p-8 lg:p-10 ${
          theme === 'dark' ? 'card-premium-dark' : 'card-premium'
        }`}>
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className={`inline-block px-3 py-1 rounded-full mb-3 text-sm font-medium ${
                theme === 'dark'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                Interview in Progress
              </div>
              <h1 className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {session.role} Interview
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {session.difficulty} • {session.interviewType}
              </p>
            </div>
            <div className={`text-center px-6 py-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-blue-50'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Question
              </div>
              <div className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-purple-400' : 'text-blue-600'
              }`}>
                {session.currentQuestionNumber} / {session.totalQuestions}
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className={`mb-8 p-6 rounded-xl border-l-4 ${
            theme === 'dark'
              ? 'bg-blue-900/20 border-blue-500'
              : 'bg-blue-50 border-blue-500'
          }`}>
            <div className="flex items-start mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
              }`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {currentQuestion}
              </p>
            </div>
          </div>

          {/* Error Messages */}
          {error && (
            <div className={`mb-6 px-4 py-3 rounded-lg flex items-center space-x-2 ${
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

          {speechError && (
            <div className={`mb-6 px-4 py-3 rounded-lg flex items-center space-x-2 ${
              theme === 'dark'
                ? 'bg-yellow-900/20 border border-yellow-700 text-yellow-300'
                : 'bg-yellow-50 border border-yellow-400 text-yellow-700'
            }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{speechError}</span>
            </div>
          )}

          {/* Answer Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <label htmlFor="answer" className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Your Answer
              </label>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <svg className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {formatTime(timeSpent)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all hover-lift ${
                    isListening
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-premium'
                      : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isListening ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                      Stop Recording
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Use Voice
                    </span>
                  )}
                </button>
              </div>
            </div>
            <textarea
              ref={answerTextareaRef}
              id="answer"
              rows={10}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here or use the voice button to speak your answer..."
              className={`block w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              disabled={loading}
            />
            {isListening && (
              <p className={`mt-3 text-sm font-medium flex items-center ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Listening... Speak now
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mb-6">
            <button
              onClick={handleSubmitAnswer}
              disabled={loading || !currentAnswer.trim()}
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
                  Generating next question...
                </span>
              ) : (
                'Submit Answer'
              )}
            </button>
          </div>
          
          {/* Loading indicator when generating question */}
          {loading && (
            <div className={`mb-4 p-4 rounded-xl ${
              theme === 'dark' ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ${
                  theme === 'dark' ? 'border-blue-400' : 'border-blue-600'
                }`}></div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  AI is generating your next question...
                </p>
              </div>
            </div>
          )}

          {/* Note */}
          <div className={`pt-6 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <p className={`text-sm flex items-start ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                <strong>Note:</strong> You cannot skip questions. Provide a thoughtful answer before
                submitting. The AI will ask follow-up questions based on your response.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;

