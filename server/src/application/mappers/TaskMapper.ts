import { Task } from "../../domain/entities/Task";
import { taskType } from "../../types/taskTypes";
import { commentsDTO, CompletedTaskResponseDTO, DbTaskUI, FormattedTask, TaskRequestDTO, TaskResponseDTO } from "../dto/TaskDTOs";
import { z } from "zod";

export const TaskStatusSchema = z.enum(["To Do", "In Progress", "Completed"]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskPrioritySchema = z.enum(["Low", "Medium", "High"]);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;


export class TaskMapper {
  static mapTaskToEntity(input: TaskRequestDTO, vector: number[]): Task {

    return new Task({
      name: input.name,
      description: input.description,
      project: input.project,
      assignedUser: input.assignedUser,
      status: input.status,
      deadline: input.deadline,
      priority: input.priority,
      projectId: input.projectId,
      embedding: vector,
      attachedURLs: input.attachedURLs,
      subTask: input.subTask,
      acceptanceCriteria:input.acceptanceCriteria,

    })
  }
  static mapEntityToTask(msg: string, taskData: Task): TaskResponseDTO {
    const task = new Task(taskData)
    return {
      message: msg,
      task
    }
  }
  static validateTask(input: TaskRequestDTO) {
    const isValid = z.object({

      name: z
        .string()
        .trim()
        .min(1, "Task name is required")
        .max(100, "Word count exceeded")
        .regex(/^[A-Za-z0-9][A-Za-z0-9 ]*$/, {
          message:
            "Name must start with a letter or number and cannot contain special characters",
        }),
      description: z
        .string()
        .trim()
        .min(1, "Description is required")
        .max(1000, "Word count exceeded")
        .regex(/^[A-Za-z0-9][A-Za-z0-9\s.,!?'"()-]*$/, {
          message:
            "Description must start with a letter or number and cannot start with space or special characters",
        }),
      project: z.string().min(1, "Project is required"),
      assignedUser: z.string().min(1, "Assigned user is required"),
      status: TaskStatusSchema,
      deadline: z.string().min(1, "Date is required"),
      priority: TaskPrioritySchema,
      projectId: z.string().min(1, "Project ID is required"),
      attachedURLs: z.array(z.string().url("Must be a valid URL")).optional().default([]),
    });
    return isValid.safeParse(input);
  }

  static MappedCompletdTask(tasks: taskType[]): CompletedTaskResponseDTO {
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
  static mappedEntityToComments(task: Task): commentsDTO[] | null {
    const comments = task?.comments?.map((comment) => {
      return ({
        name: comment.name,
        text: comment.text,
        urls: comment.urls,
        timestamp: comment.timestamp ?? new Date(),


      })
    })
    return comments ?? null
  }
  static mapToListtaskDashboard(tasks: Task[]): FormattedTask[] {
    return tasks.map((task): FormattedTask => ({
      id:
        typeof task.id === "string"
          ? task.id
          : task.id?.toString(),
      title: task.name,

      status:
        task.status === "To Do"
          ? "todo"
          : task.status === "Completed"
            ? "completed"
            : "inprogress",

      priority: task.priority,

      date: new Date(task.deadline as string).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      }),
      userName: task.assignedUser || "",
      assignee: (task.assignedUser || "")
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase(),

      color:
        task.priority === "High"
          ? "bg-red-500"
          : task.priority === "Medium"
            ? "bg-green-500"
            : "bg-blue-500",

      open: true,

      subtasks: (task.subTask || []).map(
        (
          sub: {
            title: string;
            status: "Completed" | "Pending";
            estimate: number;
          },
          subIndex: number
        ) => ({
          id: subIndex + 1,
          title: sub.title,
          done: sub.status === "Completed",
        })
      ),
    }));
  }
  static mapToApprovalTask(tasks: Task[]) {
     tasks.map((task: Task) => {
      return {
        id: task.id,
        title: task.name,
        user: task.assignedUser,
        status: task.status,
        date: new Date(task.updatedAt ?? Date.now()).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        resone: ""
      }

    })
    

  }
  
   static convertTaskForUImapper = (
  dbTask: DbTaskUI
) => {
  return {
    _id: dbTask._id.toString(),

    name: dbTask.name,

    description: dbTask.description,

    assignedUser: {
      name: dbTask.assignedUser,
      email: "No Email Available",
    },

    project: {
      name: dbTask.project,
    },

    deadline: dbTask.deadline,

    priority: dbTask.priority,

    status:
      dbTask.status === "To Do"
        ? "Todo"
        : dbTask.status,

    approvalStatus: "Pending Review",

    /* Subtasks */
    subTask: dbTask.subTask?.map(
      (item, index) => ({
        id: index + 1,
        title: item.title,
        estimate: item.estimate,
        done:
          item.status === "Completed",

        status:
          item.status === "Completed"
            ? "Done"
            : "Todo",
      })
    ) || [],

    /* Acceptance Criteria */
    approvalCriteria:
      dbTask.acceptanceCriteria?.map(
        (item, index) => ({
          id: index + 1,
          title: item.title,

          completed:
            item.status === "Completed",
        })
      ) || [],

    /* Comments */
    comments:
      dbTask.comments?.map(
        (item, index) => ({
          id: index + 1,
          user: item.name,
          text: item.text,

          time: new Date(
            item.timestamp
          ).toLocaleString(),

          attachments:
            item.urls || [],
        })
      ) || [],

    /* Attachments */
    attachedURLs:
      dbTask.attachedURLs?.map(
        (url, index) => ({
          id: index + 1,
          label: `Attachment ${index + 1}`,
          link: url,
        })
      ) || [],
  };
  }
}