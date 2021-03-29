const handleSignin = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleSignin: handleSignin
};