const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ShowError = require('../helpers/ShowError');

module.exports = {
  login: async ({ email, password }) => {
    const existUser = await User.findOne({ email });
    if (!existUser || !bcrypt.compareSync(password, existUser.password)) return ShowError(404, 'User With Password NotFound');
    const token = jwt.sign(
      {
        id: `${existUser._id}`,
        email: existUser.email,
      },
      process.env.JWT,
      { expiresIn: '15m' },
    );
    return { token: token, userId: `${existUser._id}` };
  },
  signUp: async ({ user }) => {
    const existUser = await User.findOne({ email: user.email });
    //TODO:Add Validation
    if (existUser) throw ShowError('User Exist');
    const newUser = new User(user);
    newUser.password = await bcrypt.hash(newUser.password, +process.env.SALT);
    newUser.save();
    return newUser;
  },
};
