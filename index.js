const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// Initialize the database
const db = new sqlite3.Database('./attendance.db');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');

// Create attendance table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    date TEXT,
    time TEXT
  )`);
});

// Render the home page
app.get('/', (req, res) => {
  res.render('index');
});

// Mark attendance route
app.post('/mark-attendance', (req, res) => {
  const { name, date, time } = req.body;

  db.get('SELECT * FROM attendance WHERE name = ? AND date = ?', [name, date], (err, row) => {
    if (err) return res.status(500).send(err);

    if (!row) {
      db.run('INSERT INTO attendance (name, date, time) VALUES (?, ?, ?)', [name, date, time], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Attendance marked for ' + name);
      });
    } else {
      res.send('Attendance already marked for today.');
    }
  });
});

// Display attendance records
// Existing imports and middleware setup...

app.get('/attendance', (req, res) => {
  db.all('SELECT * FROM attendance', (err, rows) => {
    if (err) {
      console.error("Error fetching attendance records: ", err);
      return res.status(500).send("Error fetching attendance records.");
    }
    res.render('attendance', { rows });
  });
});


// Start the server
app.listen(3001, () => {
  console.log('Server started on http://localhost:3001');
});
