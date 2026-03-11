import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/store";

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

import { FileText, Image } from "lucide-react";
import { Popup } from "../../Custom/ui/Popup";

import { deleteImage } from "../../Redux/feature/project/projectSlice";
import { Priority, Project, ProjectModalProps, ProjectStatus } from "../types/projetctTypes";

/* ---------- TYPES ---------- */

interface User {
  name: string;
  role: string;
}







/* ---------- COMPONENT ---------- */

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  project,
}: ProjectModalProps) {

  const dispatch = useDispatch<AppDispatch>();

  const availableUsers = useSelector((state: RootState) =>
    state.alluser.users.filter((user: User) => user.role !== "Owner")
  );

  const [uploads, setUploads] = useState<string[] | null>(null);

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

  const [showUploadPage, setUploadPage] = useState(false);
  const [pdfPopup, setPdfPopup] = useState(false);
  const [imagePopup, setImagePopup] = useState(false);

  /* ---------- LOAD PROJECT DATA ---------- */

  useEffect(() => {
    if (project) {
      setFormData({
        id: project._id,
        name: project.name,
        clientName: project.clientName,
        description: project.description,
        assignedUsers: project.assignedUsers,
        deadline: deadlineCovert(project.deadline),
        status: project.status,
        priority: project.priority || "Low",
        attachment: project.attachedUrl || [],
      });
    }
  }, [project]);

  /* ---------- FILE HELPERS ---------- */

  const isImage = (file: string) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file);

  const isPdf = (file: string) =>
    /\.pdf$/i.test(file);

  const imageArray = formData.attachment.filter(isImage);
  const pdfArray = formData.attachment.filter(isPdf);

  const hasImage = imageArray.length > 0;
  const hasPdf = pdfArray.length > 0;

  /* ---------- HANDLERS ---------- */

  const onSubmitFiles = (data: string[]) => {
    setUploads(data);
  };

  const handleUserToggle = (user: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedUsers: checked
        ? [...prev.assignedUsers, user]
        : prev.assignedUsers.filter((u) => u !== user),
    }));
  };

  const deletedSingleUrl = (deleteUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      attachment: prev.attachment.filter((url) => url !== deleteUrl),
    }));

    dispatch(deleteImage(deleteUrl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

  /* ---------- UI ---------- */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">

        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Add New Project"}
          </DialogTitle>

          <DialogDescription>
            {project
              ? "Update project information and assignments."
              : "Create a new project and assign team members."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">

            {/* NAME */}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Name</Label>

              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="col-span-3"
                required
              />
            </div>

            {/* CLIENT */}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Client</Label>

              <Input
                value={formData.clientName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientName: e.target.value,
                  }))
                }
                className="col-span-3"
                required
              />
            </div>

            {/* DESCRIPTION */}

            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right mt-2">Description</Label>

              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>

            {/* PRIORITY */}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Priority</Label>

              <Select
                value={formData.priority}
                onValueChange={(value: Priority) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: value,
                  }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ASSIGNED USERS */}

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Assigned Users</Label>

              <div className="col-span-3 space-y-2">

                {availableUsers.map((user) => (
                  <div
                    key={user.name}
                    className="flex items-center space-x-2"
                  >

                    <Checkbox
                      id={user.name}
                      checked={formData.assignedUsers.includes(user.name)}
                      onCheckedChange={(checked) =>
                        handleUserToggle(user.name, checked as boolean)
                      }
                    />

                    <Label
                      htmlFor={user.name}
                      className="text-sm font-normal"
                    >
                      {user.name}
                    </Label>

                  </div>
                ))}

              </div>
            </div>

            {/* DEADLINE */}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Deadline</Label>

              <Input
                type="date"
                value={formData.deadline}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deadline: e.target.value,
                  }))
                }
                className="col-span-3"
                required
              />
            </div>

            {/* STATUS */}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>

              <Select
                value={formData.status}
                onValueChange={(value: Status) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
              >
                <SelectTrigger className="col-span-3">
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

            {/* ATTACHMENT */}

            <div className="flex items-center gap-4">

              <Label>Attachment</Label>

              <Button
                type="button"
                onClick={() => setUploadPage(true)}
              >
                Upload
              </Button>

              {uploads ? (
                <p className="text-red-500 text-sm">
                  {uploads.length} file(s) attached
                </p>
              ) : (
                <div className="flex gap-4">

                  {hasPdf && (
                    <>
                      <Popup
                        isOpen={pdfPopup}
                        onClose={() => setPdfPopup(false)}
                        Url={pdfArray}
                        type="pdf"
                        projectId={formData.id}
                        deletdAUrl={deletedSingleUrl}
                      />

                      <FileText
                        className="w-6 h-6 text-red-500 cursor-pointer"
                        onClick={() => setPdfPopup(true)}
                      />
                    </>
                  )}

                  {hasImage && (
                    <>
                      <Popup
                        isOpen={imagePopup}
                        onClose={() => setImagePopup(false)}
                        Url={imageArray}
                        type="image"
                        projectId={formData.id}
                        deletdAUrl={deletedSingleUrl}
                      />

                      <Image
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => setImagePopup(true)}
                      />
                    </>
                  )}

                </div>
              )}
            </div>

          </div>

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button type="submit">
              {project ? "Update Project" : "Add Project"}
            </Button>

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