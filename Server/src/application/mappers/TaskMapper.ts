import { Task } from "../../domain/entities/Task";
import { TaskRequestDTO, TaskResponseDTO } from "../dto/TaskDTOs";
import { z } from "zod";

export const TaskStatusSchema = z.enum(["To Do", "In Progress", "Completed"]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskPrioritySchema = z.enum(["Low", "Medium", "High"]);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;


export class TaskMapper{
static mapTaskToEntity(input:TaskRequestDTO):Task{
    return new Task({
        name:input.name,
        description:input.description,
        project:input.project,
        assignedUser:input.assignedUser,
        status:input.status,
        deadline:input.deadline,
        priority:input.priority,
        projectId:input.projectId
    })
}
static mapEntityToTask(msg:string):TaskResponseDTO{
    return{
        message:msg
    }
}
static validateTask(input:TaskRequestDTO){
const isValid =  z.object({

  name: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  project: z.string().min(1, "Project is required"),
  assignedUser: z.string().min(1, "Assigned user is required"),
  status: TaskStatusSchema,
  deadline: z.string().min(1, "Date is required"), 
  priority: TaskPrioritySchema,
  projectId: z.string().min(1, "Project ID is required"),
});
return isValid.safeParse(input);
}

}