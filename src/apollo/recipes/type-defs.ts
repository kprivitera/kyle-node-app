import gql from "graphql-tag";

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
