import express, { Router } from 'express';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';

const schemaFilesPath = path.resolve(__dirname, './**/*.graphql');
const typeDefsArray = loadFilesSync(schemaFilesPath);
const mergedTypeDefs = mergeTypeDefs(typeDefsArray);

const resolversFilesPath = path.resolve(__dirname, './**/*.resolver.ts');
const resolversArray = loadFilesSync(resolversFilesPath);
const mergedResolvers = mergeResolvers(resolversArray);

const schema = makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
});

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

async function startApollo() {
  const server = new ApolloServer({
    schema,
  });
  console.log('# graphql starting');
  await server.start();
  console.log('# graphql started');
  return server;
}

export const gqlServer = (): Router => {
  const router = express.Router();

  startApollo().then((server) => {
    router.use('/graphql', expressMiddleware(server));
  });
  return router;
};
