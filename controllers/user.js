const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ShowError = require('../helpers/ShowError');
const { santizeExclude } = require('../helpers/Santizer');

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
  editUser: async ({ user }, req) => {
    if (!req.userId) return ShowError(401, 'You Must Login!');
    const userDB = await User.findById(req.userId);
    if (!userDB) return ShowError(404, 'User NotFound!');

    user = santizeExclude(user, ['avatar', 'status']);

    if (user.password.newPassword && bcrypt.compareSync(user.password.oldPassword, userDB.password)) {
      const password = await bcrypt.hash(user.password.newPassword, +process.env.SALT);
      // Object.assign(userDB, { password });
      userDB.password = password;
    } else return ShowError(403, 'Password Incorrect');

    if (user.email) {
      userDB.email = user.email;
      //send email with jwt in link
    }

    userDB.avatar = user.avatar;
    userDB.status = user.status;
    return await userDB.save();
  },
};
