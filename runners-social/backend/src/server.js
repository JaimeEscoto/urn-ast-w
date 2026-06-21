import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import auth from './routes/auth.js';
import users from './routes/users.js';
import activities from './routes/activities.js';
import events from './routes/events.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'RunnersHub API' }));

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/activities', activities);
app.use('/api/events', events);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`RunnersHub API en :${port}`));
