import { ApolloServer, gql, AuthenticationError } from "apollo-server";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import path from "path";
import _ from "lodash";

import { DocumentNode } from "graphql";
import { makeDatabaseConnection } from "./database";
import { sign, verify } from "./utils/jwt";
import getSchema from "./utils/get-schema";
import parseCookies from "./utils/parse-cookies";

dotenv.config(); //Reads .env file and makes it accessible via process.env

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const client: Client = makeDatabaseConnection();

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

const server = new ApolloServer({
  cors: {
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
  },
  context: async ({ req, res }) => {
    const ctx: { username: string | null } = {
      username: null,
    };
    try {
      if (req.headers["x-access-token"]) {
        console.log("x-access-token", req.headers["x-access-token"]);
        const decryptedJTW = (await verify(
          req.headers["x-access-token"] as string,
          JWT_SECRET
        )) as unknown as {
          data: string;
        };
        ctx.username = decryptedJTW.data;
      }
    } catch (e) {
      console.log("context::error:", e);
    }
    const contextWithRes = _.set(ctx, "res", res);
    return contextWithRes;
  },
  typeDefs: [Query, ...typeDefs],
  resolvers,
});

// localhost:4000
server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
