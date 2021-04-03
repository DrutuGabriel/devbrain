const Clarifai = require('clarifai');
const getUserId = require('./auth').getUserId;

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY, // New key, the old exposed key was changed
});

const handleApiCall = (req, res, db) => {
  // Get user ID from req.headers.authorization
  const { authorization } = req.headers;
  getUserId(authorization).then((userId) => {
    // check how many entries the user has
    db.select('*')
      .from('users')
      .where('id', userId)
      .then((user) => {
        if (user.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: 'Not such user.' });
        }

        // limit at 20
        if (user[0].entries <= 20) {
          return clarifaiApp.models
            .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
            .then((data) => res.json({success:true, faceData: data}));
        } else {
          res
            .status(403)
            .json({
              success: false,
              message: 'You have reached the maximum face detections.',
            });
        }
      })
      .catch((err) =>
        res
          .status(400)
          .json({ success: false, message: 'Unable to find user.' })
      );
  });
};

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
  handleApiCall: handleApiCall,
};
