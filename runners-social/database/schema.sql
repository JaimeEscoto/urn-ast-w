-- RunnersHub Schema (Neon / PostgreSQL)

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  city VARCHAR(120),
  total_km NUMERIC(10,2) DEFAULT 0,
  total_activities INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clubs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  description TEXT,
  city VARCHAR(120),
  owner_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE club_members (
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (club_id, user_id)
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200),
  distance_km NUMERIC(6,2) NOT NULL,
  duration_min INT NOT NULL,
  pace_per_km VARCHAR(12),
  route_image_url TEXT,
  description TEXT,
  validated BOOLEAN DEFAULT FALSE,
  validation_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE validations (
  id SERIAL PRIMARY KEY,
  activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
  validator_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (activity_id, validator_id)
);

CREATE TABLE medals (
  id SERIAL PRIMARY KEY,
  code VARCHAR(60) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  required_km NUMERIC(8,2),
  required_activities INT
);

CREATE TABLE user_medals (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  medal_id INT REFERENCES medals(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, medal_id)
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(200),
  distance_km NUMERIC(6,2),
  cover_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE event_attendees (
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- Seed medallas base
INSERT INTO medals (code, name, description, icon, required_km, required_activities) VALUES
  ('5K_FINISHER',   '5K Finisher',      'Completaste tu primera carrera de 5K',  '🥉', 5,   1),
  ('10K_FINISHER',  '10K Finisher',     'Completaste tu primera carrera de 10K', '🥈', 10,  1),
  ('HALF_MARATHON', 'Media Maratón',    '21K completados',                       '🥇', 21,  1),
  ('CONSISTENT',    'Runner Consistente','10 actividades validadas',             '🔥', NULL, 10),
  ('CENTURY',       'Centurión',        '100 km acumulados',                     '💯', 100, NULL);

CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);
CREATE INDEX idx_events_date ON events(event_date);
