require('dotenv').config();
require('./clients/db');
const express = require('express');
const Boom = require('boom');
const cors = require('cors');
const routes = require('./routes');
const auth = require('./controllers/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use((req, res, next) => {
  return next(Boom.notFound("This route does not exist."));
});

app.use((err, req, res, next) => {
  console.log(err);

  if (err) {
    if (err.output) {
      return res.status(err.output.statusCode || 500).json(err.output.payload);
    }

    return res.status(500).json(err);
  }
});

const deleteInactiveUsersInterval = setInterval(() => {
  auth.deleteInactiveUsers();
}, 12 * 60 * 60 * 1000);

app.listen(4000, () => console.log("Server is up!"));
