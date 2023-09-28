import gql from "graphql-tag";

const userTypeDef = gql`
  scalar Upload

  input UserInput {
    id: Int
    firstName: String
    lastName: String
    email: String
    username: String
  }

  type FriendRequest {
    id: Int
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
    friendStatus: Int
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Mutation {
    createUser(input: UserInput): User
    updateUser(id: Int, input: UserInput): User
    deleteUser(id: Int): ID
    sendFriendRequest(userId: Int, friendId: Int): ID
    acceptFriendRequest(friendRequestId: Int): ID
    rejectFriendRequest(friendRequestId: Int): ID
    authenticate(username: String!, password: String!): String
  }

  extend type Query {
    user(id: Int): User
    users: [User]
    searchUsers(searchTerm: String!, currentUserId: ID!): [User]
  }
`;

export default userTypeDef;
