import { AuthenticationError } from "apollo-server";
import {
  getWords,
  createWord,
  updateWord,
  deleteWord,
} from "../../models/words";

type Args = {
  itemsByPage: number;
  page: number;
};

const wordsResolver = {
  Query: {
    words: async (
      _parent: unknown,
      _args: Args,
      context: { username: string }
    ) => {
      const { itemsByPage, page } = _args;
      if (!context.username) {
        throw new AuthenticationError("Invalid credentials");
      }
      return await getWords({ itemsByPage, page });
    },
  },
  Mutation: {
    createWord: async (_: unknown, { input }: any) => {
      return await createWord(input);
    },
    updateWord: async (_: unknown, { input }: any) => {
      await updateWord(input);
      return input.id;
    },
    deleteWord: async (_: unknown, { id }: any) => {
      const deletedWord = await deleteWord(id);
      console.log(deletedWord);
    },
  },
};

export default wordsResolver;
