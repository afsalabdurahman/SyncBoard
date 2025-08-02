"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useSelector } from "react-redux";


interface Task {
  _id?:string ;
  name: string;
  description:string;
  project: string;
  assignedUser: string;
  status: "To Do" | "In Progress" | "Completed";
  deadline: string;
  priority: "Low" | "Medium" | "High";
  projectId:""
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  task?: Task | null;
}



export function TaskModal({ isOpen, onClose, onSubmit, task }: TaskModalProps) {
  const [formData, setFormData] = useState({
    id:"",
    name: "",
    description:"",
    project: "",
    assignedUser: "",
    status: "To Do" as "To Do" | "In Progress" | "Completed",
    deadline: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    projectId:"",
  });
useSelector((state)=>{
  console.log(state,"state fromredux+++")
})

let projects=useSelector(state=>state.projects.list)
let users = new Set(
  projects.map((user: { id: number; name: string; assignedUsers: string[] }) => {
    return user.assignedUsers.map((name: string) => {
      return name;
    });
  }).flat()
);

  useEffect(() => {
    if (task) {
      setFormData({
        id:task._id||"123",
        name: task.name,
        description:task.description,
        project: task.project,
        assignedUser: task.assignedUser,
        status: task.status,
        deadline: task.deadline,
        priority: task.priority,
        projectId:task.projectId
      });
    } else {
      setFormData({
        id:"",
        name: "",
        description:"",
        project: "",
        assignedUser: "",
        status: "To Do",
        deadline: "",
        priority: "Medium",
        projectId:""
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[525px]'>
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
            <div className='grid grid-cols-4 items-center gap-4'>
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
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='project' className='text-right'>
                Project
              </Label>
              <Select
                  value={JSON.stringify({ name: formData.project, id: formData.projectId })}
                onValueChange={(value) =>
                {
                   const { name, id } = JSON.parse(value);
                   console.log(value,"values")
                   setFormData({ ...formData, project: name,projectId:id })
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
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit'>{task ? "Update Task" : "Add Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
