const pool = require('../config/db');

// Create new candidate application
const applyCandidate = async (req, res) => {
  const { full_name, email, phone, branch } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO candidates (full_name, email, phone, branch) VALUES ($1, $2, $3, $4) RETURNING *',
      [full_name, email, phone, branch]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all candidates
const getCandidates = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM candidates ORDER BY applied_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single candidate
const getCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM candidates WHERE id = $1', [id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Candidate not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update candidate status
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE candidates SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Submit psychometric test result
const submitPsychometric = async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;
  const passed = score >= 70;
  try {
    await pool.query(
      'INSERT INTO psychometric_tests (candidate_id, score, passed) VALUES ($1, $2, $3)',
      [id, score, passed]
    );
    const newStatus = passed ? 'interview' : 'rejected';
    await pool.query(
      'UPDATE candidates SET status = $1, updated_at = NOW() WHERE id = $2',
      [newStatus, id]
    );
    res.json({ passed, score, status: newStatus });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Schedule interview
const scheduleInterview = async (req, res) => {
  const { id } = req.params;
  const { scheduled_at, interviewer_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO interviews (candidate_id, scheduled_at, interviewer_id) VALUES ($1, $2, $3) RETURNING *',
      [id, scheduled_at, interviewer_id]
    );
    await pool.query(
      'UPDATE candidates SET status = $1, updated_at = NOW() WHERE id = $2',
      ['interview', id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update interview outcome
const updateInterview = async (req, res) => {
  const { id } = req.params;
  const { outcome, notes } = req.body;
  try {
    await pool.query(
      'UPDATE interviews SET outcome = $1, notes = $2 WHERE candidate_id = $3',
      [outcome, notes, id]
    );
    const newStatus = outcome === 'passed' ? 'training' : 'rejected';
    await pool.query(
      'UPDATE candidates SET status = $1, updated_at = NOW() WHERE id = $2',
      [newStatus, id]
    );
    res.json({ outcome, status: newStatus });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Log training
const logTraining = async (req, res) => {
  const { id } = req.params;
  const { trainer_id, date, attended, roleplay_score, assessment_passed } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO training (candidate_id, trainer_id, date, attended, roleplay_score, assessment_passed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, trainer_id, date, attended, roleplay_score, assessment_passed]
    );
    if (assessment_passed) {
      await pool.query(
        'UPDATE candidates SET status = $1, updated_at = NOW() WHERE id = $2',
        ['incubation', id]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Log incubation day
const logIncubation = async (req, res) => {
  const { id } = req.params;
  const { day, sales_count } = req.body;
  const target_met = sales_count >= 3;
  try {
    const result = await pool.query(
      'INSERT INTO incubation (candidate_id, day, sales_count, target_met) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, day, sales_count, target_met]
    );
    if (day === 5 && target_met) {
      await pool.query(
        'UPDATE candidates SET status = $1, updated_at = NOW() WHERE id = $2',
        ['agent', id]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  applyCandidate,
  getCandidates,
  getCandidate,
  updateStatus,
  submitPsychometric,
  scheduleInterview,
  updateInterview,
  logTraining,
  logIncubation
};