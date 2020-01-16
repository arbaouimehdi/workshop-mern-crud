const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils/global");

const Mutation = {
  /**
   *
   * Sign up
   *
   */
  async signup(parent, args, context) {
    const password = await bcrypt.hash(args.password, 10);

    const user = await context.prisma.createUser({ ...args, password });

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    context.response.cookie("token", token, {
      httpOnly: false,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });

    return {
      token,
      user
    };
  },

  /**
   *
   * Sign In
   *
   */
  async login(parent, args, context) {
    // 1
    const user = await context.prisma.user({ email: args.email });
    // console.log("user: ", user)
    if (!user) {
      throw new Error("No such user found");
    }

    // 2
    const valid = await bcrypt.compare(args.password, user.password);

    if (!valid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { userId: await user.id, claims: "read-users" },
      APP_SECRET
    );

    context.response.cookie("token", token, {
      httpOnly: false,
      // secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });

    // 3
    return {
      token,
      user
    };
  },

  /**
   *
   * Logout
   *
   */
  logout(parent, args, context) {
    context.response.clearCookie("token");
    return { message: "Goodbye!" };
  },

  /**
   *
   * Add a New Post
   *
   */
  addPost(parent, args, context) {
    if (args.title.length < 5) {
      throw new Error("Please add a Title");
    }

    return context.prisma.createPost({
      title: args.title,
      published: args.published,
      author: {
        connect: { id: args.userId }
      }
    });
  },

  /**
   *
   * Remove a Post
   *
   */
  removePost(parent, args, context) {
    console.log(args.postId);

    return context.prisma.deletePost({
      id: args.postId
    });
  }
};

module.exports = Mutation;
