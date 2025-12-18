export const SUBSCRIPTION_LIMITS :any = {
  free: { maxProjects: 1, maxTasks: 2, maxUsers: 2 },
  basic: { maxProjects: 4, maxTasks: 10, maxUsers: 10 },
  pro: { maxProjects: 10, maxTasks: 100, maxUsers: 30 },
  enterprise:  { maxProjects: Infinity, maxTasks: Infinity, maxUsers: Infinity },
};