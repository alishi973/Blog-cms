const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  avatar: { type: String, default: '' },
  password: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, default: 'I am new!' },
});

module.exports = mongoose.model('User', userSchema);
