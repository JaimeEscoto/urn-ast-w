import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/pool.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password, city } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Faltan campos' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash, city)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, city`,
      [name, email, hash, city || null]
    );
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: rows[0], token });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email ya registrado' });
    res.status(500).json({ error: 'Error en registro' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (!rows[0]) return res.status(401).json({ error: 'Credenciales inválidas' });
  const ok = await bcrypt.compare(password, rows[0].password_hash);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
  const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const { password_hash, ...user } = rows[0];
  res.json({ user, token });
});

export default router;
