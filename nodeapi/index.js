require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { connect } = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

connect(process.env.DBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connected'))
  .catch((e) => {
    console.log('Failed to connect to the database please check, ' + e.message);
  });

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//
app.use('/', authRoutes);
app.use('/', postRoutes);
app.use('/', userRoutes);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Server is runninng on port http://localhost:${port}`),
);
