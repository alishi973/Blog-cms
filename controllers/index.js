const userController = require('./user');
const postController = require('./posts');

module.exports = {
  ...userController,
  ...postController,
};
