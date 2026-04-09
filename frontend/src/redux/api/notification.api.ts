import { baseApi } from "./base.api";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => "/notification",
      providesTags: ["Notifications"],
    }),

    markAsRead: builder.mutation({
      query: (id) => ({
        url: "/notification/read",
        method: "PATCH",
        body: { id },
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAsReadMutation } =
  notificationApi;
