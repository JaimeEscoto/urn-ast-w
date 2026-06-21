import { Router } from 'express';
import { query } from '../db/pool.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const { rows } = await query(
    `SELECT e.*, c.name AS club_name,
       (SELECT COUNT(*) FROM event_attendees WHERE event_id = e.id) AS attendees
     FROM events e
     LEFT JOIN clubs c ON c.id = e.club_id
     WHERE e.event_date >= NOW()
     ORDER BY e.event_date ASC`
  );
  res.json(rows);
});

router.post('/', authRequired, async (req, res) => {
  const { club_id, title, description, event_date, location, distance_km, cover_image_url } = req.body;
  const { rows } = await query(
    `INSERT INTO events (club_id, title, description, event_date, location, distance_km, cover_image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [club_id, title, description, event_date, location, distance_km, cover_image_url]
  );
  res.json(rows[0]);
});

router.post('/:id/join', authRequired, async (req, res) => {
  try {
    await query(
      'INSERT INTO event_attendees (event_id, user_id) VALUES ($1, $2)',
      [req.params.id, req.user.id]
    );
    res.json({ joined: true });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Ya estás inscrito' });
    throw e;
  }
});

export default router;
