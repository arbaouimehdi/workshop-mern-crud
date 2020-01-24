// Accessing Environment Variables
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});

const { prisma } = require("./generated/prisma-client");
const { GraphQLServer } = require("graphql-yoga");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// Resolvers
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const Post = require("./resolvers/Post");
const User = require("./resolvers/User");

// Secret
const { APP_SECRET } = process.env;

// import schema stuff
if (process.env.NODE_ENV !== "production") {
  const { importSchema } = require("graphql-import");
  const fs = require("fs");

  const text = importSchema(__dirname + "/schema.graphql");
  fs.writeFileSync("./schema_prep.graphql", text);
}

const resolvers = {
  Query,
  Mutation,
  User,
  Post
};

const server = new GraphQLServer({
  typeDefs: __dirname + "/schema_prep.graphql",
  resolvers,
  context: request => {
    return { ...request, prisma };
  }
});

server.use(cookieParser());

// Decode the JWT so we can get the user Id on each request
server.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, APP_SECRET);
    req.userId = userId;
  }
  next();
});

// Create a middleware that populates the user on each request
server.use(async (req, res, next) => {
  if (!req.userId) return next();
  const user = await prisma.user({ id: req.userId });
  req.user = user;
  next();
});

server.start(
  {
    port: process.env.PORT,
    endpoint: "/graphql",
    subscriptions: "/subscriptions",
    playground: "/playground",
    cors: {
      credentials: true,
      origin: new RegExp("/*/")
    }
  },
  () => console.log(`Server is running on http://localhost:${process.env.PORT}`)
);
