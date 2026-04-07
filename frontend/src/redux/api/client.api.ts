/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./base.api";
import { toast } from "@/lib/toast";

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientProfile: builder.query({
      query: () => "/client/profile",
      providesTags: ["Profile"],
    }),

    updateClientProfile: builder.mutation({
      query: (data) => ({
        url: "/client/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Profile updated");
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to update profile");
        }
      },
    }),

    getStaffAvailability: builder.query({
      query: (staffId) => `/availability/${staffId}`,
    }),
  }),
});

export const {
  useGetClientProfileQuery,
  useUpdateClientProfileMutation,
  useGetStaffAvailabilityQuery,
} = clientApi;
