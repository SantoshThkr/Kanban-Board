const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', function (req, res) {
  res.json({ status: 'ok', message: 'Kanban API is running' });
});

module.exports = app;
