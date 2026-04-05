/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearUser, setUser } from "../slices/auth.slice";
import { baseApi } from "./base.api";
import { toast } from "sonner"; // make sure you import Sonner toast

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setUser({
              user: data.user,
              token: data.token,
            }),
          );

          toast.success(data?.message || "Login successful");
        } catch (err: any) {
          const message =
            err?.error?.data?.message ||
            err?.data?.message ||
            "Something went wrong";

          toast.error(message);
        }
      },
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "/auth/admin/signup",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setUser({
              user: data.user,
              token: data.token,
            }),
          );

          // ✅ USE BACKEND MESSAGE
          toast.success(data?.message || "Account created successfully");
        } catch (err: any) {
          console.log("ERROR:", err); // 👈 ADD THIS FIRST

          const message =
            err?.error?.data?.message || // ✅ CORRECT PATH
            err?.data?.message || // fallback
            "Something went wrong";

          toast.error(message);
        }
      },
    }),

    getMe: builder.query({
      query: () => "/auth/me",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setUser({
              user: data.user,
              token: data.token,
            }),
          );
        } catch {
          dispatch(clearUser());
        }
      },
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message);
        } catch (err: any) {
          const message =
            err?.error?.data?.message || "Failed to send reset instructions";
          toast.error(message);
        }
      },
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message);
        } catch (err: any) {
          const message = err?.error?.data?.message || "Reset failed";
          toast.error(message);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
