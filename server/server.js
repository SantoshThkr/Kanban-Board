require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(function () {
    app.listen(PORT, function () {
      console.log('Server running on port ' + PORT);
    });
  })
  .catch(function (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
