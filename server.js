const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/team_management')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper: read DB
function readDB() {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Helper: write DB
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ─── PAGES ─────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ─── API: COMPANY INFO ──────────────────────────────────────────────────────

app.get('/api/company', (req, res) => {
  const db = readDB();
  res.json(db.company);
});

app.put('/api/company', (req, res) => {
  const db = readDB();
  db.company = { ...db.company, ...req.body };
  writeDB(db);
  res.json({ success: true, company: db.company });
});

// ─── API: TEAM MEMBERS ──────────────────────────────────────────────────────

app.get('/api/team', (req, res) => {
  const db = readDB();
  let team = db.team;

  // Search by name
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    team = team.filter(m => m.name.toLowerCase().includes(q) || m.bio.toLowerCase().includes(q));
  }

  // Filter by department/role
  if (req.query.department && req.query.department !== 'All') {
    team = team.filter(m => m.department === req.query.department);
  }

  res.json(team);
});

app.get('/api/team/:id', (req, res) => {
  const db = readDB();
  const member = db.team.find(m => m.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  res.json(member);
});

app.post('/api/team', (req, res) => {
  const db = readDB();
  const newMember = {
    id: uuidv4(),
    name: req.body.name || '',
    role: req.body.role || '',
    department: req.body.department || 'Developer',
    bio: req.body.bio || '',
    image: req.body.image || `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(req.body.name || 'Member')}`,
    social: {
      linkedin: req.body.linkedin || '',
      github: req.body.github || '',
      twitter: req.body.twitter || ''
    }
  };
  db.team.push(newMember);
  writeDB(db);
  res.status(201).json({ success: true, member: newMember });
});

app.put('/api/team/:id', (req, res) => {
  const db = readDB();
  const idx = db.team.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Member not found' });

  db.team[idx] = {
    ...db.team[idx],
    name: req.body.name || db.team[idx].name,
    role: req.body.role || db.team[idx].role,
    department: req.body.department || db.team[idx].department,
    bio: req.body.bio || db.team[idx].bio,
    image: req.body.image || db.team[idx].image,
    social: {
      linkedin: req.body.linkedin !== undefined ? req.body.linkedin : db.team[idx].social.linkedin,
      github: req.body.github !== undefined ? req.body.github : db.team[idx].social.github,
      twitter: req.body.twitter !== undefined ? req.body.twitter : db.team[idx].social.twitter
    }
  };

  writeDB(db);
  res.json({ success: true, member: db.team[idx] });
});

app.delete('/api/team/:id', (req, res) => {
  const db = readDB();
  const idx = db.team.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Member not found' });

  db.team.splice(idx, 1);
  writeDB(db);
  res.json({ success: true });
});

// ─── START ──────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 NexaStudio About Page running at http://localhost:${PORT}`);
  console.log(`🔧 Admin Panel: http://localhost:${PORT}/admin\n`);
});
