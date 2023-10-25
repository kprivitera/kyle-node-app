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

  type RatingsBreakdown {
    rating1: Int
    rating2: Int
    rating3: Int
    rating4: Int
    rating5: Int
  }

  type Ratings {
    count: Int
    averageRating: Float
    hasUserRated: Boolean
    userRating: Int
    ratingsBreakdown: RatingsBreakdown
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

  type SearchResult {
    id: Int
    title: String
    description: String
    authorFirstName: String
    authorLastName: String
    coverImage: String
  }

  type Mutation {
    makeRating(bookId: Int, userId: Int, rating: Int): Int
  }

  extend type Query {
    book(id: ID, userId: ID): Book
    books: [Book]
    authors: [Author]
    searchBooks(searchTerm: String!): [SearchResult]
  }
`;

export default booksTypeDef;
