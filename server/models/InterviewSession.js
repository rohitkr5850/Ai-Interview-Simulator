import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'MERN', 'Full Stack'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  interviewType: {
    type: String,
    required: true,
    enum: ['Technical', 'HR', 'Mixed'],
  },
  questions: [{
    question: String,
    questionNumber: Number,
    askedAt: Date,
    context: String, // Previous conversation context
  }],
  answers: [{
    answer: String,
    questionNumber: Number,
    submittedAt: Date,
    timeSpent: Number, // in seconds
    isVoiceAnswer: Boolean,
  }],
  aiFeedback: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    strengths: [String],
    weaknesses: [String],
    missedTopics: [String],
    suggestions: [String],
    roleSpecificFeedback: String,
    detailedEvaluation: String,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress',
  },
  currentQuestionNumber: {
    type: Number,
    default: 0,
  },
  totalQuestions: {
    type: Number,
    default: 7,
  },
  conversationHistory: [{
    role: String, // 'assistant' or 'user'
    content: String,
    timestamp: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

export default mongoose.model('InterviewSession', interviewSessionSchema);

