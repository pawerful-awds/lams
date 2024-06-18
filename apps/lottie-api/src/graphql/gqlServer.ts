import express, { Router } from 'express';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';

const schemaFilesPath = path.resolve(__dirname, './**/*.graphql');
const typeDefsArray = loadFilesSync(schemaFilesPath);
const mergedTypeDefs = mergeTypeDefs(typeDefsArray);

const resolversFilesPath = path.resolve(__dirname, './**/*.resolver.*');
const resolversArray = loadFilesSync(resolversFilesPath);
const mergedResolvers = mergeResolvers(resolversArray);

const schema = makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
});

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
    router.use('/graphql', graphqlUploadExpress(), expressMiddleware(server));
  });
  return router;
};
