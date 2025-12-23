import api from './api.js';

export const interviewService = {
  startInterview: async (config) => {
    const response = await api.post('/interviews/start', config);
    return response.data;
  },

  submitAnswer: async (sessionId, answer, timeSpent, isVoiceAnswer) => {
    const response = await api.post(`/interviews/${sessionId}/answer`, {
      answer,
      timeSpent,
      isVoiceAnswer,
    });
    return response.data;
  },

  getInterviewSession: async (sessionId) => {
    const response = await api.get(`/interviews/${sessionId}`);
    return response.data;
  },

  getInterviewHistory: async () => {
    const response = await api.get('/interviews');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/interviews/analytics/overview');
    return response.data;
  },
};

