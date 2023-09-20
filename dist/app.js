"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv/config');
require('./clients/db');
var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _boom = require('boom'); var _boom2 = _interopRequireDefault(_boom);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _routes = require('./routes'); var _routes2 = _interopRequireDefault(_routes);
var _auth = require('./controllers/auth'); var _auth2 = _interopRequireDefault(_auth);

const app = _express2.default.call(void 0, );

app.use(_cors2.default.call(void 0, ));
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: true }));

app.use(_routes2.default);

app.use((req, res, next) => {
  return next(_boom2.default.notFound("This route does not exist."));
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
  _auth2.default.deleteInactiveUsers();
}, 12 * 60 * 60 * 1000);

app.listen(4000, () => console.log("Server is up!"));
