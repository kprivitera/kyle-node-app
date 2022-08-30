import apolloServer  from 'apollo-server-express';
const { gql } = apolloServer;

const recipeTypeDef = gql`
  type Book {
    title: String
    author: String
  }
  extend type Query {
    books: [Book]
  }
`;

export default recipeTypeDef;
