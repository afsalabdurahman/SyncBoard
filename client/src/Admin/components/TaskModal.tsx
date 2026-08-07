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
  onSubmit: (data) => void;
  task?: Task | null;
}

export function TaskModal({ isOpen, onClose, onSubmit, task }: TaskModalProps) {
  const [selectAttachmanet, setAttachements] = useState<string>();
  const [subTask, setSubTask] = useState<object[]>([]);
  const [criteria, setCriteria] = useState<object[]>([]);
  const [expire, setExpire] = useState<string>("");

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
    status: "To Do" as const,
    deadline: "",
    priority: "Medium" as const,
    projectId: "",
    attachedURLs: [],
    subTask: [],
    acceptanceCriteria: [],
  });

  const [uploads, setUploads] = useState<string[]>([]);
  const [showUploadPage, setUploadPage] = useState(false);

  const projects = useProjects();

  const users = new Set(
    projects
      .map((user) => user.assignedUsers || [])
      .flat()
  );

  // Initialize form when task or modal opens
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
      setExpire(task.deadline || "");
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

    formData.subTask = subTask;
    formData.acceptanceCriteria = criteria;

    // Clear previous errors
    setError({ name: "", description: "", project: "", assignedUser: "", deadline: "" });

    const validationErrors = { name: "", description: "", project: "", assignedUser: "", deadline: "" };
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
        const uploadPromises = uploads.map((file) => uploadAttachment(file.file));
        const uploadedUrls = await Promise.all(uploadPromises);
        formData.attachedURLs = uploadedUrls;
      }
      await onSubmit(formData);
    } catch (error) {
      console.error("Failed to submit task:", error);
    }
  };

  const uploadFiles = () => setUploadPage(true);

  const closeTaskModel = () => {
    setUploads([]);
    setAttachements(undefined);
    setError({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeTaskModel}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {task ? "Update task information and assignments." : "Create a new task and assign it to a team member."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Task Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Task Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
              <p className="text-red-500 text-sm col-span-4">{errors.name}</p>
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <textarea
              
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3 border rounded p-2"
              />
              <p className="text-red-500 text-sm col-span-4">{errors.description}</p>
            </div>

            {/* Project - FIXED */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">Project</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => {
                  const selectedProject = projects.find((p) => p._id === value);
                  if (selectedProject) {
                    setFormData({
                      ...formData,
                      project: selectedProject.name,
                      projectId: selectedProject._id,
                      deadline: selectedProject.deadline || formData.deadline,
                    });
                    setExpire(selectedProject.deadline || "");
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={String(project._id)} value={String(project._id)}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm col-span-4">{errors.project}</p>
            </div>

            {/* Assigned User */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedUser" className="text-right">Assigned User</Label>
              <Select
                value={formData.assignedUser}
                onValueChange={(value) => setFormData({ ...formData, assignedUser: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(users).map((name: string) => (
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
              <Label htmlFor="status" className="text-right">Status</Label>
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
              <Label htmlFor="priority" className="text-right">Priority</Label>
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
              <Label htmlFor="deadline" className="text-right">Deadline</Label>
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
              />
              <p className="text-red-500 text-sm col-span-4">{errors.deadline}</p>
            </div>

            {/* Existing Attachments */}
            {task?.attachedURLs?.length >= 1 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Attachments</Label>
                <AttachmentButton
                  attachedUrl={task.attachedURLs}
                  taskId={task._id}
                  passURL={setAttachements}
                />
              </div>
            )}

            {/* Upload New Attachment */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Attachment</Label>
              <Button type="button" onClick={uploadFiles}>
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

            {/* Criteria */}
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
          onSubmit={(files) => setUploads(files)}
        />
      </DialogContent>
    </Dialog>
  );
}