import gql from "graphql-tag";

const booksTypeDef = gql`
  type Genre {
    id: Int
    title: String
    description: String
  }

  type Author {
    id: Int
    firstName: String
    lastName: String
    description: String
    image: String
  }

  type Series {
    title: String
    description: String
    seriesNumber: Int
  }

  type Ratings {
    count: Int
    averageRating: Float
  }

  type Book {
    id: Int
    title: String
    description: String
    pageCount: Int
    author: Author
    genres: [Genre]
    coverImage: String
    series: Series
    ratings: Ratings
  }

  extend type Query {
    book(id: ID): Book
    books: [Book]
    authors: [Author]
  }
`;

export default booksTypeDef;
