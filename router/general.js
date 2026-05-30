const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let { isValid, users } = require('./auth_users.js');
const public_users = express.Router();

const BASE_URL = 'http://localhost:5000';

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/', async (req, res) => {
  try {
    const result = await new Promise((resolve) => resolve(books));
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const result = await new Promise((resolve, reject) => {
      const book = books[isbn];
      book ? resolve(book) : reject("Book not found");
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const result = await new Promise((resolve, reject) => {
      const found = Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase());
      found.length > 0 ? resolve(found) : reject("No books found");
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const result = await new Promise((resolve, reject) => {
      const found = Object.values(books).filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
      found.length > 0 ? resolve(found) : reject("No books found");
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
