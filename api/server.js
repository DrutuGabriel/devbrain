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

// db.select('*').from('users')
//   .then(data => console.log(data));

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@doe.com',
      password: 'thesecret',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Jane',
      email: 'jane@doe.com',
      password: 'secrets',
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@doe.com',
    },
  ],
};

app.get('/', (req, res) => {
  res.json(database);
});

app.post('/signin', (req, res) => {
  // console.log(database.users);

  // bcrypt.compare(
  //   'onesecret',
  //   '$2a$10$PLRnY9j3i7tuZBJo5jtkw.2Ae.BV1qXOlNsn2/rRnmOdkSM65SF/W',
  //   function (err, theres) {
  //     // res = false
  //     console.log('theres', theres);
  //   }
  // );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    const responseUser = {
      ...database.users[0],
    };
    delete responseUser.password;

    res.json({ success: true, user: responseUser });
  } else {
    res.status(400).json({ success: false, message: 'Error while loggin in' });
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, null, null, function (err, hash) {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: 'Unable to register.' });
    }

    return db('login')
      .insert({
        email: email,
        hash: hash,
      })
      .then(() => {
        db('users')
          .returning('*')
          .insert({
            name: name,
            email: email,
            // password: password,
            entries: 0,
            joined: new Date(),
          })
          .then((user) => res.json(user[0]))
          .catch((err) =>
            res
              .status(400)
              .json({ success: false, message: 'Unable to register.' })
          );
      })
      .catch((err) =>
        res.status(400).json({ success: false, message: 'Unable to register.' })
      );
  });
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  db.select('*')
    .from('users')
    .where('id', id)
    .then((user) => {
      if (user.length === 0) {
        res.status(404).json({ success: false, message: 'Not such user.' });
      }

      res.json(user[0]);
    })
    .catch((err) =>
      res.status(400).json({ success: false, message: 'Unable to find user.' })
    );
});

app.put('/image', (req, res) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json({ success: true, entries: entries[0] });
    })
    .catch((err) =>
      res.status(404).json({ success: false, message: 'Unable to process' })
    );
});

app.listen(8000, () => {
  console.log('app is running on port 8000');
});
