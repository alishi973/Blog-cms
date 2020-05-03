const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  let currentToken = req.get('Authorization');
  if (!currentToken) {
    req.isAuth = false;
    return next();
  }
  currentToken = currentToken.indexOf(' ') !== 0 ? currentToken : currentToken.split(/\ /)[1];
  let decode;
  try {
    decode = jwt.verify(currentToken, process.env.JWT);
  } catch (err) {
    //Refresh Token
    if (err.name === 'TokenExpiredError') {
      decode = jwt.decode(currentToken, process.env.JWT);
      const newJWT = jwt.sign({ email: decode.email, id: decode.id }, process.env.JWT, { expiresIn: '15m' });
      res.setHeader('Set-Cookie', newJWT);
      /* res.cookie('JWT', newJWT); */
    } else {
      req.isAuth = false;
      return next();
    }
  }
  req.isAuth = true;
  req.userId = decode.id;
  return next();
};
