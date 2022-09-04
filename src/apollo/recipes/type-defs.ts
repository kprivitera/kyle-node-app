import apolloServer  from 'apollo-server-express';

const { gql } = apolloServer;

const recipeTypeDef = gql`
  type Recipe {
    title: String
    author: String
  }
  extend type Query {
    recipes: [Recipe]
  }
`;

export default recipeTypeDef;
