const express = require('express');
const router = express.Router();
const db = require('../db');
const hallmarksController = require('../controllers/hallmarksController');

// CORE HALLMARKS
router.get('/', hallmarksController.getAll);
router.post('/', hallmarksController.create);
router.post('/award', hallmarksController.award);
router.get('/user/:userId', hallmarksController.getUserHallmarks);
router.delete('/revoke', hallmarksController.revoke);

// MILESTONES

// Get all milestones for a user
router.get('/milestones/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await db.query('SELECT * FROM milestones WHERE user_id = $1 ORDER BY date DESC', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a milestone
router.post('/milestones', async (req, res) => {
  try {
    const { title, description, date, category, importance_level, image_url, user_id } = req.body;
    const { rows } = await db.query(
      'INSERT INTO milestones (title, description, date, category, importance_level, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, date, category, importance_level, image_url, user_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update a milestone
router.put('/milestones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, category, importance_level, image_url } = req.body;
    const { rows } = await db.query(
      'UPDATE milestones SET title = $1, description = $2, date = $3, category = $4, importance_level = $5, image_url = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [title, description, date, category, importance_level, image_url, id]
    );
    if (rows.length === 0) return res.status(404).json({ msg: 'Milestone not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a milestone
router.delete('/milestones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM milestones WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ msg: 'Milestone not found' });
    res.json({ msg: 'Milestone removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ACHIEVEMENTS

// Get all achievements for a user
router.get('/achievements/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await db.query('SELECT * FROM achievements WHERE user_id = $1 ORDER BY awarded_date DESC', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create an achievement
router.post('/achievements', async (req, res) => {
  try {
    const { title, description, badge_url, awarded_date, category, points_value, user_id } = req.body;
    const { rows } = await db.query(
      'INSERT INTO achievements (title, description, badge_url, awarded_date, category, points_value, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, badge_url, awarded_date, category, points_value, user_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update an achievement
router.put('/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, badge_url, awarded_date, category, points_value } = req.body;
    const { rows } = await db.query(
      'UPDATE achievements SET title = $1, description = $2, badge_url = $3, awarded_date = $4, category = $5, points_value = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [title, description, badge_url, awarded_date, category, points_value, id]
    );
    if (rows.length === 0) return res.status(404).json({ msg: 'Achievement not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete an achievement
router.delete('/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM achievements WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ msg: 'Achievement not found' });
    res.json({ msg: 'Achievement removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// TIMELINE

// Get timeline for a user
router.get('/timeline/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await db.query('SELECT * FROM timeline_entries WHERE user_id = $1 ORDER BY entry_date DESC', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Specific Hallmark by ID or recent
router.get('/recent', hallmarksController.getAll);
router.get('/:id', hallmarksController.getById);
router.put('/:id', hallmarksController.update);
router.delete('/:id', hallmarksController.delete);

module.exports = router;
