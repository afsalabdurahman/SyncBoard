export interface SubscriptionLimit {
  maxProjects: number;
  maxTasks: number;
  maxUsers: number;
}

export interface SubscriptionLimitsMap {
  free: SubscriptionLimit;
  basic: SubscriptionLimit;
  pro: SubscriptionLimit;
  enterprise: SubscriptionLimit;
}
export const SUBSCRIPTION_LIMITS: SubscriptionLimitsMap = {
  free: {
    maxProjects: 1,
    maxTasks: 2,
    maxUsers: 2,
  },
  basic: {
    maxProjects: 4,
    maxTasks: 10,
    maxUsers: 10,
  },
  pro: {
    maxProjects: 10,
    maxTasks: 100,
    maxUsers: 30,
  },
  enterprise: {
    maxProjects: Infinity,
    maxTasks: Infinity,
    maxUsers: Infinity,
  },
};
