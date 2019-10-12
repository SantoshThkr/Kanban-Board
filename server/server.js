const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', function (req, res) {
  res.json({ status: 'ok', message: 'Kanban API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log('Server running on port ' + PORT);
});

module.exports = app;
