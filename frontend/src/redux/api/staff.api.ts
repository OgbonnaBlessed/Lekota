/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./base.api";
import { toast } from "sonner";

export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/staff/profile",
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/staff/profile",
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Profile updated");
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to update profile");
        }
      },
    }),

    setAvailability: builder.mutation({
      query: (data) => ({
        url: "/availability",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Availability saved");
        } catch (err: any) {
          toast.error(
            err?.error?.data?.message || "Failed to save availability",
          );
        }
      },
    }),

    getAvailability: builder.query({
      query: () => "/availability",
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useSetAvailabilityMutation,
  useGetAvailabilityQuery,
} = staffApi;
