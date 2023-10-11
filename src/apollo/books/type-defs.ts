import gql from "graphql-tag";

const booksTypeDef = gql`
  type Author {
    id: Int
    firstName: String
    lastName: String
    description: String
    image: String
  }

  type Book {
    id: Int
    title: String
    description: String
    pageCount: Int
    author: Author
  }

  extend type Query {
    books: [Book]
    authors: [Author]
  }
`;

export default booksTypeDef;
