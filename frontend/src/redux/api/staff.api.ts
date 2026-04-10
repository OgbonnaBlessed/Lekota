/* eslint-disable @typescript-eslint/no-explicit-any */
import { setUser } from "../slices/auth.slice";
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
        formData: true,
      }),
      invalidatesTags: ["Profile"],
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          const currentToken = (getState() as any).auth.token;

          dispatch(
            setUser({
              user: data.user,
              token: currentToken, // ✅ preserve token
            }),
          );
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

    updateScheduleStatus: builder.mutation({
      query: (data) => ({
        url: "/staff/schedules/status",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Schedule"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message);
        } catch (err: any) {
          const message = err?.error?.data?.message;
          toast.error(message);
        }
      },
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
  useUpdateScheduleStatusMutation,
} = staffApi;
