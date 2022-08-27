import { ApolloServer, gql } from 'apollo-server';
import { Client, QueryResult } from 'pg';
import dotenv from "dotenv";

type WordRow = {
  id: number;
  name: string;
  description: string;
};

dotenv.config(); //Reads .env file and makes it accessible via process.env

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

client.connect();

client.query(`SELECT * FROM words;`, (err: Error, res: QueryResult<WordRow>) => {
  if (!err){
    // console.log('res', res.rows);
  } else {
    // console.log('err: ', err.message);
  }
  client.end();
});

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// localhos:4000
server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
