module.exports = (statusCode, ErrorText) => {
  const error = new Error(ErrorText);
  error.code = statusCode || 500;
  throw error;
};
