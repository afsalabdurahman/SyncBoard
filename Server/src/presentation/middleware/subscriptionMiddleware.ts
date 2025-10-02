import  {SubscriptionModel} from "../../infrastructure/database/models/SuscriptionModel" 
import {ProjectModel} from  "../../infrastructure/database/models/ProjectModel";
import {TaskModel} from "../../infrastructure/database/models/TaskModel"
import {UserModel} from "../../infrastructure/database/models/UserModel"
import { Response,NextFunction } from "express";

import {CustomRequest} from"../types/CustomRequest"
import { ForbiddenError, NotFoundError, ValidationError } from "../../utils/errors";
import {ISuscription} from "../../domain/interfaces/repositories/ISuscriptionRepository"
import { SuscriptionRepository } from "../../infrastructure/repositories/SuscriptionRepository";
import { container } from "tsyringe";
import { PlanRepository } from "../../infrastructure/repositories/PlanRepository";
import { ProjectRepository } from "../../infrastructure/repositories/ProjectRepository";
import { TaskRepository } from "../../infrastructure/repositories/TaskRepository";
import { UserMongooseRepository } from "../../infrastructure/repositories/UserRepository";
// const Team = require('../models/Team');

const SUBSCRIPTION_LIMITS :any = {
  free: { maxProjects: 2, maxTasks: 2, maxUsers: 2 },
  basic: { maxProjects: 4, maxTasks: 10, maxUsers: 10 },
  pro: { maxProjects: 10, maxTasks: 100, maxUsers: 30 },
  enterprise:  { maxProjects: Infinity, maxTasks: Infinity, maxUsers: Infinity },
};

export const subscriptionMiddle=(resorce:string)=>{

    console.log("Calling create project middle suscrp....." ,resorce)
 return async  (req:CustomRequest,res:Response,next:NextFunction):Promise<void>=>{
try {
    const subscription = container.resolve(SuscriptionRepository);
     const plan = container.resolve(PlanRepository);
     const projectRepo = container.resolve(ProjectRepository);
     const taskRepo = container.resolve(TaskRepository);
     const userRepo = container.resolve(UserMongooseRepository)

//     let userId = req.params.userid;
//   if(!userId) throw new NotFoundError("User is missing");
if(!req.user?.id) throw new NotFoundError("NOt found")
    console.log(req.user,"req.user1111")
const isSubscribe=await subscription.findSuscriptionByUserId(req.user.id);
console.log(isSubscribe ,"is sucripr22222")
if(!isSubscribe ) throw new NotFoundError("Suscription is not found");
const checkisAvilablePlan= await plan.findByKey(isSubscribe.planKey);
console.log(checkisAvilablePlan ,"chekoutAvilable plan 3333333")
if (!checkisAvilablePlan) throw new NotFoundError("Plan is not Avilable")

    let myPlan:any=isSubscribe.planKey
console.log(myPlan,"plan")
const limit = SUBSCRIPTION_LIMITS[myPlan]
console.log(limit,";imlit")
if(resorce == "project"){
const ProjectCount = await projectRepo.countProject();
console.log(ProjectCount,"Projectcount")
  if (ProjectCount > limit.maxProjects && limit.maxProjects !== Infinity){
    console.log("Project limit excced")
throw new ForbiddenError("Project is exceed")
  }
    
  }else if(resorce == "task"){
    const taskCount = await taskRepo.countTask();
    if (taskCount >= limit.maxTasks && limit.maxTasks !== Infinity){
throw new ValidationError("Task limit is exceed")
  }
} 


next()
} catch (error) {
    console.error(error,"error from mid")
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