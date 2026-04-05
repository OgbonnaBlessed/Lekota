import { baseApi } from "./base.api";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query({
      query: (query) => `/search?query=${query}`,
      providesTags: ["Search"],
    }),
  }),
});

export const { useSearchQuery } = searchApi;