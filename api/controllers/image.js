const Clarifai = require('clarifai');

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY, // New key, the old exposed key was changed
});


const handleApiCall = (req, res) => {
  return clarifaiApp.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => res.json(data));
}


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
  handleImage: handleImage,
  handleApiCall: handleApiCall
};
