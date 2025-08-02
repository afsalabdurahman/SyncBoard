"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../components/ui/button";
import { ConfirmDialog } from "../../components/ui/DeleteAlertButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { TaskModal } from "./TaskModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Edit, Trash2, Plus, Calendar } from "lucide-react";
import apiService from "../../services/api";
import { updateTask } from "../../Redux/workspace/admin/TaskSlice";
interface Task {
  _id: string;
  name: string;
  project: string;
  projectId: string;
  assignedUser: string;
  status: "To Do" | "In Progress" | "Done";
  deadline: string;
  priority: "Low" | "Medium" | "High";
}

const initialTasks: Task[] = [
  // {
  //   id: 1,
  //   name: "Design Homepage",
  //   project: "Website Redesign",
  //   assignedUser: "Jane Smith",
  //   status: "In Progress",
  //   deadline: "2024-01-25",
  //   priority: "High",
  // },
];

export function TasksPage() {
  let AdminId = useSelector((state: any) => {
    return state?.user?.user?.id;
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [tasks, setTasks] = useState<any>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await apiService.get(`task/alltasks`);
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, [refreshKey]);

  let projects = useSelector((state) => state.projects.list);
  let users = new Set(
    projects
      .map((user: { id: number; name: string; assignedUsers: string[] }) => {
        return user.assignedUsers.map((name: string) => {
          return name;
        });
      })
      .flat()
  );

  console.log(tasks, "taskk");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  const handleAddTask = async (taskData: Omit<Task, "id">) => {
    console.log(taskData, "data submitteddd");
    const newTask = {
      ...taskData,
      id: Math.max(...tasks.map((t) => t.id)) + 1,
    };
    setTasks([...tasks, newTask]);
    try {
      let response = await apiService.post("task/create", { newTask });
      console.log(response, "from dba");
        setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.log(error, "errirorr");
    }
  };
  const handleEditTask = async (taskData) => {
    console.log(taskData, "editedTakedd");
    const id = taskData.id;
    const response = await apiService.patch(`task/update/${id}`, {
      taskData,
    });
    console.log(response, "from edit task ");
    setRefreshKey((prev) => prev + 1);
  };

  const handleDeleteTask = (id: string) => {
    setIsDialogOpen(true);
    setDeleteTaskId(id);
  };
  const handleConfirmDelete = async () => {
    const response = await apiService.delete(`task/delete/${deleteTaskId}`);
    console.log(response, "responseSXIOD");
    setRefreshKey((prev) => prev + 1);
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Done":
        return "default";
      case "In Progress":
        return "secondary";
      case "To Do":
        return "outline";
      default:
        return "outline";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && deadline !== "";
  };

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>Tasks</h2>
        <Button onClick={openAddModal}>
          <Plus className='mr-2 h-4 w-4' />
          Add Task
        </Button>
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Filter by status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='All statuses' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Statuses</SelectItem>
              <SelectItem value='To Do'>To Do</SelectItem>
              <SelectItem value='In Progress'>In Progress</SelectItem>
              <SelectItem value='Done'>Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>
            Track and manage tasks across all projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Assigned User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className='font-medium'>{task.name}</TableCell>
                  <TableCell className='font-medium'>
                    {task.description}
                  </TableCell>
                  <TableCell>{task.project}</TableCell>
                  <TableCell>{task.assignedUser}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`flex items-center gap-2 ${
                        isOverdue(task.deadline) ? "text-red-600" : ""
                      }`}
                    >
                      <Calendar className='h-4 w-4' />
                      {formatDate(task.deadline)}
                      {isOverdue(task.deadline) && (
                        <Badge variant='destructive' className='text-xs'>
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openEditModal(task)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Task?'
        description='This Task will be permanently deleted.'
      />
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        task={editingTask}
      />
    </div>
  );
}
