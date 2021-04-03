const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('Incorrect form submission');
  }

  return db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);

      if (isValid) {
        return db.select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => user[0]);
      } else {
         return Promise.reject('Error while loggin in');
      }
    })
    .catch((err) => Promise.reject('Error while loggin in'));
};

const getAuthTokenId = () => {
  console.log('auth ok');
};

const auth = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;

  return authorization 
    ? getAuthTokenId() 
    : handleSignin(req, res, db, bcrypt)
      .then(data => res.json({success: true, user: data}))
      .catch(err => res.status(400).json({success: false, error: err}));
};

module.exports = {
  auth: auth,
};
