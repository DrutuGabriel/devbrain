const handleProfileGet = (req, res, db) => {
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
};

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;

  db('users')
    .where({ id })
    .update({ name, age, pet })
    .then((result) => {
      if (result) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false, message: 'Unable to update' });
      }
    })
    .catch((err) =>
      res.status(400).json({ success: false, message: 'Error updating user' })
    );
};

module.exports = {
  handleProfileGet: handleProfileGet,
  handleProfileUpdate: handleProfileUpdate,
};
