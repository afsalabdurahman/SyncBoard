import type React from "react";
import { SubtaskSection } from "../components/SubTask";
import { useState, useEffect } from "react";
import { Button } from "../../Custom/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../Custom/ui/dialog";
import { Input } from "../../Custom/ui/input";
import { Label } from "../../Custom/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Custom/ui/select";

import { useProjects } from "../hooks/projectshooks";
import { Upload } from "./Upload";
import { uploadAttachment } from "../../Services/Cloudinary";
import { AttachmentButton } from "./AttachmentButton";
import { CriteriaSection } from "./AccetanceTask";

interface Task {
  _id?: string;
  name: string;
  description: string;
  project: string;
  assignedUser: string;
  status: "To Do" | "In Progress" | "Completed";
  deadline: string;
  priority: "Low" | "Medium" | "High";
  projectId: string;
  attachedURLs: string[];
  subTask?: object[];
  acceptanceCriteria?: object[];
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  task?: Task | null;
}

export function TaskModal({ isOpen, onClose, onSubmit, task }: TaskModalProps) {
  const [subTask, setSubTask] = useState<any[]>([]);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [expire, setExpire] = useState<string>(""); // Project deadline (max date)

  const [errors, setError] = useState({
    name: "",
    description: "",
    project: "",
    assignedUser: "",
    deadline: "",
  });

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    project: "",
    assignedUser: "",
    status: "To Do" as "To Do" | "In Progress" | "Completed",
    deadline: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    projectId: "",
    attachedURLs: [] as string[],
    subTask: [] as any[],
    acceptanceCriteria: [] as any[],
  });

  const [uploads, setUploads] = useState<any[]>([]);
  const [showUploadPage, setUploadPage] = useState(false);
  const [selectAttachmanet, setAttachements] = useState<string>("");

  const projects = useProjects();

  const users = new Set(
    projects
      .map((user: any) => user.assignedUsers || [])
      .flat()
  );

  // Load task data when modal opens or task changes
  useEffect(() => {
    if (task) {
      setFormData({
        id: task._id || "",
        name: task.name,
        description: task.description,
        project: task.project,
        assignedUser: task.assignedUser,
        status: task.status,
        deadline: task.deadline,
        priority: task.priority,
        projectId: task.projectId,
        attachedURLs: task.attachedURLs ?? [],
        subTask: task.subTask ?? [],
        acceptanceCriteria: task.acceptanceCriteria ?? [],
      });
      setExpire(task.deadline || ""); // You can change this to project deadline if available
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        project: "",
        assignedUser: "",
        status: "To Do",
        deadline: "",
        priority: "Medium",
        projectId: "",
        attachedURLs: [],
        subTask: [],
        acceptanceCriteria: [],
      });
      setExpire("");
    }
    setUploads([]);
    setError({
      name: "",
      description: "",
      project: "",
      assignedUser: "",
      deadline: "",
    });
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update dynamic fields
    formData.subTask = subTask;
    formData.acceptanceCriteria = criteria;

    // Clear previous errors
    setError({
      name: "",
      description: "",
      project: "",
      assignedUser: "",
      deadline: "",
    });

    const validationErrors = {
      name: "",
      description: "",
      project: "",
      assignedUser: "",
      deadline: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      validationErrors.name = "Task name is required";
      isValid = false;
    }
    if (!formData.description.trim()) {
      validationErrors.description = "Task description is required";
      isValid = false;
    }
    if (!formData.project.trim()) {
      validationErrors.project = "Project selection is required";
      isValid = false;
    }
    if (!formData.assignedUser.trim()) {
      validationErrors.assignedUser = "Assigned user is required";
      isValid = false;
    }
    if (!formData.deadline) {
      validationErrors.deadline = "Deadline is required";
      isValid = false;
    }

    if (!isValid) {
      setError(validationErrors);
      return;
    }

    try {
      if (uploads.length > 0) {
        const uploadPromises = uploads.map((file: any) =>
          uploadAttachment(file.file)
        );
        const uploadedUrls = await Promise.all(uploadPromises);
        formData.attachedURLs = uploadedUrls;
      }

      await onSubmit(formData);
    } catch (error) {
      console.error("Failed to submit task:", error);
    }
  };

  const onSubmitFiles = (files: any[]) => {
    setUploads(files);
  };

  const passURL = (url: string) => {
    setAttachements(url);
  };

  const closeTaskModel = () => {
    setUploads([]);
    setAttachements("");
    setError({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeTaskModel}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update task information and assignments."
              : "Create a new task and assign it to a team member."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Task Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Task Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                required
              />
              <p className="text-red-500 text-sm col-span-4">{errors.name}</p>
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3 min-h-[80px]"
                required
              />
              <p className="text-red-500 text-sm col-span-4">{errors.description}</p>
            </div>

            {/* Project Select - FIXED */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                Project
              </Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => {
                  const selectedProject = projects.find((p: any) => p._id === value);
                  if (selectedProject) {
                    setFormData((prev) => ({
                      ...prev,
                      project: selectedProject.name,
                      projectId: selectedProject._id,
                    }));
                    setExpire(selectedProject.deadline || "");
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project: any) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm col-span-4">{errors.project}</p>
            </div>

            {/* Assigned User */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedUser" className="text-right">
                Assigned User
              </Label>
              <Select
                value={formData.assignedUser}
                onValueChange={(value) =>
                  setFormData({ ...formData, assignedUser: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(users).map((name: any) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm col-span-4">{errors.assignedUser}</p>
            </div>

            {/* Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "To Do" | "In Progress" | "Completed") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "Low" | "Medium" | "High") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Deadline */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                min={new Date().toISOString().split("T")[0]}
                max={expire ? expire.split("T")[0] : ""}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="col-span-3"
                required
              />
              <p className="text-red-500 text-sm col-span-4 text-center">
                {errors.deadline}
              </p>
            </div>

            {/* Existing Attachments */}
            {task?.attachedURLs?.length >= 1 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Attachments</Label>
                <AttachmentButton
                  attachedUrl={task.attachedURLs}
                  taskId={task._id}
                  passURL={passURL}
                />
              </div>
            )}

            {/* Upload New Attachment */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Attachment</Label>
              <Button type="button" onClick={() => setUploadPage(true)}>
                Upload
              </Button>
              {uploads.length > 0 && <p className="text-green-600">Files attached</p>}
            </div>

            {/* Subtask */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Subtask</Label>
              <SubtaskSection
                setSubTask={setSubTask}
                subTask={task?.subTask ?? []}
                taskId={task?._id ?? ""}
                deadLine={formData.deadline}
              />
            </div>

            {/* Acceptance Criteria */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Criteria</Label>
              <CriteriaSection
                setCriteria={setCriteria}
                criteria={task?.acceptanceCriteria ?? []}
                taskId={task?._id ?? ""}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeTaskModel}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Update Task" : "Add Task"}</Button>
          </DialogFooter>
        </form>

        <Upload
          isOpen={showUploadPage}
          onClose={() => setUploadPage(false)}
          onSubmit={onSubmitFiles}
        />
      </DialogContent>
    </Dialog>
  );
}