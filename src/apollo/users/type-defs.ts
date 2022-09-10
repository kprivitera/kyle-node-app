import apolloServer  from 'apollo-server-express';

const { gql } = apolloServer;

const userTypeDef = gql`
  type User {
    id: Int
    firstName: String
    lastName: String
    email: String
    username: String
  }

  type Mutation {
    deleteUser(id: Int): ID
  }

  extend type Query {
    user(id: Int): User
    users: [User]
  }
`;

export default userTypeDef;
