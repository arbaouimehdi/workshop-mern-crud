const Post = {
  author(root, args, context) {
    return context.prisma
      .post({
        id: root.id
      })
      .author();
  }
};

module.exports = Post;
