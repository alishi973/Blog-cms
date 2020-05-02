const User = require('../models/users');
const bcrypt = require('bcrypt');

module.exports = {
  login: ({ email, password }) => {
    return { token: JSON.stringify(userInput) };
  },
  signUp: async ({ user }) => {
    const existUser = await User.findOne({ email: user.email });
    if (existUser) throw new Error('User Exist');
    const newUser = new User(user);
    newUser.password = await bcrypt.hash(newUser.password, +process.env.SALT);
    newUser.save();
    return newUser;
  },
};
