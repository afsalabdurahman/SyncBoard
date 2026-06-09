import { useEffect, useState } from "react";
import { Button } from "../../Custom/ui/button";
import { ConfirmDialog } from "../../Custom/ui/DeleteAlertButton";
import {TablePagination} from"@mui/material"
import { AppDispatch } from "../../Redux/store";
import CommentBox from "../../Custom/ui/CommentBox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Custom/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../Custom/ui/table";
import { Badge } from "../../Custom/ui/badge";
import { TaskModal } from "./TaskModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Custom/ui/select";
import { Edit, Trash2, Plus, Calendar,MessageCircle } from "lucide-react";
import { setTaskPage } from "../../Redux/feature/task/taskSlice";
import { useDispatch, useSelector } from "react-redux";
  import { addTaskApi, deleteTaskApi, fetchTaskData, updateTaskApi } from "../../Redux/feature/task/taskThunks";
import { usePaginationTask, useTasks } from "../hooks/taskhooks";
import { useProjects } from "../hooks/projectshooks";
import { toast } from "react-toastify";
import ProjectLoader from "../../Custom/reusecomponents/ProjectLoader";
import { useWorkspaceid } from "../../Worksapce/hooks/workspacehooks";
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



export function TasksPage() {

   const {page,rowPerPage,totalItems} = usePaginationTask()
     const [openCommentId, setOpenCommentId] = useState<string | null>(null);
    const toggleComment = (taskId: string) => {
    setOpenCommentId((prev) => (prev === taskId ? null : taskId));
  };
  const closeComment=()=>{
    setOpenCommentId(null)
  }

 
 

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string>("");
  const workspaceid = useWorkspaceid()
  const [loader, setLoader] = useState("");
const dispatch: AppDispatch = useDispatch();
 const projectID=useSelector((state)=>state.switch.projectId);
const tasks = useTasks()
useEffect(()=>{
dispatch(fetchTaskData({workspaceid,page,limit:rowPerPage,projectId:projectID}))
},[dispatch,rowPerPage,page,workspaceid,projectID])


const handleChangePage = (event, newPage) => {
   dispatch(setTaskPage(newPage + 1));
  dispatch(fetchTaskData({ page: newPage + 1, limit: rowPerPage }));
  };
 
  const projects = useProjects()
  ;

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  const handleAddTask = async (taskData: Omit<Task, "id">) => {
   
 try {
 
 setLoader("Creating new task ...");

    const newTask = {
      ...taskData,
      id: Math.max(...tasks.map((t) => t.id)) + 1,
    };
    
   await dispatch(addTaskApi(newTask)).unwrap()

//  dispatch(fetchTaskData({page,limit:rowPerPage}))
 await dispatch(fetchTaskData({workspaceid,  page,limit:rowPerPage}))

      toast.success("Created task successfully 🎉");
 
      setLoader("");
setIsModalOpen(false);

  }catch (error) {
    setLoader("");

   const message=error.message
    toast.error(message)
 }

};
  const handleEditTask = async (taskData) => {
   
    
  try {
    
   await  dispatch(updateTaskApi(taskData)).unwrap()
 await dispatch(fetchTaskData({workspaceid,page,limit:rowPerPage}))
 
      toast.success("Updated task successfully 🎉");
 
      setLoader("");
setIsModalOpen(false);
  } catch (error) {
    const message=error.message
    toast.error(message)
  }
  
  };

  const handleDeleteTask = (id: string) => {
    setIsDialogOpen(true);
    setDeleteTaskId(id);
  };
  const handleConfirmDelete = async () => {
  
    await dispatch(deleteTaskApi(deleteTaskId)).unwrap()
    await dispatch(fetchTaskData({workspaceid,page,limit:rowPerPage}))
    toast.success("Task is deleted")
  };

  const openAddModal = () => {
    if(projects.length==0){
      toast.info("Project is not found");
      return false
    }
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
if (loader) {
    return <ProjectLoader title={loader} />;
  }
  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
     {tasks.length==0?
     
    <div className="flex items-center justify-center h-[60vh] bg-gray-50 border border-dashed border-gray-200 rounded-xl">
  
  <div className="text-center max-w-md px-6">
    
    {/* Icon */}
    <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-white border border-gray-200 shadow-sm">
      <svg
        className="w-10 h-10 text-indigo-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" />
      </svg>
    </div>

    {/* Title */}
    <h2 className="mt-5 text-xl font-semibold text-gray-900">
      No tasks yet
    </h2>

    {/* Description */}
    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
      Break your project into actionable tasks. Assign work, track progress, and stay organized.
    </p>

    {/* CTA */}
    <div className="mt-6 flex items-center justify-center gap-3">
      
      {/* Primary */}
      <button
       onClick={openAddModal}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Create Task
      </button>

      {/* Secondary */}
      <button className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
        View guide
      </button>

    </div>

    {/* Hint */}
    <p className="mt-6 text-xs text-gray-400">
      Tip: Start with a simple task like “Design login page”
    </p>

  </div>
</div>:
    
 <div className="Wrap">
   
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
                        // isOpen={openCommentId === task.id}
                          onClick={() => toggleComment(task._id)}
                      >
                        <MessageCircle className='h-4 w-4' />
                      </Button>
                  
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
     <TablePagination
            
             component="div"
             count={totalItems}
             rowsPerPage={rowPerPage||0}
             page={page-1}
             onPageChange={handleChangePage}
             
              rowsPerPageOptions={[]}
              
           />
            {openCommentId  && (
                                   <CommentBox
                                     isOpen={true}
                                      onClose={closeComment}
                                     taskId={openCommentId}
                                   />
                                 )}
    </div>}
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