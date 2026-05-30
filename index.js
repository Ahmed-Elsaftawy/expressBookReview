const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

const { authenticated } = require('./router/auth_users.js');
const { general } = require('./router/general.js');

app.use('/customer/auth', (req, res, next) => {
  if (req.session.authorization) {
    const token = req.session.authorization.accessToken;
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({ message: "Not logged in" });
  }
});

app.use('/customer', authenticated);
app.use('/', general);

app.listen(5000, () => console.log('Server running on port 5000'));
