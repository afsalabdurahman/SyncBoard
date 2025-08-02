import type React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Calendar, Flag } from "lucide-react";
import { useSelector } from "react-redux";
import apiService from "../../../services/api";

interface Task {
  id: string;
  projectName: string;
  taskName: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "progress" | "completed";
}

// const initialTasks: Task[] = [

// ]

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  let user = useSelector((state: any) => state.user.user);
  useSelector((state) => {
    console.log(state, "redux@@@@@@");
  });
  console.log(user, "userrrr");
  useEffect(() => {
    // if (!user?.id || !user?.name) return;

    const fetchTasks = async () => {
      try {
        console.log("fetchin......");
        // Option 1: Fetching by user.name (if applicable)
        const res1 = await apiService.get(`task/mytask/${user.name}`);
        console.log(res1, "respons1 axios000000000000");
        setTasks(res1.data);
        const tasksFromMyTask: Task[] = res1.data.map((data: any) => ({
          id: data._id.toString(),
          projectName: data.project || "Abcd",
          taskName: data.name || "Untitled Task",
          description: data.description || "No description provided.",
          dueDate: data.dueDate || "2024-01-20",
          priority: (data.priority?.toLowerCase?.() ||
            "medium") as Task["priority"],
          status: (() => {
            const s = data.status?.toLowerCase?.();
            if (s === "To Do") return "todo";
            if (s === "In Progress") return "progress";
            if (s === "Completed") return "completed";
            return "todo";
          })() as Task["status"],
        }));

        // Option 2: Fetching by user.id (if this endpoint is active)
        // const res2 = await apiService.get(`/users/${user.id}/todo`);
        // const tasksFromTodos: Task[] = res2.data.todos.map((data: any) => ({
        //   id: data._id.toString(),
        //   projectName: data.projectName || "Abcd",
        //   taskName: data.name || "Untitled Task",
        //   description: data.description || "No description provided.",
        //   dueDate: data.dueDate || "2024-01-20",
        //   priority: data.priority as Task["priority"],
        //   status: "todo",
        // }));

        // Merge both sources if needed (or pick one based on requirement)
        // const combinedTasks = [...tasksFromMyTask, ...tasksFromTodos];

        setTasks(tasksFromMyTask);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  console.log(tasks, "tasks");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    projectName: "",
    taskName: "",
    description: "",
    dueDate: "",
    priority: "medium" as Task["priority"],
  });

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      setTasks(
        tasks.map((task) =>
          task.id === draggedTask.id ? { ...task, status: newStatus } : task
        )
      );
    }
    let status =
      newStatus == "progress"
        ? "In Progress"
        : newStatus == "completed"
        ? "Completed"
        : newStatus == "todo"
        ? "To Do"
        : "";

    let response = await apiService.patch(
      `/user/task/${draggedTask?.id}/status`,
      {
        status,
      }
    );
    setDraggedTask(null);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.taskName.trim() && newTask.projectName.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        ...newTask,
        status: "todo",
      };
      setTasks([...tasks, task]);
      setNewTask({
        projectName: "",
        taskName: "",
        description: "",
        dueDate: "",
        priority: "medium",
      });
      setShowAddForm(false);
    }
    let updatedData = {
      creator: user.id,
      projectName: newTask.projectName,
      name: newTask.taskName,
      priority: newTask.priority,
      duedate: newTask.dueDate,
    };
    let response = await apiService.post("/user/createtodo", { updatedData });

    // let newMytodo={
    // id:response.data._id.toString(),
    // projectName:response.data.projectName,
    // taskName: response.data.name || "Untitled Task",
    //  description: response.data.description || "No description provided.",
    //  dueDate: response.data.dueDate || "2024-01-20",
    //  priority: response.data.priority as Task["priority"],
    //  status: response.data.status as Task["status"],
    // }
    //  setTasks([...tasks, newMytodo])
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityBadgeVariant = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const columns = [
    { id: "todo", title: "Todo", status: "todo" as const },
    { id: "progress", title: "In Progress", status: "progress" as const },
    { id: "completed", title: "Completed", status: "completed" as const },
  ];

  return (
    <div className='p-6 bg-gray-50 min-h-screen' style={{ marginTop: "1.5em" }}>
      {" "}
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Kanban Board</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
          >
            + Add Task
          </button>
        </div>

        {showAddForm && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
              <h2 className='text-xl font-bold mb-4'>Add New Task</h2>
              <form onSubmit={handleAddTask} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Project Name
                  </label>
                  <input
                    type='text'
                    required
                    value={newTask.projectName}
                    onChange={(e) =>
                      setNewTask({ ...newTask, projectName: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter project name'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Task Name
                  </label>
                  <input
                    type='text'
                    required
                    value={newTask.taskName}
                    onChange={(e) =>
                      setNewTask({ ...newTask, taskName: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter task name'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter task description'
                    rows={3}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority: e.target.value as Task["priority"],
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='low'>Low</option>
                    <option value='medium'>Medium</option>
                    <option value='high'>High</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Due Date
                  </label>
                  <input
                    type='date'
                    required
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div className='flex gap-3 pt-4'>
                  <button
                    type='submit'
                    className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors'
                  >
                    Add Task
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowAddForm(false)}
                    className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {columns.map((column) => (
            <div
              key={column.id}
              className='bg-white rounded-lg shadow-sm border'
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className='p-4 border-b'>
                <h2 className='font-semibold text-lg text-gray-800'>
                  {column.title}
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  {getTasksByStatus(column.status).length} tasks
                </p>
              </div>

              <div className='p-4 space-y-3 min-h-[400px]'>
                {getTasksByStatus(column.status).map((task) => (
                  <Card
                    key={task.id}
                    className='cursor-move hover:shadow-md transition-shadow'
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <CardHeader className='pb-2'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <p className='text-xs font-medium text-blue-600 mb-1'>
                            {task.projectName}
                          </p>
                          <CardTitle className='text-sm font-medium text-gray-900'>
                            {task.taskName}
                          </CardTitle>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        />
                      </div>
                    </CardHeader>

                    <CardContent className='pt-0'>
                      {task.description && (
                        <p className='text-xs text-gray-600 mb-3 line-clamp-2'>
                          {task.description}
                        </p>
                      )}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center text-xs text-gray-500'>
                          <Calendar className='w-3 h-3 mr-1' />
                          {formatDate(task.dueDate)}
                        </div>
                        <Badge
                          variant={getPriorityBadgeVariant(task.priority)}
                          className='text-xs'
                        >
                          <Flag className='w-3 h-3 mr-1' />
                          {task.priority}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {getTasksByStatus(column.status).length === 0 && (
                  <div className='text-center py-8 text-gray-400'>
                    <p className='text-sm'>No tasks yet</p>
                    <p className='text-xs mt-1'>Drag tasks here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
