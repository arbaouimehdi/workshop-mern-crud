const Query = {
  publishedPosts(root, args, context) {
    return context.prisma.posts({ where: { published: true } });
  },
  post(root, args, context) {
    return context.prisma.post({ id: args.postId });
  },
  postsByUser(root, args, context) {
    return context.prisma
      .user({
        id: args.userId
      })
      .posts();
  }
};

module.exports = Query;
