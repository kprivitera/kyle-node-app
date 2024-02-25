import gql from "graphql-tag";

const bookClubsTypeDef = gql`
  type BookClub {
    id: Int
    name: String
    description: String
    theme: String
    createdAt: String
    updatedAt: String
    members: [User]
    books: [Book]
  }

  input BookClubInput {
    name: String
    description: String
    theme: String
    userId: Int
  }

  input AddClubMemberInput {
    bookClubId: Int
    userId: Int
  }

  input EditBookClubInput {
    bookClubId: Int
    description: String
    name: String
    theme: String
  }

  input RemoveClubMemberInput {
    bookClubId: Int
    userId: Int
  }

  input RemoveClubBookInput {
    bookClubId: Int
    bookId: Int
  }

  type Mutation {
    createBookClub(input: BookClubInput): BookClub
    addClubMember(input: AddClubMemberInput): BookClub
    editBookClub(input: EditBookClubInput): BookClub
    removeClubMember(input: RemoveClubMemberInput): BookClub
    removeClubBook(input: RemoveClubBookInput): BookClub
  }

  extend type Query {
    bookClub(id: ID): BookClub
    bookClubs: [BookClub]
  }
`;

export default bookClubsTypeDef;
