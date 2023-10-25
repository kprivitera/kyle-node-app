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
    books: async () => await getAllBooks(),
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
  },
};

export default userResolver;
