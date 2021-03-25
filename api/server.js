const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
    console.log(hash);
  });

  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });

  const userResponse = {
    ...database.users[database.users.length - 1],
  };

  delete userResponse.password;

  res.json(userResponse);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  const user = database.users.find((user) => user.id === id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json('no such user');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  const user = database.users.find((user) => user.id === id);
  if (user) {
    user.entries += 1;
    res.json({ success: true, entries: user.entries });
  } else {
    res.status(404).json({ success: false, message: 'no such user' });
  }
});

app.listen(8000, () => {
  console.log('app is running on port 8000');
});
