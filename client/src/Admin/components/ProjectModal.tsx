import type React from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { deadlineCovert } from "../../components/page-components/utility/date/dateConverter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Upload } from "./Upload";
import { FileText, Image, Paperclip, X } from "lucide-react";
import { Popup } from "../../components/ui/Popup";
import { data } from "react-router";
interface Project {
  _id: string;
  name: string;
  clientName: string;
  description: string;
  assignedUsers: string[];
  deadline: string;
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
  priority?: "High" | "Medium" | "Low";
  attachment?: any;
  attachedUrl?: [string];
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Project) => void;
  project?: Project | null;
  setEditproject: React.Dispatch<React.SetStateAction<Project>>;
}

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  project,
  setEditproject,
}: ProjectModalProps) {
  const [uploads, setUploads] = useState(null);
  const [formData, setFormData] = useState({
    id: project ? project._id : undefined,
    clientName: "",
    name: "",
    description: "",
    assignedUsers: [] as string[],
    deadline: "",
    priority: "Low" as "High" | "Medium" | "Low",
    status: "Planning" as "Planning" | "In Progress" | "Completed" | "On Hold",
    attachment: uploads || null,
  });

  const availableUsers = useSelector((state: any) => {
    return state.alluser.users.filter((user: any) => user.role !== "Owner");
  });

  const [showUploadPage, setUploadPage] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  let uploadFiles = () => {
    setUploadPage(true);
  };
  let [isPopup, setPopup] = useState(false);
  let onSubmitFiles = (data: any) => {
    setUploads(data);
  };
  //Check Extention...
  const isImage = (filename: string) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
  const isPdf = (filename: string) => /\.pdf$/i.test(filename);
  let hasPdf = false;
  let hasImage = false;
  if (formData.attachment) {
    hasPdf = formData?.attachment.some(isPdf);
    hasImage = formData?.attachment.some(isImage);
  }

  useEffect(() => {
    if (project) {
      setFormData({
        id: project._id,
        clientName: project.clientName || "",
        name: project.name,
        description: project.description,
        assignedUsers: project.assignedUsers,
        deadline: deadlineCovert(project.deadline),
        status: project.status,
        priority: project.priority || "Low",
        attachment: project.attachedUrl, // Default to Low if not provided
      });
    } else {
      setFormData({
        id: project ? project._id : undefined,
        clientName: "",
        name: "",
        description: "",
        priority: "Low",
        assignedUsers: [],
        deadline: "",
        status: "Planning",
        attachment: null,
      });
    }
  }, [project, isOpen, refreshKey]);
  console.log(project?.attachedUrl, "URLLLLLLe^^^");

  let imageArry = formData.attachment?.filter(
    (url: string) => url.includes(".jpg") || url.includes(".png")
  );
  let pdfArry = formData.attachment?.map((url: string) => {
    if (url.includes(".pdf")) return url;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data to match Omit<Project, "id">
    const updatedData = {
      _id: formData.id ?? "", // fallback to empty string if undefined
      clientName: formData.clientName,
      name: formData.name,
      description: formData.description,
      assignedUsers: formData.assignedUsers.map((user: any) =>
        typeof user === "string" ? user : user.name
      ),
      deadline: formData.deadline,
      status: formData.status,
      priority: formData.priority,
      attachment: uploads,
    };
    onSubmit(updatedData);
    onClose();
  };

  const handleUserToggle = (user: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        assignedUsers: [...formData.assignedUsers, user],
      });
    } else {
      setFormData({
        ...formData,
        assignedUsers: formData.assignedUsers.filter((u) => u !== user),
      });
    }
  };

  const deletedSingleUrl = (deleteUrl: string) => {
    formData.attachment =
      formData.attachment?.filter((url) => url !== deleteUrl) ?? null;

    // setRefreshKey((prev) => prev + 1);
  };
  console.log(formData, "formdata after delete$$$");

  console.log(project, "relaproject");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[525px]'>
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
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Client Name
              </Label>
              <Input
                id='Client'
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                className='col-span-3'
                required
              />
            </div>

            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor='description' className='text-right mt-2'>
                Description
              </Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className='col-span-3'
                rows={3}
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Preiority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "High" | "Medium" | "Low") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Low'>Low</SelectItem>
                  <SelectItem value='Medium'>Medium</SelectItem>
                  <SelectItem value='High'>High</SelectItem>
                </SelectContent>
              </Select>{" "}
            </div>
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label className='text-right mt-2'>Assigned Users</Label>
              <div className='col-span-3 space-y-2'>
                {availableUsers.map((user: string) => (
                  <div key={user} className='flex items-center space-x-2'>
                    <Checkbox
                      id={user}
                      checked={formData.assignedUsers.includes(user.name)}
                      onCheckedChange={(checked) =>
                        handleUserToggle(user.name, checked as boolean)
                      }
                    />
                    <Label htmlFor={user} className='text-sm font-normal'>
                      {user.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='deadline' className='text-right'>
                Deadline
              </Label>
              <Input
                id='deadline'
                type='date'
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(
                  value: "Planning" | "In Progress" | "Completed" | "On Hold"
                ) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Planning'>Planning</SelectItem>
                  <SelectItem value='In Progress'>In Progress</SelectItem>
                  <SelectItem value='Completed'>Completed</SelectItem>
                  <SelectItem value='On Hold'>On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Attachment
              </Label>

              <Button type='button' onClick={uploadFiles}>
                Upload
              </Button>

              {uploads ? (
                <p className='text-red-500 text-sm'>
                  {uploads.length} file(s) attached
                </p>
              ) : (
                <div className='flex items-start gap-4 text-sm text-red-500'>
                  {hasPdf && (
                    <div className='relative'>
                      <FileText className='w-6 h-6 text-red-500' />
                    </div>
                  )}

                  {hasImage && (
                    <div className='relative'>
                      <Popup
                        isOpen={isPopup}
                        onClose={() => setPopup(false)}
                        Url={imageArry}
                        type='image'
                        projectId={formData.id}
                        deletdAUrl={deletedSingleUrl}
                      />

                      <Image
                        onClick={() => setPopup(true)}
                        className='w-6 h-6 text-gray-500'
                      />
                    </div>
                  )}
                </div>
              )}
             
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit'>
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
