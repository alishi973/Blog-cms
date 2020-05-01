const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    images: { type: String, required: true },
    content: { type: String, required: true },
    comments: [{ user: String, text: String, date: Date, refer_to: Schema.Types.ObjectId }],
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Post', postSchema);
