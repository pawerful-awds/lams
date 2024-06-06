import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

import { db } from '@/services/firebase';

import type { Animation, Resolvers } from '../types/graphql';

export interface QueryArgs {
  query: string;
}

export interface AnimationArgs {
  id: string;
}

export interface UploadAnimationArgs {
  file: any;
  metadata: string;
}

export interface DownloadAnimationArgs {
  id: string;
}

const toAnimation = (doc: FirebaseFirestore.DocumentSnapshot): Animation => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data?.title,
    metadata: data?.metadata,
    url: data?.url,
  } as Animation;
};

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

const getAnimation = async (_parent: unknown, { id }: AnimationArgs) => {
  const doc = await db.collection('animations').doc(id).get();
  return doc.exists ? toAnimation(doc) : null;
};

const searchAnimations = async (_parent: unknown, { query }: QueryArgs) => {
  const snapshot = await db.collection('animations').where('title', '>=', query).get();
  return snapshot.docs.map(toAnimation);
};

const resolvers: Resolvers = {
  Upload: GraphQLUpload,
  Query: {
    queryName,
    animations,
    getAnimation,
    searchAnimations,
  },
};

export default resolvers;
