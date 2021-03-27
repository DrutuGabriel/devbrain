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

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({'status': 'working well'});
});

app.post('/signin', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

      if (isValid) {
        db.select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then((user) => {
            return res.json({ success: true, user: user[0] });
          });
      } else {
        res
          .status(400)
          .json({ success: false, message: 'Error while loggin in' });
      }
    })
    .catch((err) =>
      res.status(400).json({ success: false, message: 'Error while loggin in' })
    );
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        email: email,
        hash: hash,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        return trx('users')
          .returning('*')
          .insert({
            name: name,
            email: loginEmail[0],
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
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) =>
    res.status(400).json({ success: false, message: 'Unable to register.' })
  );
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
