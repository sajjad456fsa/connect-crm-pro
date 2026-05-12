const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway') ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// JWT middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'connect-crm-secret');
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Initialize DB tables
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        company VARCHAR(255),
        status VARCHAR(50) DEFAULT 'lead',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS deals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        contact_id INTEGER REFERENCES contacts(id),
        title VARCHAR(255) NOT NULL,
        value DECIMAL(10,2),
        stage VARCHAR(50) DEFAULT 'prospecting',
        probability INTEGER DEFAULT 0,
        close_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Seed admin user
    const adminExists = await pool.query("SELECT id FROM users WHERE email = 'admin@connectcrm.com'");
    if (adminExists.rows.length === 0) {
      const hash = await bcrypt.hash('Sajjad786', 10);
      await pool.query(
        "INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)",
        ['admin@connectcrm.com', hash, 'Admin User', 'admin']
      );
      console.log('Admin user created: admin@connectcrm.com / Sajjad786');
    }
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('DB init error:', err.message);
  }
}

// AUTH ROUTES
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'connect-crm-secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  const result = await pool.query('SELECT id, email, name, role FROM users WHERE id = $1', [req.user.id]);
  res.json(result.rows[0]);
});

// CONTACTS ROUTES
app.get('/api/contacts', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM contacts WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
  res.json(result.rows);
});

app.post('/api/contacts', auth, async (req, res) => {
  const { name, email, phone, company, status, notes } = req.body;
  const result = await pool.query(
    'INSERT INTO contacts (user_id, name, email, phone, company, status, notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
    [req.user.id, name, email, phone, company, status || 'lead', notes]
  );
  res.json(result.rows[0]);
});

app.put('/api/contacts/:id', auth, async (req, res) => {
  const { name, email, phone, company, status, notes } = req.body;
  const result = await pool.query(
    'UPDATE contacts SET name=$1, email=$2, phone=$3, company=$4, status=$5, notes=$6, updated_at=NOW() WHERE id=$7 AND user_id=$8 RETURNING *',
    [name, email, phone, company, status, notes, req.params.id, req.user.id]
  );
  res.json(result.rows[0]);
});

app.delete('/api/contacts/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM contacts WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// DEALS ROUTES
app.get('/api/deals', auth, async (req, res) => {
  const result = await pool.query('SELECT d.*, c.name as contact_name FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id WHERE d.user_id = $1 ORDER BY d.created_at DESC', [req.user.id]);
  res.json(result.rows);
});

app.post('/api/deals', auth, async (req, res) => {
  const { title, value, stage, probability, close_date, contact_id } = req.body;
  const result = await pool.query(
    'INSERT INTO deals (user_id, contact_id, title, value, stage, probability, close_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
    [req.user.id, contact_id, title, value, stage || 'prospecting', probability || 0, close_date]
  );
  res.json(result.rows[0]);
});

// DASHBOARD STATS
app.get('/api/dashboard', auth, async (req, res) => {
  const [contacts, deals, revenue] = await Promise.all([
    pool.query('SELECT COUNT(*) as total, status FROM contacts WHERE user_id=$1 GROUP BY status', [req.user.id]),
    pool.query('SELECT COUNT(*) as total, stage FROM deals WHERE user_id=$1 GROUP BY stage', [req.user.id]),
    pool.query("SELECT SUM(value) as total FROM deals WHERE user_id=$1 AND stage='closed_won'", [req.user.id])
  ]);
  res.json({
    contacts: contacts.rows,
    deals: deals.rows,
    revenue: revenue.rows[0]?.total || 0
  });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Start server
app.listen(PORT, async () => {
  console.log('Connect CRM Pro running on port ' + PORT);
  if (process.env.DATABASE_URL) {
    await initDB();
  } else {
    console.log('No DATABASE_URL set - database features disabled');
  }
});

module.exports = app;
