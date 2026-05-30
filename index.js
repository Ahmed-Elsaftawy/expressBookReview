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
  const token = req.headers['authorization']?.split(' ')[1] || req.session.authorization?.accessToken;
  if (!token) return res.status(401).json({ message: "Not logged in" });
  jwt.verify(token, "fingerprint_customer", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    req.session.authorization = { accessToken: token, username: decoded.username };
    next();
  });
});

app.use('/customer', authenticated);
app.use('/', general);

app.listen(5000, () => console.log('Server running on port 5000'));
