import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { DocumentNode } from "graphql";
import {
  ApolloClient,
  ApolloQueryResult,
  InMemoryCache,
  gql,
} from "@apollo/client";

export type TGetAnimationsQueryResponse = {
  getAnimations: {
    title: string;
    id: string;
    url: string;
    animationData?: string;
  }[];
};

export type TTransformedGetAnimationsResponse = {
  title: string;
  id: string;
  url: string;
  animationData: Record<string, TODO> | null;
}[];

export type TQueryResult<T = TODO> = {
  data: ApolloQueryResult<T>["data"];
};

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const gqlBaseQuery: BaseQueryFn<
  { document: DocumentNode; variables?: TODO },
  unknown,
  { error: TODO }
> = async ({ document, variables }) => {
  try {
    const result = await client.query({
      query: document,
      variables,
    });

    return { data: result.data };
  } catch (error) {
    return { error: error as TODO };
  }
};

export const gqlApi = createApi({
  reducerPath: "gqlApi",
  baseQuery: gqlBaseQuery,
  endpoints: (builder) => ({
    getAnimations: builder.query<TTransformedGetAnimationsResponse, void>({
      query: () => ({
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
        response: TGetAnimationsQueryResponse
      ): TTransformedGetAnimationsResponse => {
        return response.getAnimations.map((item) => {
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
    searchAnimations: builder.query<TODO, { id: string }>({
      query: (args) => ({
        document: gql`
          query SearchAnimations($id: String!) {
            getAnimations(id: $id) {
              id
              name
            }
          }
        `,
        variables: { id: args.id },
      }),
    }),
  }),
});

export const { useGetAnimationsQuery } = gqlApi;
