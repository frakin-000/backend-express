const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT
)`);

router.get('/', function(req, res, next) {
  db.all("SELECT id, name FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'DB error' });
    }
    res.json({ items: rows });
  });
});

router.post('/', function(req, res, next) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const insert = "INSERT INTO users (name) VALUES (?)";

  db.run(insert, [name], function(err) {
    if (err) {
      return res.status(500).json({ error: 'DB error' });
    }

    const newUser = {
      id: this.lastID,
      name: name
    };

    res.status(201).json(newUser);
  });
});

router.get('/:id', function(req, res, next) {
  const id = req.params.id;

  db.get("SELECT id, name FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'DB error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(row);
  });
});

module.exports = router;