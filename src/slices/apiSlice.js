import { createEntityAdapter } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { retry } from "@reduxjs/toolkit/dist/query";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

const postsAdapter = createEntityAdapter({});

const initialState = postsAdapter.getInitialState();

const staggeredBaseQuery = retry(
   async (args, api, extraOptions) => {
      const result = await fetchBaseQuery({ baseUrl: "" })(
         args,
         api,
         extraOptions,
      );

      // Bail immediately on any client error (4xx) — retrying won't resolve these
      if (
         result.error?.status === 401 ||
         (typeof result.error?.status === "number" && result.error.status < 500)
      ) {
         retry.fail(result.error);
      }

      return result;
   },
   { maxRetries: 3 }, // 5 is excessive — 3 is standard for transient failures
);

function providesList(resultsWithIds, tagType) {
   return resultsWithIds
      ? [
           { type: tagType, id: "LIST" },
           ...resultsWithIds.map((id) => ({ type: tagType, id })),
        ]
      : [{ type: tagType, id: "LIST" }];
}

export const apiSlice = createApi({
   reducerPath: "api",
   baseQuery: staggeredBaseQuery,
   tagTypes: ["Post"],
   endpoints: (builder) => ({
      getAllPosts: builder.query({
         query: () => BASE_URL,
         transformResponse: (responseData) => {
            const resConvert = responseData.sort((a, b) => b.id - a.id);

            return postsAdapter.setAll(initialState, resConvert);
         },
         providesTags: (result) => providesList(result.ids, "Post"),
      }),
      addOnePost: builder.mutation({
         queryFn: () => ({
            body: null,
         }),
         onQueryStarted(postData, { dispatch, queryFulfilled }) {
            dispatch(
               apiSlice.util.updateQueryData(
                  "getAllPosts",
                  undefined,
                  (draft) => {
                     postsAdapter.addOne(draft, {
                        ...postData,
                     });
                  },
               ),
            );
         },
      }),
      editOnePost: builder.mutation({
         queryFn: () => ({
            body: null,
         }),
         onQueryStarted(postData, { dispatch, queryFulfilled }) {
            dispatch(
               apiSlice.util.updateQueryData(
                  "getAllPosts",
                  undefined,
                  (draft) => {
                     postsAdapter.upsertOne(draft, postData);
                  },
               ),
            );
         },
      }),
      deleteOnePost: builder.mutation({
         queryFn: () => ({
            body: null,
         }),
         onQueryStarted(postId, { dispatch, queryFulfilled }) {
            dispatch(
               apiSlice.util.updateQueryData(
                  "getAllPosts",
                  undefined,
                  (draft) => {
                     postsAdapter.removeOne(draft, postId);
                  },
               ),
            );
         },
      }),
   }),
});

export const {
   useGetAllPostsQuery,
   useGetOnePostQuery,
   useAddOnePostMutation,
   useEditOnePostMutation,
   useDeleteOnePostMutation,
   usePrefetch,
} = apiSlice;

export const { selectAll: getAllPosts, selectById: getPostById } =
   postsAdapter.getSelectors((state) => {
      let newObj = {};

      if (Object.values(state.api.queries).length > 0) {
         for (const value of Object.values(state.api.queries)) {
            if (
               value?.endpointName === "getAllPosts" &&
               value?.status === "fulfilled"
            ) {
               newObj = value.data;
            }
         }
      }

      return !Object.values(newObj)[0] ? initialState : newObj;
   });
