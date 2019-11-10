const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', function (req, res) {
  res.json({ status: 'ok', message: 'Kanban API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
