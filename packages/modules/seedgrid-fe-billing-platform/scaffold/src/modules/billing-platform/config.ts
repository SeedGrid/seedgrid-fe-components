export const billingPlatformConfig = {
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50],
  },
  routes: {
    plans: "/platform/plans",
    newPlan: "/platform/plans/new",
    trial: "/platform/plans/trial",
    plan: (publicId: string) => `/platform/plans/${publicId}`,
  },
} as const;
