import { createEntityAdapter, nanoid } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const universityAdapter = createEntityAdapter({});

const initialState = universityAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      getCountries: builder.query({
         query: () =>
            "https://countriesnow.space/api/v0.1/countries/info?returns=none",
         transformResponse: (resData) =>
            resData.data.sort((a, b) => a.name.localeCompare(b.name)),
      }),
      getUni: builder.query({
         query: (country) => ({
            url: `https://universities.hipolabs.com/search?country=${country}`,
         }),
         transformResponse: (responseData) => {
            const resConvert = responseData
               .slice()
               .sort((a, b) => a.name.localeCompare(b.name))
               .map((each) => {
                  return { ...each, id: nanoid() };
               });
            return universityAdapter.setAll(initialState, resConvert);
         },
      }),
   }),
});

export const { useGetCountriesQuery, useGetUniQuery } = extendedApiSlice;

export const { selectAll: getAllUniversity } = universityAdapter.getSelectors(
   (state) => {
      let newObj = {};

      for (const value of Object.values(state.api.queries)) {
         if (
            value?.endpointName === "getUni" &&
            value?.status === "fulfilled"
         ) {
            newObj = value.data;
         }
      }

      return !Object.values(newObj)[0] ? initialState : newObj;
   },
);
