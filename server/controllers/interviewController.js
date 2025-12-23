import InterviewSession from '../models/InterviewSession.js';
import {
  generateFirstQuestion,
  generateFollowUpQuestion,
  evaluateInterview,
} from '../services/aiService.js';

/**
 * @desc    Start new interview session
 * @route   POST /api/interviews/start
 * @access  Private
 */
export const startInterview = async (req, res, next) => {
  try {
    const { role, difficulty, interviewType, totalQuestions = 7 } = req.body;

    // Generate first question with timeout
    let firstQuestion;
    try {
      firstQuestion = await Promise.race([
        generateFirstQuestion(role, difficulty, interviewType),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Question generation timeout after 30 seconds')), 30000)
        )
      ]);
    } catch (error) {
      console.error('Error generating first question:', error);
      return res.status(500).json({
        success: false,
        message: `Failed to generate first question: ${error.message}`,
      });
    }

    // Create interview session
    const session = await InterviewSession.create({
      userId: req.user.id,
      role,
      difficulty,
      interviewType,
      totalQuestions,
      currentQuestionNumber: 1,
      questions: [{
        question: firstQuestion,
        questionNumber: 1,
        askedAt: new Date(),
        context: 'Initial question',
      }],
      conversationHistory: [{
        role: 'assistant',
        content: firstQuestion,
        timestamp: new Date(),
      }],
    });

    res.status(201).json({
      success: true,
      session: {
        id: session._id,
        role: session.role,
        difficulty: session.difficulty,
        interviewType: session.interviewType,
        currentQuestion: firstQuestion,
        currentQuestionNumber: 1,
        totalQuestions: session.totalQuestions,
        status: session.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit answer and get next question
 * @route   POST /api/interviews/:sessionId/answer
 * @access  Private
 */
export const submitAnswer = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { answer, timeSpent, isVoiceAnswer = false } = req.body;

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    if (session.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this session',
      });
    }

    if (session.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Interview already completed',
      });
    }

    // Save answer
    session.answers.push({
      answer,
      questionNumber: session.currentQuestionNumber,
      submittedAt: new Date(),
      timeSpent: timeSpent || 0,
      isVoiceAnswer,
    });

    // Add to conversation history
    session.conversationHistory.push({
      role: 'user',
      content: answer,
      timestamp: new Date(),
    });

    // Check if interview is complete
    if (session.currentQuestionNumber >= session.totalQuestions) {
      // Evaluate interview with timeout
      let evaluation;
      try {
        evaluation = await Promise.race([
          evaluateInterview(
            session.role,
            session.difficulty,
            session.interviewType,
            session.conversationHistory
          ),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Evaluation timeout after 45 seconds')), 45000)
          )
        ]);
      } catch (error) {
        console.error('Error evaluating interview:', error);
        return res.status(500).json({
          success: false,
          message: `Failed to evaluate interview: ${error.message}`,
        });
      }

      session.aiFeedback = evaluation;
      session.score = evaluation.overallScore;
      session.status = 'completed';
      session.completedAt = new Date();

      // Update user's interview history
      const User = (await import('../models/User.js')).default;
      await User.findByIdAndUpdate(req.user.id, {
        $push: { interviewHistory: session._id },
      });

      await session.save();

      return res.json({
        success: true,
        completed: true,
        session: {
          id: session._id,
          status: session.status,
          score: session.score,
          feedback: session.aiFeedback,
        },
      });
    }

    // Generate next question with timeout
    // Pass the next question number to ensure unique questions
    const nextQuestionNumber = session.currentQuestionNumber + 1;
    let nextQuestion;
    try {
      nextQuestion = await Promise.race([
        generateFollowUpQuestion(
          session.role,
          session.difficulty,
          session.interviewType,
          session.conversationHistory,
          answer,
          nextQuestionNumber
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Question generation timeout after 15 seconds')), 15000)
        )
      ]);
    } catch (error) {
      console.error('Error generating next question:', error);
      return res.status(500).json({
        success: false,
        message: `Failed to generate next question: ${error.message}`,
      });
    }

    session.currentQuestionNumber = nextQuestionNumber;
    session.questions.push({
      question: nextQuestion,
      questionNumber: session.currentQuestionNumber,
      askedAt: new Date(),
      context: `Follow-up to question ${session.currentQuestionNumber - 1}`,
    });

    session.conversationHistory.push({
      role: 'assistant',
      content: nextQuestion,
      timestamp: new Date(),
    });

    await session.save();

    res.json({
      success: true,
      completed: false,
      session: {
        id: session._id,
        currentQuestion: nextQuestion,
        currentQuestionNumber: session.currentQuestionNumber,
        totalQuestions: session.totalQuestions,
        status: session.status,
        questions: session.questions, // Include full questions array
        role: session.role,
        difficulty: session.difficulty,
        interviewType: session.interviewType,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get interview session details
 * @route   GET /api/interviews/:sessionId
 * @access  Private
 */
export const getInterviewSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    if (session.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this session',
      });
    }

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's interview history
 * @route   GET /api/interviews
 * @access  Private
 */
export const getInterviewHistory = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('role difficulty interviewType score status createdAt completedAt');

    res.json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get interview analytics
 * @route   GET /api/interviews/analytics
 * @access  Private
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({
      userId: req.user.id,
      status: 'completed',
    });

    const totalInterviews = sessions.length;
    const averageScore = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length
      : 0;

    // Score distribution
    const scoreDistribution = {
      excellent: sessions.filter(s => s.score >= 80).length,
      good: sessions.filter(s => s.score >= 60 && s.score < 80).length,
      average: sessions.filter(s => s.score >= 40 && s.score < 60).length,
      needsImprovement: sessions.filter(s => s.score < 40).length,
    };

    // Role distribution
    const roleDistribution = sessions.reduce((acc, s) => {
      acc[s.role] = (acc[s.role] || 0) + 1;
      return acc;
    }, {});

    // Difficulty distribution
    const difficultyDistribution = sessions.reduce((acc, s) => {
      acc[s.difficulty] = (acc[s.difficulty] || 0) + 1;
      return acc;
    }, {});

    // Progress over time (last 10 interviews)
    const recentSessions = sessions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .reverse()
      .map(s => ({
        date: s.createdAt,
        score: s.score,
        role: s.role,
      }));

    res.json({
      success: true,
      analytics: {
        totalInterviews,
        averageScore: Math.round(averageScore * 10) / 10,
        scoreDistribution,
        roleDistribution,
        difficultyDistribution,
        progressOverTime: recentSessions,
      },
    });
  } catch (error) {
    next(error);
  }
};

