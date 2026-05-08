
import type React from "react";
import { SubtaskSection } from "../components/SubTask"
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
  subTask?: object[]
  acceptanceCriteria?: object[]
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  task?: Task | null;
}



export function TaskModal({ isOpen, onClose, onSubmit, task }: TaskModalProps) {
  const [selectAttachmanet, setAttachements] = useState<string>()
  const [subTask, setSubTask] = useState([])
  const [criteria, setCriteria] = useState([])
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
    attachedURLs: [],
    subTask: [],
    acceptanceCriteria: [],

  });

  const projects = useProjects()
  const users = new Set(
    projects.map((user: { id: number; name: string; assignedUsers: string[] }) => {
      return user.assignedUsers.map((name: string) => {
        return name;
      });
    }).flat()
  );

  useEffect(() => {
    if (task) {
      setFormData({
        id: task._id || "123",
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
    }
  }, [task, isOpen]);


  const onSubmitFiles = (files: File[]) => {
    setUploads(files);
  };

  const passURL = (url) => {
    setAttachements(url)
  }
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // update dynamic fields
  formData.subTask = subTask;
  formData.acceptanceCriteria = criteria;

  // clear previous errors
  setError({
    name: "",
    description: "",
    project: "",
    assignedUser: "",
    deadline: "",
  });

  let validationErrors = {
    name: "",
    description: "",
    project: "",
    assignedUser: "",
    deadline: "",
  };

  let isValid = true;

  // Task name validation
  if (!formData.name.trim()) {
    validationErrors.name = "Task name is required";
    isValid = false;
  }

  // Description validation
  if (!formData.description.trim()) {
    validationErrors.description = "Task description is required";
    isValid = false;
  }

  // Project validation
  if (!formData.project.trim()) {
    validationErrors.project = "Project selection is required";
    isValid = false;
  }

  // Assigned user validation
  if (!formData.assignedUser.trim()) {
    validationErrors.assignedUser = "Assigned user is required";
    isValid = false;
  }

  // Deadline validation
  if (!formData.deadline) {
    validationErrors.deadline = "Deadline is required";
    isValid = false;
  }

  // Stop submit if validation fails
  if (!isValid) {
    setError(validationErrors);
    return;
  }

  try {
    if (uploads.length > 0) {
      const uploadPromises = uploads.map((file: File) =>
        uploadAttachment(file.file)
      );

      const uploadedUrls = await Promise.all(uploadPromises);

      formData.attachedURLs = uploadedUrls;
      await onSubmit(formData);
    } else {
      await onSubmit(formData);
    }
  } catch (error) {
    console.log(error);
  }
};
  const [uploads, setUploads] = useState([]);
  const [showUploadPage, setUploadPage] = useState(false);
  const uploadFiles = () => {
    setUploadPage(true);
  };
  const closeTaskModel = () => {
    setUploads([])
    setFormData((prev) => ({
      ...prev,
      attachedURLs: prev.attachedURLs.filter(
        (url) => url !== selectAttachmanet
      ),
    }));
   setError({})
    onClose()
  }
  // const setDelete = (url: string) => {


  //   setFormData((prev) => ({
  //     ...prev,
  //     attachedURLs: prev.attachedURLs.filter((existingUrl) => existingUrl !== url)
  //   }));
  // };
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
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Task Name
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
            <p className="text-red-500 text-sm">{errors.name}</p>
            <div className='grid grid-cols-4 items-center gap-4 '>
              <Label htmlFor='description' className='text-right'>
                Description
              </Label>
              <textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className='col-span-3'
                required
              />
              <p className="text-red-500 text-sm">{errors.description}</p>

            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='project' className='text-right'>
                Project
              </Label>
              <Select
                value={JSON.stringify({ name: formData.project, id: formData.projectId })}
                onValueChange={(value) => {
                  const { name, id } = JSON.parse(value);

                  setFormData({ ...formData, project: name, projectId: id })
                }

                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select a project' />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={JSON.stringify({ name: project.name, id: project._id })}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
                
              </Select>
              <p className="text-red-500 text-sm">{errors.project}</p>

            </div>


            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='assignedUser' className='text-right'>
                Assigned User
              </Label>
              <Select
                value={formData.assignedUser}
                onValueChange={(value) =>
                  setFormData({ ...formData, assignedUser: value })
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select a user' />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(users).map((name) => (
                    <SelectItem key={name as string} value={name as string}>
                      {name as string}
                    </SelectItem>
                  ))}



                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{errors.assignedUser}</p>

            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "To Do" | "In Progress" | "Completed") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='To Do'>To Do</SelectItem>
                  <SelectItem value='In Progress'>In Progress</SelectItem>
                  <SelectItem value='Completed'>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='priority' className='text-right'>
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "Low" | "Medium" | "High") =>
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
              </Select>
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
              <p className="text-red-500 text-sm">{errors.deadline}</p>
            </div>
            {task?.attachedURLs?.length >= 1 && (
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='status' className='text-right'>
                  Attachmented
                </Label>
                <AttachmentButton attachedUrl={task?.attachedURLs} taskId={task?._id} passURL={passURL} />
              </div>)}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Attachment
              </Label>
              <Button type='button' onClick={uploadFiles}>
                Upload
              </Button>
              {uploads.length > 0 ? <p className="text-red-700">files attached</p> : null}


            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='subTask' className='text-right'>
                Subtask
              </Label>
              <SubtaskSection setSubTask={setSubTask} subTask={task?.subTask ?? []} taskId={task?._id ?? ""} />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='subTask' className='text-right'>
                Criteria
              </Label>
              <CriteriaSection setCriteria={setCriteria} criteria={task?.acceptanceCriteria ?? []} taskId={task?._id ?? ""} />
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={closeTaskModel}>
              Cancel
            </Button>
            <Button type='submit'>{task ? "Update Task" : "Add Task"}</Button>
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
