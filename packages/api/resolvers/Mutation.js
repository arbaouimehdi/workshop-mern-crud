const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils/global");

const Mutation = {
  //
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
  }
};

module.exports = Mutation;
