const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Incorrect form submission.' });
  }

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
          .then((user) => res.json({
            success: true,
            user: user[0]
          }))
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
};

module.exports = {
  handleRegister: handleRegister,
};
