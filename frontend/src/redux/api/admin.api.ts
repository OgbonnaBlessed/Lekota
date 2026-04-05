/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { baseApi } from "./base.api";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query({
      query: () => "/tenants",
      providesTags: ["Tenants"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err: any) {
          const message =
            err?.error?.data?.message || "Failed to fetch tenants";

          toast.error(message);
        }
      },
    }),

    createTenant: builder.mutation({
      query: (data) => ({
        url: "/tenants/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tenants"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          toast.success(data?.message || "Tenant created successfully");
        } catch (err: any) {
          const message =
            err?.error?.data?.message ||
            err?.data?.message ||
            "Failed to create tenant";

          toast.error(message);
        }
      },
    }),

    getOverviewAnalytics: builder.query({
      query: () => "/analytics/overview",

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.message) toast.success(data.message);
        } catch (err: any) {
          toast.error(err?.error?.data?.message || "Failed to fetch overview");
        }
      },
    }),

    getThroughput: builder.query({
      query: (range = "weekly") => `/analytics/throughput?range=${range}`,

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.message) toast.success(data.message);
        } catch (err: any) {
          toast.error(
            err?.error?.data?.message || "Failed to fetch throughput",
          );
        }
      },
    }),
  }),
});

export const {
  useGetTenantsQuery,
  useCreateTenantMutation,
  useGetOverviewAnalyticsQuery,
  useGetThroughputQuery,
} = adminApi;
