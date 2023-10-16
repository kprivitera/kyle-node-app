import {
  getAllAuthors,
  getAllBooks,
  getAuthorById,
  getGenresByBook,
  getBookById,
  getBookSeries,
  getBookRatings,
} from "../../models/books";

const userResolver = {
  Query: {
    book: async (
      _parent: unknown,
      _args: { id: number },
      context: { username: string }
    ) => {
      const { id } = _args;
      return await getBookById(id);
    },
    books: async () => await getAllBooks(),
    authors: async () => await getAllAuthors(),
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
      return await getBookRatings(book.id);
    },
  },
};

export default userResolver;
