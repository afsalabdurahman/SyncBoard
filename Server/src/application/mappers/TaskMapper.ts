import { Task } from "../../domain/entities/Task";
import { CompletedTaskResponseDTO, TaskRequestDTO, TaskResponseDTO } from "../dto/TaskDTOs";
import { z } from "zod";

export const TaskStatusSchema = z.enum(["To Do", "In Progress", "Completed"]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskPrioritySchema = z.enum(["Low", "Medium", "High"]);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;


export class TaskMapper{
static mapTaskToEntity(input:TaskRequestDTO,vector:number[]):Task{
    return new Task({
        name:input.name,
        description:input.description,
        project:input.project,
        assignedUser:input.assignedUser,
        status:input.status,
        deadline:input.deadline,
        priority:input.priority,
        projectId:input.projectId,
        embedding:vector
    })
}
static mapEntityToTask(msg:string,taskData:Task):TaskResponseDTO{
    const task=new Task(taskData)
    return{
        message:msg,
        task
    }
}
static validateTask(input:TaskRequestDTO){
const isValid =  z.object({

  name: z.string().min(1, "Task name is required").max(100,"word count is exceed"),
  description: z.string().min(1, "Description is required").max(1000,"word count is exceed"),
  project: z.string().min(1, "Project is required"),
  assignedUser: z.string().min(1, "Assigned user is required"),
  status: TaskStatusSchema,
  deadline: z.string().min(1, "Date is required"), 
  priority: TaskPrioritySchema,
  projectId: z.string().min(1, "Project ID is required"),
});
return isValid.safeParse(input);
}

 static MappedCompletdTask (tasks:Task[]):CompletedTaskResponseDTO{
     const mappedData = tasks.map((task) => {
      return {
        id: task._id,
        taskName: task.name,
        project: task.project,
        username: task.assignedUser,
        status:
          task.approvalStatus == "Waiting"
            ? "pending"
            : task.approvalStatus == "Approved"
              ? "approved"
              : task.approvalStatus == "Rejected"
                ? "rejected"
                : "pending",

        submittedAt: task.updatedAt,
        rejectionReason: task.rejectionMsg,
      };
    });
    return mappedData as unknown as CompletedTaskResponseDTO
 }
}