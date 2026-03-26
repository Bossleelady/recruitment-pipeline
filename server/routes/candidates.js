const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  applyCandidate,
  getCandidates,
  getCandidate,
  updateStatus,
  submitPsychometric,
  scheduleInterview,
  updateInterview,
  logTraining,
  logIncubation
} = require('../controllers/candidateController');

// Public route - anyone can apply
router.post('/apply', applyCandidate);

// Protected routes - must be logged in
router.get('/', protect, getCandidates);
router.get('/:id', protect, getCandidate);
router.patch('/:id/status', protect, updateStatus);
router.post('/:id/psychometric', protect, submitPsychometric);
router.post('/:id/interview/schedule', protect, scheduleInterview);
router.patch('/:id/interview/outcome', protect, updateInterview);
router.post('/:id/training', protect, logTraining);
router.post('/:id/incubation', protect, logIncubation);

module.exports = router;