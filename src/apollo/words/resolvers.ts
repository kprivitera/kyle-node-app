import { GraphQLError } from "graphql";

import {
  getWord,
  getWords,
  createWord,
  updateWord,
  deleteWord,
} from "../../models/words";

type WordsArgs = {
  itemsByPage: number;
  page: number;
  letter: string;
};

const DEFAULT_LETTER = "a";

const wordsResolver = {
  Query: {
    words: async (
      _parent: unknown,
      _args: WordsArgs,
      context: { username: string }
    ) => {
      const { letter, itemsByPage, page } = _args;
      const letterValue = letter || DEFAULT_LETTER;
      if (!context.username) {
        throw new GraphQLError("Invalid credentials");
      }
      return await getWords({ letter: letterValue, itemsByPage, page });
    },
    word: async (
      _parent: unknown,
      _args: { id: number },
      context: { username: string }
    ) => {
      const { id } = _args;
      // if (!context.username) {
      //   throw new AuthenticationError("Invalid credentials");
      // }
      return await getWord({ id });
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
    },
  },
};

export default wordsResolver;
