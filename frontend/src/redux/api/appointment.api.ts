/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./base.api";
import { toast } from "@/lib/toast";

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL
    getAppointments: builder.query({
      query: () => "/appointments",
      providesTags: ["Appointments"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Fetched appointments successfully");
        } catch (err: any) {
          const message =
            err?.error?.data?.message || "Failed to fetch appointment";

          toast.error(message);
        }
      },
    }),

    getSingleAppointment: builder.query({
      query: (id) => `/appointments/${id}`,
      providesTags: ["Appointment"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Fetched appointment successfully");
        } catch (err: any) {
          const message =
            err?.error?.data?.message || "Failed to fetch appointment";

          toast.error(message);
        }
      },
    }),

    // CREATE
    createAppointment: builder.mutation({
      query: (data) => ({
        url: "/appointments",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Appointments"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Appointment booked successfully");
        } catch (err: any) {
          const message =
            err?.error?.data?.message || "Failed to book appointment";

          toast.error(message);
        }
      },
    }),

    // CANCEL
    cancelAppointment: builder.mutation({
      query: (data) => ({
        url: "/appointments/cancel",
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["Appointments"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Appointment cancelled successfully");
        } catch (err: any) {
          const message =
            err?.error?.data?.message || "Failed to cancel appointment";

          toast.error(message);
        }
      },
    }),

    // RESCHEDULE
    rescheduleAppointment: builder.mutation({
      query: (data) => ({
        url: "/appointments/reschedule",
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["Appointments"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Rescheduled appointment successfully");
        } catch (err: any) {
          const message =
            err?.error?.data?.message || "Failed to reschedule appointment";

          toast.error(message);
        }
      },
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetSingleAppointmentQuery,
  useCreateAppointmentMutation,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
} = appointmentApi;
