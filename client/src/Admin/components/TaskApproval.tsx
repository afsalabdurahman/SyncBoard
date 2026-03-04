import { useEffect, useState } from "react";
import { Button } from "../../Custom/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../Custom/ui/card";
import { Badge } from "../../Custom/ui/badge";
import { Textarea } from "../../Custom/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../Custom/ui/dialog";
import { Label } from "../../Custom/ui/label";
import { Check, X, Clock, CheckCircle } from 'lucide-react';
import {  fetchTasks,updateTaskStatus } from "../apis/taskApi";
import { Task } from "../types/taskTypes";
import { useWorkspaceid } from "../../Worksapce/hooks/workspacehooks";
import { TablePagination } from "@mui/material";
import { previousDay } from "date-fns";


interface TaskApprovalProps {}

export const TaskApproval: React.FC<TaskApprovalProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string | null>(null);
const workspaceid = useWorkspaceid();
const [pagination,setPagination]=useState({
  page:1, //currenytpage
  rowPerpage:5,
  totalItems:0,
  totalPages:0

})
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks(workspaceid,pagination.page,pagination.rowPerpage);
        setTasks(fetchedTasks.items);
        setPagination((prev) => ({
  ...prev,
  page:fetchedTasks.currentPage,
  totalItems: fetchedTasks.totalItems,
  totalPages: fetchedTasks.totalPages
}));
        setError(null);
      } catch (err) {
        setError("Failed to load tasks. Please try again later.");
       
      }
    };
    loadTasks();
  }, [refreshKey]);
console.log(tasks,"taskkk")
const handleChangePage = async(event,newPage) =>{
  const fetchedTasks=await fetchTasks(workspaceid,newPage+1,pagination.rowPerpage)
     setTasks(fetchedTasks.items);
        setPagination((prev) => ({
  ...prev,
  page:fetchedTasks.currentPage,
  totalItems: fetchedTasks.totalItems,
  totalPages: fetchedTasks.totalPages
}));

}
  const handleApprove = async (taskId: string) => {
    try {
      await updateTaskStatus(taskId, "Approved", null);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: 'approved' } : task
      ));
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setError("Failed to approve task. Please try again.");
     
    }
  };

  const handleRejectClick = (task: Task) => {
    setSelectedTask(task);
    setRejectDialogOpen(true);
    setRejectionReason("");
  };

  const handleRejectConfirm = async () => {
    if (!selectedTask) return;
    try {
      await updateTaskStatus(selectedTask.id, "Rejected", rejectionReason);
      setTasks(tasks.map(task =>
        task.id === selectedTask.id ? { ...task, status: 'rejected', rejectionReason } : task
      ));
      setRejectDialogOpen(false);
      setSelectedTask(null);
      setRejectionReason("");
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setError("Failed to reject task. Please try again.");

    }
  };

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Check className="w-3 h-3 mr-1" /> Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <X className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-3">Error</h1>
          <p className="text-red-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">All Clear!</h1>
          <p className="text-gray-600 mb-6">There are no pending task approvals at this time.</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              You're up to date with all your approvals. Check back later for new items.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Task Approval Panel</h1>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Pending: {tasks.filter(t => t.status === 'pending').length}</span>
          <span>Approved: {tasks.filter(t => t.status === 'approved').length}</span>
          <span>Rejected: {tasks.filter(t => t.status === 'rejected').length}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{task.taskName}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span><strong>Project:</strong> {task.project}</span>
                    <span><strong>User:</strong> {task.username}</span>
                    <span><strong>Submitted:</strong> {formatDate(task.submittedAt)}</span>
                  </div>
                </div>
                {getStatusBadge(task.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {task.status === 'rejected' && task.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{task.rejectionReason}</p>
                </div>
              )}
              {task.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(task.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRejectClick(task)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
               
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        <TablePagination
         component="div"
       count={pagination.totalItems} 
        rowsPerPage={pagination.rowPerpage||0}
       page={pagination.page-1}
          onPageChange={handleChangePage}
           
        rowsPerPageOptions={[]}
    
       
         
      />
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Task</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedTask?.taskName}". This will help the user understand what needs to be improved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim()}
            >
              Reject Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

