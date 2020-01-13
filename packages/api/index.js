// Accessing Environment Variables
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});

const { prisma } = require("./client");
const { GraphQLServer } = require("graphql-yoga");

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
    credentials: true
  }
};

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers,
  context: {
    prisma
  }
});

server.start(options, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`
  )
);
