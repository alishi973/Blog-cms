module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.DOMAIN);
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
};
