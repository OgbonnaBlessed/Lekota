import { baseApi } from "./base.api";

export const slotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSlots: builder.query({
      query: (params) => ({
        url: "/slot",
        params,
      }),
      providesTags: ["Slots"],
    }),
  }),
});

export const { useGetSlotsQuery } = slotApi;
