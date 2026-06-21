import { Router } from 'express';
import { query } from '../db/pool.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/me', authRequired, async (req, res) => {
  const { rows } = await query(
    `SELECT id, name, email, bio, avatar_url, city, total_km, total_activities, created_at
     FROM users WHERE id = $1`,
    [req.user.id]
  );
  res.json(rows[0]);
});

router.get('/:id/profile', async (req, res) => {
  const userQ = await query(
    `SELECT id, name, bio, avatar_url, city, total_km, total_activities
     FROM users WHERE id = $1`,
    [req.params.id]
  );
  if (!userQ.rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });

  const medalsQ = await query(
    `SELECT m.code, m.name, m.description, m.icon, um.awarded_at
     FROM user_medals um
     JOIN medals m ON m.id = um.medal_id
     WHERE um.user_id = $1
     ORDER BY um.awarded_at DESC`,
    [req.params.id]
  );

  const activitiesQ = await query(
    `SELECT id, title, distance_km, duration_min, pace_per_km, validated, validation_count, created_at
     FROM activities WHERE user_id = $1
     ORDER BY created_at DESC LIMIT 10`,
    [req.params.id]
  );

  res.json({ user: userQ.rows[0], medals: medalsQ.rows, activities: activitiesQ.rows });
});

export default router;
