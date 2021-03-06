const ShowError = require('../helpers/ShowError');
const { santize } = require('../helpers/Santizer');
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
  editPost: async ({ postId, postData }, req) => {
    const post = await Post.findById(postId, { createdAt: 0, updatedAt: 0, comments: 0, likes: 0, views: 0 });
    if (!post) return ShowError(404, 'Post NotFound!');
    if (post.creator != req.userId) return ShowError(403, 'Only Author Can Edit Own Post!');
    postData = santize(postData);
    return await post.editPost(postData);
  },
  posts: async ({ page = 1 }) => {
    const allPost = await Post.find().sort('-createdOn').populate('creator');
    const paginationStart = 10 * (page - 1) + (page == 1 ? 0 : 1);
    const paginationEnd = 10 * page;
    console.log(allPost[0].summary);
    return { posts: allPost.slice(paginationStart, paginationEnd), totalPosts: Post.countDocuments() };
  },
  likePost: async ({ id }, req) => {
    const post = await Post.findById(id);
    return post.LikePost(req);
  },
  dislikePost: async ({ id }, req) => {
    const post = await Post.findById(id);
    return post.disLikePost(req);
  },
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
