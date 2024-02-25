import {
  getAllAuthors,
  getAllBooks,
  getAuthorById,
  getGenresByBook,
  getBookById,
  getBookSeries,
  getBookRatings,
  searchAllBooks,
  makeRating,
  makeReview,
  getBookReviews,
  makeRatingAndReview,
  getUserReview,
  makeComment,
} from "../../models/books";

const userResolver = {
  Query: {
    book: async (
      _parent: unknown,
      _args: { id: number; userId?: number },
      context: { username: string }
    ) => {
      const { id, userId } = _args;
      const book = await getBookById(id);
      return { ...book, userId };
    },
    books: async (_parent: unknown, _args: { ids?: number[] }) => {
      const { ids } = _args;
      return await getAllBooks(ids);
    },
    authors: async () => await getAllAuthors(),
    searchBooks: async (_parent: unknown, _args: { searchTerm: string }) => {
      const { searchTerm } = _args;
      return await searchAllBooks(searchTerm);
    },
  },
  Book: {
    author: async (book: any) => {
      return await getAuthorById(book.authorId);
    },
    genres: async (book: any) => {
      return await getGenresByBook(book.id);
    },
    series: async (book: any) => {
      return await getBookSeries(book.id);
    },
    ratings: async (book: any) => {
      return await getBookRatings(book.id, book.userId);
    },
    reviews: async (book: any) => {
      return await getBookReviews(book.id, book.userId);
    },
    userReview: async (book: any) => {
      return await getUserReview(book.id, book.userId);
    },
  },
  Mutation: {
    makeRating: async (
      _: unknown,
      {
        bookId,
        userId,
        rating,
      }: { bookId: number; userId: number; rating: number }
    ) => {
      return await makeRating(bookId, userId, rating);
    },
    makeReview: async (
      _: unknown,
      {
        bookId,
        userId,
        review,
      }: { bookId: number; userId: number; review: string }
    ) => {
      console.log("resolver", { bookId, userId, review });
      return await makeReview(review, bookId, userId);
    },
    makeRatingAndReview: async (
      _: unknown,
      {
        bookId,
        userId,
        rating,
        review,
      }: { bookId: number; userId: number; rating: number; review: string }
    ) => {
      return await makeRatingAndReview(bookId, userId, rating, review);
    },
    makeComment: async (
      _: unknown,
      {
        reviewId,
        userId,
        comment,
      }: { userId: number; reviewId: number; comment: string }
    ) => {
      return await makeComment(comment, reviewId, userId);
    },
  },
};

export default userResolver;
