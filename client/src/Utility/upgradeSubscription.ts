type SubscriptionLimit = {
  maxProjects: number;
  maxTasks: number;
  maxUsers: number;
};

type SubscriptionPlan = "free" | "basic" | "pro" | "enterprise";

const SUBSCRIPTION_LIMITS: Record<SubscriptionPlan, SubscriptionLimit> = {
  free: { maxProjects: 1, maxTasks: 2, maxUsers: 2 },
  basic: { maxProjects: 3, maxTasks: 10, maxUsers: 10 },
  pro: { maxProjects: 10, maxTasks: 100, maxUsers: 30 },
  enterprise: {
    maxProjects: Infinity,
    maxTasks: Infinity,
    maxUsers: Infinity,
  },
};

export const findLimit = (plan: SubscriptionPlan): SubscriptionLimit => {
  return SUBSCRIPTION_LIMITS[plan];
};