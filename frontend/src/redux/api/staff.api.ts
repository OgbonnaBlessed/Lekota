/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./base.api";
import { toast } from "sonner";

export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffById: builder.query({
      query: (id) => `/staff/${id}`,
    }),

    getStaffProfile: builder.query({
      query: () => "/staff/profile",
      providesTags: ["Profile"],
    }),

    updateStaffProfile: builder.mutation({
      query: (data) => ({
        url: "/staff/profile",
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

    setAvailability: builder.mutation({
      query: (data) => ({
        url: "/availability",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Availability"],
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
      providesTags: ["Availability"],
    }),

    getSchedules: builder.query({
      query: (type) => `/staff/schedules?type=${type}`,
      providesTags: ["Schedules"],
    }),

    getSingleSchedule: builder.query({
      query: (id) => `/staff/schedules/${id}`,
      providesTags: ["Schedule"],
    }),

    getTenantServices: builder.query({
      query: () => "/tenants/services",
      providesTags: ["Services"],
    }),
  }),
});

export const {
  useGetStaffByIdQuery,
  useGetStaffProfileQuery,
  useUpdateStaffProfileMutation,
  useSetAvailabilityMutation,
  useGetAvailabilityQuery,
  useGetSchedulesQuery,
  useGetSingleScheduleQuery,
  useGetTenantServicesQuery,
} = staffApi;
