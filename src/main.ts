import { ApolloServer, gql } from 'apollo-server';
import { Client } from 'pg';
import { QueryResult } from 'pg';
import dotenv from "dotenv";
import path from 'path';

import { makeDatabaseConnection, query} from './database';
import getSchema from './utils/get-schema';

type WordRow = {
  id: number;
  name: string;
  description: string;
};

dotenv.config(); //Reads .env file and makes it accessible via process.env

const client: Client = makeDatabaseConnection();

// __dirname not available for esModules.  Basically path to this directory.
const __dirname: string =  new URL('.', import.meta.url).pathname;
// an array of apollo directory names eg. ['people', 'recipes']
const apolloDirectoryPath: string = path.join(__dirname, '/apollo');
const { typeDefs, resolvers }: { typeDefs: any, resolvers: any } = await getSchema({ apolloDirectory: apolloDirectoryPath });

const Query = gql`
  type Query {
    _empty: String
  }
`;

try {
  const response: QueryResult<WordRow> = await query<WordRow>(client, `SELECT * FROM words;`);
  // console.log('response', response.rows);
} catch (err){
  console.log(err);
}

client.end();
  
const server = new ApolloServer({
  typeDefs: [Query, ...typeDefs],
  resolvers
});
  
// localhost:4000
server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
