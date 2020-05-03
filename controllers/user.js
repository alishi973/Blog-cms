const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Error = require('../helpers/Error');

module.exports = {
  login: async ({ email, password }) => {
    const existUser = await User.findOne({ email, password: bcrypt.hash(password, +process.env.SALT) });
    if (!existUser) Error(404, 'User With Password NotFound');
    const token = jwt.sign(
      {
        id: `${existUser._id}`,
        email: existUser.email,
      },
      process.env.JWT,
      { expiresIn: '15m' },
    );
    return { token, userId: `${existUser._id}` };
  },
  signUp: async ({ user }) => {
    const existUser = await User.findOne({ email: user.email });
    //Validation
    if (existUser) throw new Error('User Exist');
    const newUser = new User(user);
    newUser.password = await bcrypt.hash(newUser.password, +process.env.SALT);
    newUser.save();
    return newUser;
  },
};
