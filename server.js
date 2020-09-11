require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');
const config = require('./config/main');

// Connect to DB
require('./helpers/db')();

// Middlewares
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({extended: false}));
app.use(cors());

// Routes
app.get('/', (req, res) => res.status(200).send('Server is Running...'));
app.use('/api', require('./routes/api'));

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}...`);
});
