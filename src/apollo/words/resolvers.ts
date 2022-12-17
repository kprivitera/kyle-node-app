import { AuthenticationError } from 'apollo-server';
import getWords from '../../models/words';

type Args = {
  itemsByPage: number,
  page: number
};

const wordsResolver = {
  Query: {
    words: async (_parent: unknown, _args: Args, context: { username: string }) => {
      const { itemsByPage, page } = _args;
      if (!context.username){
        throw new AuthenticationError('Invalid credentials');
      }
      return await getWords({ itemsByPage, page });
    },
  }
};

export default wordsResolver;
  