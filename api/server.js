const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());


const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@doe.com',
      password: 'thesecret',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Jane',
      email: 'jane@doe.com',
      password: 'secrets',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res)=>{
  res.send('This is working');
});

app.post('/signin', (req, res) => {
  console.log(database.users);
  if(
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ){
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }

});

app.post('/register', (req, res) => {
  const {email, name, password} = req.body;

  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });

  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  const user = database.users.find(user => user.id === id);

  if(user){
    res.json(user);
  } else {
    res.status(404).json("no such user")
  }
});

app.put('/image', (req, res) => {
  const {id} = req.body;
  const user = database.users.find(user => user.id === id);

  if(user){
    user.entries += 1;
    res.json(user.entries);
  } else {
    res.status(404).json("no such user")
  }
});

app.listen(8000, () => {
  console.log('app is running on port 8000');
});