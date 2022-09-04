import apolloServer  from 'apollo-server-express';

const { gql } = apolloServer;

const wordTypeDef = gql`
  type Word {
    id: String
    name: String
    description: String
  }
  extend type Query {
    words: [Word]
  }
`;

export default wordTypeDef;
