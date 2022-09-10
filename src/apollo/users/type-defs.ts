import apolloServer  from 'apollo-server-express';

const { gql } = apolloServer;

const userTypeDef = gql`
  input UserInput {
    id: Int
    firstName: String
    lastName: String
    email: String
    username: String
  }

  type User {
    id: Int
    firstName: String
    lastName: String
    email: String
    username: String
  }

  type Mutation {
    createUser(input: UserInput): User
    updateUser(id: Int, input: UserInput): User
    deleteUser(id: Int): ID
  }

  extend type Query {
    user(id: Int): User
    users: [User]
  }
`;

export default userTypeDef;
