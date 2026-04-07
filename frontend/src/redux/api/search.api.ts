import { baseApi } from "./base.api";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchServices: builder.query({
      query: (query) => `/search?query=${query}`,
      providesTags: ["Search"],
    }),
  }),
});

export const { useLazySearchServicesQuery } = searchApi;