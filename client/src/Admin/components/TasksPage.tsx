import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../Custom/ui/button";
import { ConfirmDialog } from "../../Custom/ui/DeleteAlertButton";
import {TablePagination} from"@mui/material"
import { AppDispatch, RootState } from "../../Redux/store";
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
import { updateTask,setTaskPage } from "../../Redux/feature/task/taskSlice";
import { useDispatch } from "react-redux";
  import { addTaskApi, deleteTaskApi, fetchTaskData, updateTaskApi } from "../../Redux/feature/task/taskThunks";
import { usePaginationTask, useTasks } from "../hooks/taskhooks";
import { useProjects } from "../hooks/projectshooks";
import { useMember } from "../../Member/hooks/memeberhooks";
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

   const {page,rowPerPage,totalItems,totalPage} = usePaginationTask()
     const [openCommentId, setOpenCommentId] = useState<string | null>(null);
    const toggleComment = (taskId: string) => {
    setOpenCommentId((prev) => (prev === taskId ? null : taskId));
  };
  const closeComment=()=>{
    setOpenCommentId(null)
  }

 
  const AdminId = useSelector((state: RootState) => {
    return state?.user?.user?.id;
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string>("");
  const workspaceid = useWorkspaceid()
  const [loader, setLoader] = useState("");
const dispatch: AppDispatch = useDispatch();
useSelector((state)=>{

})
const tasks = useTasks()
useEffect(()=>{
dispatch(fetchTaskData({workspaceid,page,limit:rowPerPage}))
},[dispatch,rowPerPage,page])


const handleChangePage = (event, newPage) => {
   dispatch(setTaskPage(newPage + 1));
  dispatch(fetchTaskData({ page: newPage + 1, limit: rowPerPage }));
  };

 
  const projects = useProjects()
  const users = new Set(
    projects
      .map((user: { id: number; name: string; assignedUsers: string[] }) => {
        return user.assignedUsers.map((name: string) => {
          return name;
        });
      })
      .flat()
  );

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  const handleAddTask = async (taskData: Omit<Task, "id">) => {
   
 try {
  console.log(taskData,"TAskDta")
 

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

   let message=error.message
    toast.error(message)
 }

};
  const handleEditTask = async (taskData) => {
   
    const id = taskData.id;
  try {
    
   await  dispatch(updateTaskApi(taskData)).unwrap()
 await dispatch(fetchTaskData({workspaceid,page,limit:rowPerPage}))
 
      toast.success("Updated task successfully 🎉");
 
      setLoader("");
setIsModalOpen(false);
  } catch (error) {
    let message=error.message
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
    </div>
  );
}
