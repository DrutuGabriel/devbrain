const redisClient = require('./signin').redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization){
    return res.status(401).json({success: false, message: 'Unauthorized'});
  }

  return redisClient.get(authorization, (err, reply) => {
    if(err || !reply){
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    return next();
  })  
};

const getUserId = (authorization) => {

  if(!authorization){
    return null;
  }

  return new Promise((resv, rej) => {
    redisClient.get(authorization, (err, reply) => {
      if(err || !reply){
        return resv(null);
      }

      return resv(reply);
    });
  });
}

module.exports = {
  requireAuth: requireAuth,
  getUserId: getUserId
};