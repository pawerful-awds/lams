import type { Resolvers } from '../types/graphql';

const queryName = () => 'Lottie Animation - Graphql Resolvers';

const animations = () => {
  try {
    return [
      {
        id: 'lottie-animation-genesis-000',
        title: 'Test First Animation',
        metadata: 'Metadata for Test First Animation',
        url: 'URL_HERE',
      },
    ];
  } catch (error: any) {
    throw new Error(`Error fetching animations: ${error.message}`);
  }
};

const resolvers: Resolvers = {
  Query: {
    queryName,
    animations,
  },
};

export default resolvers;
