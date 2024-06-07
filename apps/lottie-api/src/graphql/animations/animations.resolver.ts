import { GraphQLUpload } from 'graphql-upload-minimal';
import { v4 as uuidv4 } from 'uuid';

import { db, bucket } from '@/services/firebase';

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

/**
 *
 * @returns Animation
 */
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
    throw new Error(`fetching animations: ${error.message}`);
  }
};

/**
 * Get Animations
 * @param _parent
 * @returns Animation[]
 */
const getAnimations = async (_parent: unknown) => {
  // TODO: try catch
  const snapshot = await db.collection('animations').get();
  return snapshot.docs.map(toAnimation);
};

/**
 * Get Animation
 * @param _parent
 * @param AnimationArgs
 * @returns Animation | null
 */
const getAnimation = async (_parent: unknown, { id }: AnimationArgs) => {
  // TODO: try catch
  const doc = await db.collection('animations').doc(id).get();
  return doc.exists ? toAnimation(doc) : null;
};

/**
 * Search Animations
 * @param _parent
 * @param QueryArgs
 * @returns Animation[]
 */
const searchAnimations = async (_parent: unknown, { query }: QueryArgs) => {
  // TODO: try catch
  const snapshot = await db.collection('animations').where('title', '>=', query).get();
  return snapshot.docs.map(toAnimation);
};

// Mutations
/**
 * Upload Animation
 * @param _parent
 * @param { file, metadata }
 * @returns Animation
 */
const uploadAnimation = async (_parent: unknown, { file, metadata }: UploadAnimationArgs): Promise<Animation> => {
  // TODO: try catch
  const { createReadStream, filename } = await file;
  const fileId = uuidv4();
  const fileStream = createReadStream();

  const blob = bucket.file(`animations/${fileId}-${filename}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: 'application/json',
  });

  fileStream.pipe(blobStream);

  await new Promise((resolve, reject) => {
    blobStream.on('finish', resolve);
    blobStream.on('error', reject);
  });

  const url = `https://storage.googleapis.com/${bucket.name}/animations/${fileId}-${filename}`;
  const newAnimation: Animation = { id: fileId, title: filename, metadata, url };
  await db.collection('animations').doc(fileId).set(newAnimation);
  return newAnimation;
};

/**
 * Download Animation
 * @param _parent
 * @param { id }
 * @returns Animation
 */
const downloadAnimation = async (_parent: unknown, { id }: DownloadAnimationArgs): Promise<string> => {
  // TODO: try catch
  const doc = await db.collection('animations').doc(id).get();
  if (!doc.exists) throw new Error('Animation not found');
  const animation = doc.data() as Animation;
  return animation.url;
};

const resolvers: Resolvers = {
  Upload: GraphQLUpload,
  Query: {
    queryName,
    animations,
    getAnimation,
    getAnimations,
    searchAnimations,
  },
  Mutation: {
    uploadAnimation,
    downloadAnimation,
  },
};

export default resolvers;
