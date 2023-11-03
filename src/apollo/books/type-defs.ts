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

  type Comment {
    id: Int
    comment: String
    timestamp: String
    username: String
    profileImage: String
  }

  type Review {
    id: Int
    review: String
    timestamp: String
    firstName: String
    lastName: String
    profileImage: String
    username: String
    rating: Int
    comments: [Comment]
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
    reviews: [Review]
    userReview: Review
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
    makeReview(bookId: Int, userId: Int, review: String): Int
    makeRatingAndReview(
      bookId: Int
      userId: Int
      rating: Int
      review: String
    ): Int
    makeComment(userId: Int, reviewId: Int, comment: String): Int
  }

  extend type Query {
    book(id: ID, userId: ID): Book
    books: [Book]
    authors: [Author]
    searchBooks(searchTerm: String!): [SearchResult]
  }
`;

export default booksTypeDef;
