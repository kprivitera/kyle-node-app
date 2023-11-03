import _ from "lodash";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import gql from "graphql-tag";
import http from "http";
import multer from "multer";
import path from "path";
import pkg from "body-parser";

import { DocumentNode } from "graphql";
import { verify } from "./utils/jwt";
import getSchema from "./utils/get-schema";
import fileUploadController from "./routes/file-upload";
import getMulterConfig from "./models/file-upload/utils/get-multer-config";
import initialiseCron from "./utils/initialise-cron";

dotenv.config(); //Reads .env file and makes it accessible via process.env

const { json } = pkg;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// __dirname not available for esModules.  Basically path to this directory.
const __dirname: string = new URL(".", import.meta.url).pathname;
// an array of apollo directory names eg. ['people', 'recipes']
const apolloDirectoryPath: string = path.join(__dirname, "/apollo");
const { typeDefs, resolvers }: { typeDefs: DocumentNode[]; resolvers: any[] } =
  await getSchema({ apolloDirectory: apolloDirectoryPath });

const Query = gql`
  type Query {
    _empty: String
  }
`;

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: [Query, ...typeDefs],
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>({
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
  }),
  json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const ctx: { username: string | null } = {
        username: null,
      };
      try {
        if (req.headers["x-access-token"]) {
          const decryptedJTW = (await verify(
            req.headers["x-access-token"] as string,
            JWT_SECRET
          )) as unknown as {
            data: string;
          };
          ctx.username = decryptedJTW.data;
        }
      } catch (e) {
        // console.log("context::error:", e);
      }
      const contextWithRes = _.set(ctx, "res", res);
      return contextWithRes;
    },
  })
);

// file upload route
const upload = multer({ storage: getMulterConfig() });
app.post(
  "/file-upload/:entityType/:id",
  upload.single("file"),
  fileUploadController
);

// static assets route
app.use("/uploads", express.static("public/uploads"));

// Define your cron job
initialiseCron();

await new Promise<void>((resolve) =>
  httpServer.listen({ port: process.env.PORT }, resolve)
);
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
