const handleProfile = (req, res, db) => {
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

module.exports = {
  handleProfile: handleProfile
};