import express from 'express';
import { body } from 'express-validator';
import {
  startInterview,
  submitAnswer,
  getInterviewSession,
  getInterviewHistory,
  getAnalytics,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post(
  '/start',
  [
    body('role').isIn(['Frontend', 'Backend', 'MERN', 'Full Stack']).withMessage('Invalid role'),
    body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid difficulty'),
    body('interviewType').isIn(['Technical', 'HR', 'Mixed']).withMessage('Invalid interview type'),
  ],
  handleValidationErrors,
  startInterview
);

router.post(
  '/:sessionId/answer',
  [
    body('answer').notEmpty().withMessage('Answer is required'),
  ],
  handleValidationErrors,
  submitAnswer
);

router.get('/:sessionId', getInterviewSession);
router.get('/', getInterviewHistory);
router.get('/analytics/overview', getAnalytics);

export default router;

