import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

import { Button } from "../../Custom/ui/button";
import { deadlineCovert } from "../../Utility/dateConverter";

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
import { Textarea } from "../../Custom/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Custom/ui/select";

import { Checkbox } from "../../Custom/ui/checkbox";
import { Upload } from "./Upload";

import { AttachmentButton } from "./AttachmentButton";

import { Priority, Project, ProjectModalProps, ProjectStatus } from "../types/projetctTypes";

interface User {
  name: string;
  role: string;
}

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  project,
 
}: ProjectModalProps) {

const [errors,setError]=useState({
  name:"",
  description:"",
  assigned:"",

})



  // const dispatch = useDispatch<AppDispatch>();

  const availableUsers = useSelector((state: RootState) =>
    state.alluser.users.filter((user: User) => user.role !== "Owner")
  );

  const [uploads, setUploads] = useState<string[] | null>(null);
  const [showUploadPage, setShowUploadPage] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    clientName: "",
    description: "",
    assignedUsers: [] as string[],
    deadline: "",
    priority: "Low" as Priority,
    status: "Planning" as ProjectStatus,
    attachment: [] as string[],
  });

  /* ---------- LOAD PROJECT DATA ---------- */
  useEffect(() => {
    if (project) {
      setFormData({
        id: project._id || "",
        name: project.name || "",
        clientName: project.clientName || "",
        description: project.description || "",
        assignedUsers: project.assignedUsers || [],
        deadline: deadlineCovert(project.deadline) || "",
        status: project.status || "Planning",
        priority: project.priority || "Low",
        attachment: project.attachedUrl || [],
      });
    } else {
      // Reset form when adding new project
      setFormData({
        id: "",
        name: "",
        clientName: "",
        description: "",
        assignedUsers: [],
        deadline: "",
        priority: "Low",
        status: "Planning",
        attachment: [],
      });
      setUploads(null);
    }
  }, [project]);

  /* ---------- HANDLERS ---------- */
  const onSubmitFiles = (data: string[]) => {
    setUploads(data);
    setShowUploadPage(false);
  };

  const handleUserToggle = (user: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedUsers: checked
        ? [...prev.assignedUsers, user]
        : prev.assignedUsers.filter((u) => u !== user),
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Clear previous errors
  setError({
    name: "",
    description: "",
    assigned: "",
  });

  const validationErrors = {
    name: "",
    description: "",
    assigned: "",
  };

  let isValid = true;

  // Name validation
  if (!formData.name.trim()) {
    validationErrors.name = "Project name is required";
    isValid = false;
  }

  // Description validation
  if (!formData.description.trim()) {
    validationErrors.description = "Description is required";
    isValid = false;
  }

  // Assigned users validation
  if (formData.assignedUsers.length === 0) {
    validationErrors.assigned = "Please assign at least one user";
    isValid = false;
  }

  // Stop if validation fails
  if (!isValid) {
    setError(validationErrors);
    return;
  }

  const updatedProject: Project = {
    _id: formData.id,
    name: formData.name,
    clientName: formData.clientName,
    description: formData.description,
    assignedUsers: formData.assignedUsers,
    deadline: formData.deadline,
    status: formData.status,
    priority: formData.priority,
    attachment: uploads ?? [],
    attachedUrl: formData.attachment,
  };

  await onSubmit(updatedProject);
};
  return (
<Dialog
  open={isOpen}
  onOpenChange={(open) => {
    if (!open) {
      setError({})
      onClose()
    }
  }}
>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl">
            {project ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {project
              ? "Update project details and team assignments."
              : "Fill in the details to create a new project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter project name"
                required
              />
              <p className="text-red-500 text-sm">{errors.name}</p>
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, clientName: e.target.value }))
                }
                placeholder="Enter client name"
                required
              />
              
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Project description..."
              rows={4}
              className="resize-y min-h-[100px]"
            />
            <p className="text-red-500 text-sm">{errors.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ProjectStatus) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* Assigned Users */}
          <div className="space-y-3">
            <Label>Assigned Users</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto border rounded-md p-4 bg-muted/30">
              {availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <div
                    key={user.name}
                    className="flex items-center space-x-3 py-1"
                  >
                    <Checkbox
                      id={`user-${user.name}`}
                      checked={formData.assignedUsers.includes(user.name)}
                      onCheckedChange={(checked) =>
                        handleUserToggle(user.name, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`user-${user.name}`}
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      {user.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No users available</p>
              )}
            </div>
            <p className="text-red-500 text-sm">{errors.assigned}</p>
          </div>

          {/* Attachments Section */}
          <div className="space-y-4">
            {project?.attachedUrl && project.attachedUrl.length > 0 && (
              <div className="space-y-2">
                <Label>Existing Attachments</Label>
                <AttachmentButton
                  attachedUrl={project.attachedUrl}
                  taskId={formData.id}
                  
                  isProject={true}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Label className="sm:min-w-[80px]">New Upload</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUploadPage(true)}
                className="w-full sm:w-auto"
              >
                Choose Files to Upload
              </Button>

              {uploads && uploads.length > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  {uploads.length} file(s) ready to attach
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-6 border-t flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {project ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>

        {/* Upload Modal */}
        <Upload
          isOpen={showUploadPage}
          removeUpload={setUploads}
          onClose={() => setShowUploadPage(false)}
          onSubmit={onSubmitFiles}
        />
      </DialogContent>
    </Dialog>
  );
}