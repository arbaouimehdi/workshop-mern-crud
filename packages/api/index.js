// Accessing Environment Variables
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});

const { prisma } = require("./client");
const { GraphQLServer } = require("graphql-yoga");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Resolvers
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const Post = require("./resolvers/Post");
const User = require("./resolvers/User");

const resolvers = {
  Query,
  Mutation,
  User,
  Post
};

const options = {
  port: process.env.PORT,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground",
  cors: {
    credentials: true,
    origin: "http://localhost:6555"
  }
};

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers,
  context: {
    prisma
  }
});

server.express.use(cookieParser());

// 2. decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    console.log("token", token);
    const { userId } = jwt.verify(token, APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
    console.log("userId", userId);
  }
  next();
});

// 3. Create a middleware that populates the user on each request

server.express.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();

  const user = await prisma.user({ id: req.userId });
  req.user = user;
  console.log("req.user", JSON.stringify(req.user));

  next();
});

server.start(options, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`
  )
);
