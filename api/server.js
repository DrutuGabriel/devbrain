const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const db = require('knex')({
  client: 'pg',
  connection: {
    host: 'mydb',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});

const register =  require('./controllers/register');
const signIn = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({'status': 'working well'});
});

app.post('/signin', (req, res) => (
  signIn.handleSignin(req, res, db, bcrypt)
));

app.post('/register', (req, res) => (
  register.handleRegister(req, res, db, bcrypt)
));

app.get('/profile/:id', (req, res) => (
  profile.handleProfileGet(req, res, db)
));

app.post('/profile/:id', (req, res) => (
  profile.handleProfileUpdate(req, res, db)
));

app.put('/image', (req, res) => (
  image.handleImage(req, res, db)
));

app.post('/image-url', image.handleApiCall);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});