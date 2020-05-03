const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    images: [{ type: String, required: false }],
    content: { type: String, required: true },
    summary: { type: String, default: '' },
    slug: { type: String, default: '' },
    like: [{ type: String }],
    comments: [{ user: String, text: String, date: Date, refer_to: Schema.Types.ObjectId }],
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);
postSchema.pre('save', function (next) {
  let self = this;
  if (!self.summary) self.summary = `${self.content.slice(0, 50)}...`;
  self.slug = `${self.title.replace(/\ /g, '-')}-${Date.now()}`;
  next();
});

postSchema.methods.LikePost = function ({ id }) {
  let post = this.findById(id);
  post.like.push('akjhsdkjasd');
  return post.save();
};

module.exports = mongoose.model('Post', postSchema);
