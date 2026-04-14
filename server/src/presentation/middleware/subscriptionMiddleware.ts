
import { Response,NextFunction } from "express";

import {CustomRequest} from"../types/CustomRequest"
import {  NotFoundError, ValidationError } from "../../utils/errors";
import { SuscriptionRepository } from "../../infrastructure/repositories/SuscriptionRepository";
import { container } from "tsyringe";
import { PlanRepository } from "../../infrastructure/repositories/PlanRepository";
import { ProjectRepository } from "../../infrastructure/repositories/ProjectRepository";
import { TaskRepository } from "../../infrastructure/repositories/TaskRepository";
import { SUBSCRIPTION_LIMITS, SubscriptionLimitsMap } from "../../utils/subscriptionUtil";



export const subscriptionMiddle=(resorce:string)=>{

 return async  (req:CustomRequest,res:Response,next:NextFunction):Promise<void>=>{
try {
    const subscription = container.resolve(SuscriptionRepository);
     const plan = container.resolve(PlanRepository);
     const projectRepo = container.resolve(ProjectRepository);
     const taskRepo = container.resolve(TaskRepository);
const userId=req.user?.id
if(!userId) throw new NotFoundError("NOt found")
  if(req?.user?.role=="Member") return next()
    const project =await projectRepo.findProjectbyAdminId(userId)
 if (!project || project.length === 0) {
  return next();
}
const isSubscribe=await subscription.findSuscriptionByUserId(userId);

if(!isSubscribe ) throw new NotFoundError("Suscription is not found");
const checkisAvilablePlan= await plan.findByKey(isSubscribe.planKey);

if (!checkisAvilablePlan) throw new NotFoundError("Plan is not Avilable")

const myPlan = isSubscribe.planKey as keyof SubscriptionLimitsMap;

const limit = SUBSCRIPTION_LIMITS[myPlan];

if(resorce == "project"){
const ProjectCount = await projectRepo.countProject();

  if (ProjectCount > limit.maxProjects && limit.maxProjects !== Infinity){

throw new ValidationError("Project is exceed")
  }
    
  }else if(resorce == "task"){
    const taskCount = await taskRepo.countTask();
    if (taskCount >= limit.maxTasks && limit.maxTasks !== Infinity){
throw new ValidationError("Task limit is exceed")
  }
} 


next()
} catch (error) {
    next(error)
}

 }
}



// const subscriptionLimitMiddleware = (resource) => async (req, res, next) => {
//   try {
//     const { userId } = req.user;
//     const subscription = await Subscription.findOne({ userId });
//     if (!subscription || subscription.subscriptionStatus !== 'active') {
//       return res.status(403).json({ error: 'Active subscription required' });
//     }

//     const { planKey } = subscription;
//     const limits = SUBSCRIPTION_LIMITS[planKey];

//     if (resource === 'projects') {
//       const projectCount = await Project.countDocuments({ userId });
//       if (projectCount >= limits.maxProjects && limits.maxProjects !== Infinity) {
//         return res.status(403).json({
//           error: `Project limit exceeded for ${planKey} plan. Current: ${projectCount}/${limits.maxProjects}`,
//         });
//       }
//     } else if (resource === 'tasks') {
//       const taskCount = await Task.countDocuments({ userId });
//       if (taskCount >= limits.maxTasks && limits.maxTasks !== Infinity) {
//         return res.status(403).json({
//           error: `Task limit exceeded for ${planKey} plan. Current: ${taskCount}/${limits.maxTasks}`,
//         });
//       }
//     } else if (resource === 'users') {
//       const teamCount = await Team.countDocuments({ userId });
//       if (teamCount >= limits.maxUsers && limits.maxUsers !== Infinity) {
//         return res.status(403).json({
//           error: `User invite limit exceeded for ${planKey} plan. Current: ${teamCount}/${limits.maxUsers}`,
//         });
//       }
//     }

//     next();
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = subscriptionLimitMiddleware;