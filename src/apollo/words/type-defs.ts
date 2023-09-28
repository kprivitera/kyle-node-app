import gql from "graphql-tag";

const wordTypeDef = gql`
  input WordInput {
    name: String
    description: String
  }
  input UpdateWordInput {
    id: Int
    name: String
    description: String
  }
  type Word {
    id: String
    name: String
    description: String
  }
  type Mutation {
    createWord(input: WordInput): Word
    updateWord(input: UpdateWordInput): Word
    deleteWord(id: ID): ID
  }
  extend type Query {
    words(itemsByPage: Int, letter: String, page: Int): [Word]
    word(id: ID): Word
    searchUsers(searchTerm: String!, currentUserId: ID!): [User]
  }
`;

export default wordTypeDef;
