import apolloServer from "apollo-server-express";

const { gql } = apolloServer;

const userTypeDef = gql`
  input UserInput {
    id: Int
    firstName: String
    lastName: String
    email: String
    username: String
  }

  type FriendRequest {
    status: String
    senderId: Int
    username: String
    lastName: String
    email: String
  }

  type Friend {
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
    friends: [Friend]
    receivedFriendRequests: [FriendRequest]
  }

  type Mutation {
    createUser(input: UserInput): User
    updateUser(id: Int, input: UserInput): User
    deleteUser(id: Int): ID
    sendFriendRequest(userId: Int, friendId: Int): ID
    acceptFriendRequest(friendRequestId: Int): ID
    rejectFriendRequest(friendRequestId: Int): ID
    authenticate(username: String!, password: String!): String
    refresh: String
  }

  extend type Query {
    user(id: Int): User
    users: [User]
    searchUsers(searchTerm: String!, currentUserId: ID!): [User]
  }
`;

export default userTypeDef;
