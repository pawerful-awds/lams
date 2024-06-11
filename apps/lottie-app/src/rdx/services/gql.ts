import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { DocumentNode } from "graphql";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

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

const gqlBaseQuery: BaseQueryFn<
  { document: DocumentNode; variables?: TODO; queryName: string },
  unknown,
  { error: TODO }
> = async ({ document, variables, queryName }) => {
  try {
    const result = await client.query({
      query: document,
      variables,
    });

    const res = result.data[queryName];
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
    searchAnimations: builder.query<TODO, { keyword: string }>({
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

export const { useGetAnimationsQuery, useGetAnimationQuery } = gqlApi;
