import gql from "graphql-tag";

const bookClubsTypeDef = gql`
  type BookClub {
    id: Int
    name: String
    description: String
    theme: String
    createdAt: String
    updatedAt: String
  }

  input BookClubInput {
    name: String
    description: String
    theme: String
  }

  type Mutation {
    createBookClub(input: BookClubInput): BookClub
  }

  extend type Query {
    bookClub(id: ID): BookClub
    bookClubs: [BookClub]
  }
`;

export default bookClubsTypeDef;
