/* eslint-disable @typescript-eslint/no-explicit-any */
import { setUser } from "../slices/auth.slice";
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
