const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    images: [{ type: String, required: false }],
    content: { type: String, required: true },
    summary: { type: String, default: '' },
    slug: { type: String, default: '' },
    views: [{ type: String, require: false, default: [] }],
    likes: [{ type: String, require: false, default: [] }],
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
  if (!self.slug) self.slug = `${self.title.replace(/\ /g, '-')}-${Date.now()}`;
  next();
});

postSchema.static({
  LikePost: async function (id, ip) {
    let Post = this.model('Post');
    let post = await Post.findById(id);
    if (post.likes && post.likes.indexOf(ip) > -1) {
      return { result: false, count: post.likes.length, mutual: true };
    } else {
      post.likes = [...(post.likes || []), ip];
      await post.save();
      return { result: true, count: post.likes.length, mutual: true };
    }
  },
  disLikePost: async function (id, ip) {
    let Post = this.model('Post');
    let post = await Post.findById(id);
    if (post.likes && post.likes.indexOf(ip) !== -1) {
      post.likes = post.likes.filter((eachLike) => eachLike !== ip && eachLike);
      await post.save();
      return { result: true, count: post.likes.length, mutual: false };
    } else {
      return { result: false, count: post.likes.length, mutual: false };
    }
  },
  findPost: async function (search, ip) {
    let Post = this.model('Post');
    try {
      const targetPost =
        (await Post.findById(search.id).populate('creator', '-password')) ||
        (await Post.findOne({ slug: search.slug }).populate('creator', '-password'));

      if (targetPost.views.indexOf(ip) === -1) targetPost.views = [...(targetPost.views || []), ip];
      await targetPost.save();
      return targetPost.toObject();
    } catch (err) {
      return 404;
    }
  },
});

module.exports = mongoose.model('Post', postSchema);
