/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./base.api";
import { toast } from "sonner";

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantOverview: builder.query({
      query: () => "/analytics/tenant-overview",

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to fetch overview");
        }
      },
    }),

    getTenantThroughput: builder.query({
      query: (range = "weekly") => `/analytics/throughput?range=${range}`,

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err: any) {
          toast.error(
            err?.error?.data?.message || "Failed to fetch throughput",
          );
        }
      },
    }),

    createService: builder.mutation({
      query: (data) => ({
        url: "/tenants/services",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Services"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message);
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Creation failed");
        }
      },
    }),

    getServices: builder.query({
      query: () => "/tenants/services",
      providesTags: ["Services"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to fetch services");
        }
      },
    }),

    updateServiceStatus: builder.mutation({
      query: (data) => ({
        url: "/tenants/services/status",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Services"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message);
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Update failed");
        }
      },
    }),

    updateService: builder.mutation({
      query: (data) => ({
        url: "/tenants/services",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Services"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Service updated successfully");
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to update service");
        }
      },
    }),

    getUsers: builder.query({
      query: () => "/tenants/users",
      providesTags: ["Users"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to fetch users");
        }
      },
    }),

    createUser: builder.mutation({
      query: (data) => ({
        url: "/tenants/users/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message);
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "User creation failed");
        }
      },
    }),

    updateUserStatus: builder.mutation({
      query: (data) => ({
        url: "/tenants/users/status",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message);
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Update failed");
        }
      },
    }),

    initializePayment: builder.mutation({
      query: () => ({
        url: "/payments/initialize",
        method: "POST",
        provideTags: ["Payments"],
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message);
        } catch (err: any) {
          toast.error(
            err?.error?.data?.message || "Payment initialization failed",
          );
        }
      },
    }),

    verifyPayment: builder.query({
      query: (reference) => `/payments/verify?reference=${reference}`,
      providesTags: ["Payments"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const {data} = await queryFulfilled;
          toast.success(data?.message);
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to fetch payments");
        }
      },
    }),

    getPayments: builder.query({
      query: () => "/payments",
      providesTags: ["Payments"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to fetch payments");
        }
      },
    }),
  }),
});

export const {
  useGetTenantOverviewQuery,
  useGetTenantThroughputQuery,
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceStatusMutation,
  useUpdateServiceMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserStatusMutation,
  useInitializePaymentMutation,
  useLazyVerifyPaymentQuery,
  useGetPaymentsQuery,
} = tenantApi;
