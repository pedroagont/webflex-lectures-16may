// ----------------------- REQUIREMENTS
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

// Database
const fruitsDB = {
  a1q: {
    id: 'a1q',
    name: 'mango',
    color: 'yellow',
    emoji: '🥭'
  },
  w4f: {
    id: 'w4f',
    name: 'grape',
    color: 'purple',
    emoji: '🍇'
  }
};

const usersDB = [
  {
    id: 'ar5',
    email: 'user@example.com',
    password: 'abc123'
  }
];

// ----------------------- SETUP AND MIDDLEWARES
const app = express();
const port = 3000;

app.use(helmet()); // includes security headers (owasp)
app.use(morgan('dev')); // middleware that logs all the requests
app.use(express.json()); // allow requests to include json body

// ----------------------- ROUTES / ENDPOINTS
app.get('/', (req, res) => {
  res.send('<h1>Hello World! 🐳</h1><p>CRUD /api/fruits</p>');
});

app.get('/home', (req, res) => {
  res.status(200).send({ message: '🏡' });
});

// CRUD Operations
// CREATE - POST
app.post('/api/fruits', (req, res) => {
  const { name, color, emoji } = req.body;
  if (!name || !color || !emoji) {
    return res
      .status(400)
      .send({ message: 'Provide name, color and emoji to create a fruit' });
  }

  let id = Math.random()
    .toString(36)
    .substr(2, 3);

  fruitsDB[id] = {
    id,
    name,
    color,
    emoji
  };

  res.status(201).send({ message: 'Created!', fruit: fruitsDB[id] });
});

// READ - GET
// Read All
app.get('/api/fruits', (req, res) => {
  res.status(200).send({ message: 'List of all fruits!', fruits: fruitsDB });
});

// Read One
app.get('/api/fruits/:id', (req, res) => {
  const { id } = req.params;

  const fruit = fruitsDB[id];
  if (!fruit) {
    return res.status(404).send({ message: 'Sorry, fruit not found' });
  }

  res.status(200).send({ message: 'Here is your fruit!', fruit });
});

// UPDATE - PUT
app.put('/api/fruits/:id', (req, res) => {
  const { name, color, emoji } = req.body;
  if (!name || !color || !emoji) {
    return res
      .status(400)
      .send({ message: 'Provide name, color and emoji to update a fruit' });
  }

  const { id } = req.params;

  let fruit = fruitsDB[id];
  if (!fruit) {
    return res.status(404).send({ message: 'Sorry, fruit not found' });
  }

  fruitsDB[id] = {
    id,
    name,
    color,
    emoji
  };

  res.status(201).send({ message: 'Updated!', fruit: fruitsDB[id] });
});

// DELETE - DELETE
app.delete('/api/fruits/:id', (req, res) => {
  const { id } = req.params;

  let fruit = fruitsDB[id];
  if (!fruit) {
    return res.status(404).send({ message: 'Sorry, fruit not found' });
  }

  delete fruitsDB[id];
  res.status(204).send();
});

// AUTHENTICATION ROUTES
// Register
app.post('/api/auth/register', (req, res) => {
  // Body validation
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: 'You need to provide email and password to register' });
  }

  // Email is not repeated validation
  const emailExists = usersDB.find(u => u.email === email);
  if (emailExists) {
    return res.status(400).send({ message: 'Email already exists' });
  }

  // Creating new user id
  const id = Math.random()
    .toString(36)
    .substr(2, 3);

  // Hashing password with bcrypt
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Creating new user object
  const newUser = {
    id,
    email,
    password: hashedPassword
  };

  // Adding the new user object into the DB
  usersDB.push(newUser);
  console.log(usersDB)

  // Respond back to client
  res.status(200).send({ message: 'User registered!', user: newUser });
});

// Login
app.post('/api/auth/login', (req, res) => {
  // Body validation
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: 'You need to provide email and password to login' });
  }

  // Existing user validation
  const user = usersDB.find(u => u.email === email);
  if (!user) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }

  // Passwords matching validation
  const passwordsMatch = bcrypt.compareSync(password, user.password);
  if (!passwordsMatch) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }

  // Respond back to client
  res.status(200).send({ message: 'Welcome!' });
});

// Catch all route
app.use((req, res) => {
  res.status(404).send({ message: 'URL Not found' });
});

// ----------------------- LISTENER
app.listen(port, () => console.log(`Example app listening on port ${port}`));
