const SUBSCRIPTION_LIMITS :any = {
  free: { maxProjects: 2, maxTasks: 2, maxUsers: 2 },
  basic: { maxProjects: 3, maxTasks: 10, maxUsers: 10 },
  pro: { maxProjects: 10, maxTasks: 100, maxUsers: 30 },
  enterprise: { maxProjects: Infinity, maxTasks: Infinity, maxUsers: Infinity },
};


export const findLimit = (plan:string) => {
return SUBSCRIPTION_LIMITS[plan]
}