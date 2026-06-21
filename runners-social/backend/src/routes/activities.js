import { Router } from 'express';
import { query } from '../db/pool.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

const VALIDATIONS_NEEDED = 3;

router.get('/', async (_req, res) => {
  const { rows } = await query(
    `SELECT a.*, u.name AS user_name, u.avatar_url
     FROM activities a
     JOIN users u ON u.id = a.user_id
     ORDER BY a.created_at DESC
     LIMIT 50`
  );
  res.json(rows);
});

router.post('/', authRequired, async (req, res) => {
  const { title, distance_km, duration_min, pace_per_km, route_image_url, description } = req.body;
  if (!distance_km || !duration_min) return res.status(400).json({ error: 'Distancia y duración requeridos' });

  const { rows } = await query(
    `INSERT INTO activities (user_id, title, distance_km, duration_min, pace_per_km, route_image_url, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [req.user.id, title, distance_km, duration_min, pace_per_km, route_image_url, description]
  );
  res.json(rows[0]);
});

router.post('/:id/validate', authRequired, async (req, res) => {
  const activityId = req.params.id;

  const actQ = await query('SELECT user_id FROM activities WHERE id = $1', [activityId]);
  if (!actQ.rows[0]) return res.status(404).json({ error: 'Actividad no encontrada' });
  if (actQ.rows[0].user_id === req.user.id) {
    return res.status(400).json({ error: 'No puedes validar tu propia actividad' });
  }

  try {
    await query(
      'INSERT INTO validations (activity_id, validator_id) VALUES ($1, $2)',
      [activityId, req.user.id]
    );
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Ya validaste esta actividad' });
    throw e;
  }

  const upd = await query(
    `UPDATE activities
     SET validation_count = validation_count + 1,
         validated = (validation_count + 1) >= $2
     WHERE id = $1
     RETURNING *`,
    [activityId, VALIDATIONS_NEEDED]
  );

  if (upd.rows[0].validated) {
    await awardMedals(upd.rows[0].user_id);
  }
  res.json(upd.rows[0]);
});

async function awardMedals(userId) {
  await query(
    `UPDATE users SET
       total_activities = (SELECT COUNT(*) FROM activities WHERE user_id = $1 AND validated),
       total_km = COALESCE((SELECT SUM(distance_km) FROM activities WHERE user_id = $1 AND validated), 0)
     WHERE id = $1`,
    [userId]
  );

  await query(
    `INSERT INTO user_medals (user_id, medal_id)
     SELECT $1, m.id FROM medals m
     JOIN users u ON u.id = $1
     WHERE
       (m.required_km IS NULL OR u.total_km >= m.required_km)
       AND (m.required_activities IS NULL OR u.total_activities >= m.required_activities)
     ON CONFLICT DO NOTHING`,
    [userId]
  );
}

export default router;
