import { baseApi } from "./base.api";
import { toast } from "@/lib/toast";

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL
    getAppointments: builder.query({
      query: () => "/appointments",
      providesTags: ["Appointments"],
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
          await queryFulfilled;
          toast.success("Appointment booked");
        } catch {
          toast.error("Booking failed");
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
          await queryFulfilled;
          toast.success("Appointment cancelled");
        } catch {
          toast.error("Cancel failed");
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
          await queryFulfilled;
          toast.success("Rescheduled successfully");
        } catch {
          toast.error("Reschedule failed");
        }
      },
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
} = appointmentApi;
