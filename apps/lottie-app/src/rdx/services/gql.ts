import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { DocumentNode, print } from "graphql";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import {
  getAnimationsFromCache,
  saveAnimationsToCache,
  saveUploadToQueue,
} from "../cache";

export type TAnimationResponse = {
  title: string;
  id: string;
  url: string;
  animationData: Record<string, TODO> | null;
};

export type TAnimationsQueryBaseResponse = Omit<
  TAnimationResponse,
  "animationData"
> & {
  animationData?: string;
};

export type TAnimationsQueryResponse = {
  getAnimations: TAnimationsQueryBaseResponse[];
  getAnimation: TAnimationsQueryBaseResponse;
};

export type TTransformedGetAnimationsResponse = TAnimationResponse[];
export type TTransformedGetAnimationResponse = TAnimationResponse;

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const gqlUploadQuery: BaseQueryFn<
  { document: DocumentNode; variables?: TODO; queryName: string },
  unknown,
  { error: TODO }
> = async ({ document, variables, queryName }) => {
  try {
    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({ query: print(document), variables })
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", variables.file);

    const response = await fetch("http://localhost:4000/graphql", {
      headers: {
        "x-apollo-operation-name": "UploadAnimation",
      },
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error as TODO };
  }
};

const gqlBaseQuery: BaseQueryFn<
  { document: DocumentNode; variables?: TODO; queryName: string },
  unknown,
  { error: TODO }
> = async ({ document, variables, queryName }) => {
  try {
    // Return the cached result if its offline
    if (queryName === "getAnimations" && !navigator.onLine) {
      const cached = getAnimationsFromCache();
      if (cached.length > 0) {
        return { data: cached };
      }
    }

    const result = await client.query({
      query: document,
      variables,
    });

    const res = result.data[queryName];

    // Cache the result if query went through, means that its online
    if (queryName === "getAnimations" && result.data) {
      saveAnimationsToCache(res);
    }

    return { data: res };
  } catch (error) {
    return { error: error as TODO };
  }
};

export const gqlApi = createApi({
  reducerPath: "gqlApi",
  baseQuery: gqlBaseQuery,
  endpoints: (builder) => ({
    // Get Animations
    getAnimations: builder.query<TTransformedGetAnimationsResponse, void>({
      query: () => ({
        queryName: "getAnimations",
        document: gql`
          query {
            getAnimations {
              id
              title
              url
              animationData
            }
          }
        `,
      }),
      transformResponse: (
        response: TAnimationsQueryResponse["getAnimations"]
      ): TTransformedGetAnimationsResponse => {
        return response.map((item) => {
          const animationData = item.animationData
            ? { ...JSON.parse(item.animationData) }
            : null;

          return {
            ...item,
            animationData,
          };
        });
      },
    }),

    // Get Single Animation
    getAnimation: builder.query<
      TTransformedGetAnimationResponse,
      { id: string }
    >({
      query: (args) => ({
        queryName: "getAnimation",
        document: gql`
          query GetAnimation($id: ID!) {
            getAnimation(id: $id) {
              id
              title
              url
              animationData
            }
          }
        `,
        variables: {
          id: args.id,
        },
      }),
      transformResponse: (
        response: TAnimationsQueryResponse["getAnimation"]
      ): TTransformedGetAnimationResponse => {
        const animationData = response.animationData
          ? { ...JSON.parse(response.animationData) }
          : null;

        return {
          ...response,
          animationData,
        };
      },
    }),

    // Get Search Animations by keywords
    searchAnimations: builder.query<
      TTransformedGetAnimationsResponse,
      { keyword: string }
    >({
      query: (args) => ({
        queryName: "searchAnimations",
        document: gql`
          query SearchAnimations($keyword: String!) {
            searchAnimations(keyword: $keyword) {
              id
              title
              url
              animationData
            }
          }
        `,
        variables: { keyword: args.keyword },
      }),
    }),
  }),
});

export const gqlUploadApi = createApi({
  reducerPath: "gqlUploadApi",
  baseQuery: gqlUploadQuery,
  endpoints: (builder) => ({
    // Upload animation
    uploadAnimation: builder.mutation<
      TTransformedGetAnimationResponse,
      { file: File; metadata: string }
    >({
      query: ({ file, metadata }) => ({
        queryName: "uploadAnimation",
        document: gql`
          mutation UploadAnimation($file: Upload!, $metadata: String!) {
            uploadAnimation(file: $file, metadata: $metadata) {
              id
              title
              metadata
              url
            }
          }
        `,
        variables: { file, metadata },
      }),
      onQueryStarted: async (data, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch {
          if (!navigator.onLine) {
            saveUploadToQueue(data);
          }
        }
      },
    }),
  }),
});

export const { useGetAnimationsQuery, useGetAnimationQuery } = gqlApi;

export const { useUploadAnimationMutation } = gqlUploadApi;
