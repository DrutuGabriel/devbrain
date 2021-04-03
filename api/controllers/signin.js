const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
});

const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('Incorrect form submission');
  }

  return db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);

      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => user[0]);
      } else {
        return Promise.reject('Error while loggin in');
      }
    })
    .catch((err) => Promise.reject('Error while loggin in'));
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;

  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json({ success: false, message: 'Unauthorized' });
    }

    return res.json({ success: true, userId: reply, token: authorization });
  });
};

const signToken = (email) => {
  const jwtPayload = { email };

  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);

  return setToken(token, id)
    .then(() => ({
      token: token,
      success: true,
      userId: id,
    }))
    .catch(console.log);
};

const auth = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;

  return authorization
    ? getAuthTokenId(req, res)
    : handleSignin(req, res, db, bcrypt)
        .then((data) =>
          data.id && data.email ? createSession(data) : Promise.reject(data)
        )
        .then((data) => res.json(data))
        .catch((err) => res.status(400).json({ success: false, error: err }));
};

module.exports = {
  auth: auth,
};
