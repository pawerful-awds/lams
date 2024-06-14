import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { DocumentNode, print } from "graphql";
import { gql } from "@apollo/client";

import { clearQueue as clearOfflineAnimationQueue } from "../features/animations";
import {
  getDetailsFromQueueById,
  syncQueueToState,
} from "../features/animations/actions";
import {
  getAnimationsFromCache,
  saveAnimationsToCache,
  saveUploadToQueue,
} from "../cache";
import { animationsTag } from "./tags";

export type TAnimationResponse = {
  title: string;
  id?: string;
  url?: string;
  animationData: { [x: string]: TODO } | null;
  createdAt?: TODO;
  metadata?: string;
  inQueue?: boolean;
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

const gqlUploadQuery: BaseQueryFn<
  { document: DocumentNode; variables?: TODO; queryName: string },
  unknown,
  { error: TODO }
> = async ({ document, variables, queryName }) => {
  try {
    // Cache the uploaded file if its offline
    if (queryName === "uploadAnimation" && !navigator.onLine) {
      await saveUploadToQueue(variables);
      return {
        data: {
          inQueue: true,
        },
      };
    }

    // Prepare form data
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

    const result = await response.json();

    return { data: result.data };
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
      if (cached) {
        return { data: cached };
      }
    }

    if (queryName === "getAnimation" && !navigator.onLine) {
      const cached = await getDetailsFromQueueById(variables.id);
      console.log("# cached", cached);
      if (cached) {
        return { data: cached };
      }
    }

    const response = await fetch("http://localhost:4000/graphql", {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        query: print(document),
        variables,
      }),
    });

    const result = await response.json();

    const data = result.data[queryName];

    // Cache the response if query went through, means that its online and with success response
    if (queryName === "getAnimations" && data) {
      saveAnimationsToCache(data);
    }

    return { data };
  } catch (error) {
    console.error("# gqlBaseQuery error", error);
    // // if returns a resp error, try to load from cache
    // // TODO: handle error and display necessary messages accordingly
    const cached = getAnimationsFromCache();
    if (cached) {
      return { data: cached };
    }
    return { error: error as TODO };
  }
};

export const gqlApi = createApi({
  reducerPath: "gqlApi",
  baseQuery: gqlBaseQuery,
  tagTypes: [animationsTag as string],
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
              createdAt
              metadata
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
      // providesTags: ["tag:animations"],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: animationsTag,
                id,
              })),
              { type: animationsTag, id: "list" },
            ]
          : [{ type: animationsTag, id: "list" }],
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
              createdAt
              metadata
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
        const animationData =
          response.animationData && typeof response.animationData === "string"
            ? { ...JSON.parse(response.animationData) }
            : response.animationData ?? null;

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
  tagTypes: [animationsTag],
  endpoints: (builder) => ({
    // Upload animation
    uploadAnimation: builder.mutation<
      TTransformedGetAnimationResponse,
      { file: File; metadata: TODO; title: string }
    >({
      query: ({ file, metadata, title }) => ({
        queryName: "uploadAnimation",
        document: gql`
          mutation UploadAnimation(
            $file: Upload!
            $metadata: String!
            $title: String!
          ) {
            uploadAnimation(file: $file, metadata: $metadata, title: $title) {
              id
              title
              metadata
              url
            }
          }
        `,
        variables: { file, metadata, title },
      }),
      onQueryStarted: async (data, { dispatch, queryFulfilled }) => {
        try {
          const { data: result } = await queryFulfilled;
          // check if result has inQueue, if present and true then need to fetch from cache and load it in the reducer
          if (result.inQueue) {
            syncQueueToState()(dispatch);
          } else {
            dispatch(clearOfflineAnimationQueue());
          }

          // Invalidate getAnimations list on every successful upload / mutation
          dispatch(
            gqlApi.util.invalidateTags([{ type: animationsTag, id: "list" }])
          );
        } catch {
          // Cache the data if in the middle of api call suddenly got offline
          if (!navigator.onLine) {
            console.log("# upload offline");
            saveUploadToQueue(data);
          }
        }
      },
    }),
  }),
});

export const { useGetAnimationsQuery, useGetAnimationQuery } = gqlApi;

export const { useUploadAnimationMutation } = gqlUploadApi;
