import { baseApi } from "./base.api";
import { toast } from "@/lib/toast";

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/client/profile",
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["User"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Profile updated 👤");
        } catch {
          toast.error("Update failed");
        }
      },
    }),
  }),
});

export const { useUpdateProfileMutation } = clientApi;
