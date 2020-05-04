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
  post: async ({ search }, req) => {
    let targetPost = await Post.findPost(search, req.connection.remoteAddress);
    if (targetPost === 404) return ShowError(404, 'Post NotFound!');
    targetPost.view = { mutual: targetPost.views.indexOf(req.connection.remoteAddress) !== -1 ? true : false, count: targetPost.views.length };
    targetPost.likes = { mutual: targetPost.likes.indexOf(req.connection.remoteAddress) !== -1 ? true : false, count: targetPost.likes.length };
    return targetPost;
  },
  likePost: async ({ id }, req) => await Post.LikePost(id, req.connection.remoteAddress),
  dislikePost: async ({ id }, req) => await Post.disLikePost(id, req.connection.remoteAddress),
  addComment: async ({ comment }, req) => {
    const post = await Post.findById(comment.onPost);
    if (!post) return ShowError(404, 'Post NotFound!');
    const date = Date.now();
    const user = req.userId || comment.name;
    const newComment = post.addComment({ text: comment.text, user, date, refer_to: comment.refer_to });
    return newComment;
  },
  deleteComment: async ({ commentId, onPost }, req) => {
    const post = await Post.findById(onPost);
    if (!post) return ShowError(404, 'Post NotFound!');
    const targetComment = post.comments.find((comment) => comment.id == commentId);
    if (!targetComment) return ShowError(404, 'Comment NotFound!');
    return targetComment.user === req.userId ? post.deleteComment(commentId) : false;
  },
};
