import { getAllAuthors, getAllBooks, getAuthorById } from "../../models/books";

const userResolver = {
  Query: {
    books: async () => await getAllBooks(),
    authors: async () => await getAllAuthors(),
  },
  Book: {
    author: async (book: any) => {
      return await getAuthorById(book.authorId);
    },
  },
};

export default userResolver;
