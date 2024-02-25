// import { delegateToSchema } from "graphql-tools";

import {
  addClubMember,
  createBookClub,
  editBookClub,
  getAllBookClubs,
  getBookClubById,
  getBookClubMembers,
  getBookClubBooks,
  removeClubMember,
  removeClubBook,
} from "../../models/book-clubs";
import booksResolver from "../books/resolvers";

const userResolver = {
  Query: {
    bookClubs: async () => {
      return await getAllBookClubs();
    },
    bookClub: async (_parent: unknown, _args: { id: number }) => {
      const { id } = _args;
      return await getBookClubById(id);
    },
  },
  BookClub: {
    books: async (bookClub: any) => {
      const { id } = bookClub;
      const bookIds: number[] = await getBookClubBooks(id);
      return booksResolver.Query.books(null, { ids: bookIds });
    },
    members: async (bookClub: any) => {
      const { id } = bookClub;
      return await getBookClubMembers(id);
    },
  },
  Mutation: {
    createBookClub: async (_: unknown, { input }: { input: any }) => {
      const { name, description, theme, userId } = input;
      return await createBookClub(name, description, theme, userId);
    },
    addClubMember: async (_: unknown, { input }: { input: any }) => {
      const { bookClubId, userId } = input;
      return await addClubMember({ bookClubId, userId });
    },
    editBookClub: async (_: unknown, { input }: { input: any }) => {
      const { bookClubId, description, name, theme } = input;
      return await editBookClub({ bookClubId, description, name, theme });
    },
    removeClubMember: async (_: unknown, { input }: { input: any }) => {
      const { bookClubId, userId } = input;
      return await removeClubMember({ bookClubId, userId });
    },
    removeClubBook: async (_: unknown, { input }: { input: any }) => {
      const { bookClubId, bookId } = input;
      return await removeClubBook({ bookClubId, bookId });
    },
  },
};

export default userResolver;
