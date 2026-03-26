CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'trainer')) NOT NULL,
  branch VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  branch VARCHAR(100),
  status VARCHAR(30) DEFAULT 'applied' CHECK (status IN (
    'applied', 'psychometric', 'interview', 'training', 'incubation', 'agent', 'rejected'
  )),
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS psychometric_tests (
  id SERIAL PRIMARY KEY,
  candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
  score INT,
  passed BOOLEAN,
  taken_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interviews (
  id SERIAL PRIMARY KEY,
  candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP,
  interviewer_id INT REFERENCES users(id),
  outcome VARCHAR(20) CHECK (outcome IN ('pending', 'passed', 'failed')) DEFAULT 'pending',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS training (
  id SERIAL PRIMARY KEY,
  candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
  trainer_id INT REFERENCES users(id),
  date DATE,
  attended BOOLEAN DEFAULT false,
  roleplay_score INT,
  assessment_passed BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS incubation (
  id SERIAL PRIMARY KEY,
  candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
  day INT CHECK (day BETWEEN 1 AND 5),
  sales_count INT DEFAULT 0,
  target_met BOOLEAN DEFAULT false,
  logged_at TIMESTAMP DEFAULT NOW()
);