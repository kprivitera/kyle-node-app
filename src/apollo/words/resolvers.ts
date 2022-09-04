import getWords from '../../models/words';

  const wordsResolver = {
    Query: {
      words: () => getWords(),
    }
  };
  
  export default wordsResolver;
  