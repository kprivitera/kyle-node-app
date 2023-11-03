import {
  createBookClub,
  getAllBookClubs,
  getBookClubById,
} from "../../models/book-clubs";

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
  Mutation: {
    createBookClub: async (_: unknown, { input }: { input: any }) => {
      const { name, description, theme } = input;
      return await createBookClub(name, description, theme);
    },
  },
};

export default userResolver;
