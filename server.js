import mongoose from "mongoose";
import dotenv from "dotenv";
import resolvers from "./resolvers.js";
import typeDefs from "./typeDefs.js";
import { createServer } from "@graphql-yoga/node";

dotenv.config();

// Create your server
const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
});

// DB set-up
mongoose.Promise = global.Promise;

const connection = mongoose.connect("mongodb://127.0.0.1:27017/ibismall", {
  useNewUrlParser: true,
});

connection
  .then((db) => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });

// Start the server and explore http://localhost:4000/graphql
server.start();
