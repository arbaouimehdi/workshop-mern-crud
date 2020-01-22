// Accessing Environment Variables
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});

const { prisma } = require("./generated/prisma-client");
const { GraphQLServer } = require("graphql-yoga");
const cors = require("cors");

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
  typeDefs: __dirname + "/schema.graphql",
  resolvers,
  context: request => {
    return { ...request, prisma };
  }
});

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.PRODUCTION_FRONTEND_URL, process.env.PRODUCTION_ADMIN_URL]
      : ["http://localhost:3000", "http://localhost:6555"],
  credentials: true
};

console.log(corsOptions);

server.express.use(cors(corsOptions));

server.express.use(cookieParser());

// 2. decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    // console.log("token", token);
    const { userId } = jwt.verify(token, APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
    // console.log("userId", userId);
  }
  next();
});

// 3. Create a middleware that populates the user on each request

server.express.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();

  const user = await prisma.user({ id: req.userId });
  req.user = user;
  // console.log("req.user", JSON.stringify(req.user));

  next();
});

server.start(
  {
    port: process.env.PORT,
    cors: {
      credentials: true,
      origin:
        process.env.NODE_ENV === "production"
          ? [
              process.env.PRODUCTION_ADMIN_URL,
              process.env.PRODUCTION_FRONTEND_URL
            ]
          : ["http://localhost:3000", "http://localhost:6555"]
    }
  },
  () => console.log("Server is running on http://localhost:7777")
);
