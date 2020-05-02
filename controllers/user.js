const User = require('../models/users');
const bcrypt = require('bcrypt');

module.exports = {
  login: async ({ email, password }) => {
    const existUser = await User.findOne({ email, password: bcrypt.hash(password, +process.env.SALT) });
    console.log(existUser)
    return {  };
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
