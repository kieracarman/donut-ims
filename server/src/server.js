const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');

require('dotenv').config();

const auth = require('./routes/users');
const inventory = require('./routes/inventory');

const app = express();
const port = process.env.PORT || 4000;

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static('client/build/'));

  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build/'));
  });
}

// Initialize connection once and create connection pool
mongoose
  .connect(
    process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Routes that should handle requests
app.use('/auth', auth);
app.use('/inv', inventory);

// Catch errors that go beyond the above routes
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Passes direct errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
  next(error);
});

app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
