const Query = {
  // Users List
  async users(root, args, context) {
    const users = await context.prisma.users();
    return users;
  },

  // Logged In User
  async me(root, args, context) {
    const user = await context.prisma.user({ id: context.request.user.id });
    console.log("me says:", user);
    return user;
  },

  //
  publishedPosts(root, args, context) {
    return context.prisma.posts({ where: { published: true } });
  },

  //
  post(root, args, context) {
    return context.prisma.post({ id: args.postId });
  },

  //
  postsByUser(root, args, context) {
    return context.prisma
      .user({
        id: args.userId
      })
      .posts();
  }
};

module.exports = Query;
