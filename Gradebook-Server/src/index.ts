import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import path from "path";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import cors from "cors";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { createConnection } from "typeorm";
import { createUserLoader } from "./utils/createUserLoader";
import { PostResolver } from "./resolvers/post";
import { Upvote } from "./entities/Upvote";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";

const main = async () => {
  //   dropSchema: true,

  const connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "reddit",
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Upvote],
    synchronize: true,
    logging: true,
  })
    .then(() => {
      console.log("Database connected...");
    })
    .catch((error) => console.log(error));

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  //remove this
  app.get("/", (req, res) => {
    res.send("API running");
  });

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
        disableTTL: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "ckjsdncsdjcnsdlnc",
      resave: false,
    })
  );

  const apolloserver = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      userLoader: createUserLoader(),
      redis,
      upvoteLoading: createUpvoteLoader(),
    }),
  });

  apolloserver.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4001, () => {
    console.log("Listening on port 4001...");
  });
};

main().catch((err) => console.log(err));
