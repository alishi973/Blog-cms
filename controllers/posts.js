const ShowError = require('../helpers/ShowError');
const Post = require('../models/post');
module.exports = {
  addPost: async (post, req) => {
    if (!req.isAuth) return ShowError(403, 'You Must Be Authorized');
    //TODO: Add Validation
    const newPost = new Post({ title: post.post.title, images: post.post.images || [], content: post.post.content, creator: req.userId });
    await newPost.save();
    return newPost;
  },
  post: async ({ search }) => {
    try {
      return (
        (await Post.findById(search.id).populate('creator', '-password')) ||
        (await Post.findOne({ slug: search.slug }).populate('creator', '-password'))
      );
    } catch (err) {
      return ShowError(404, 'Post NotFound!');
    }
  },
  likePost: ({ id }) => {
    Post.LikePost(id);
  },
};
