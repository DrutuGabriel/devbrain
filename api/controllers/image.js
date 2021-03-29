const handleImage = (req, res, db) => {
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
};

module.exports = {
  handleImage: handleImage
};