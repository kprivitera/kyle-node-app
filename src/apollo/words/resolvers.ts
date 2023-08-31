import { AuthenticationError } from "apollo-server";
import getWords from "../../models/words";

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
      console.log("words resolver ctx", context);
      const { itemsByPage, page } = _args;
      if (!context.username) {
        console.log("wordsResolver::error:context", context);
        throw new AuthenticationError("Invalid credentials");
      }
      return await getWords({ itemsByPage, page });
    },
  },
};

export default wordsResolver;
