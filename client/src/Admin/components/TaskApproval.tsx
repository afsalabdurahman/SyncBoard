import { useEffect, useState } from "react";
import { Button } from "../../Custom/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../Custom/ui/card";
import { Badge } from "../../Custom/ui/badge";
import { Textarea } from "../../Custom/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../Custom/ui/dialog";
import { Label } from "../../Custom/ui/label";
import { Check, X, Clock, CheckCircle } from "lucide-react";

import { fetchTasks, updateTaskStatus } from "../apis/taskApi";
import { PaginationState, Task } from "../types/taskTypes";

import { useWorkspaceid } from "../../Worksapce/hooks/workspacehooks";
import { TablePagination } from "@mui/material";
import {  useSelector } from "react-redux";



export const TaskApproval = () => {
  const workspaceid = useWorkspaceid();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const projectID=useSelector((state)=>state.switch.projectId);

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    rowPerpage: 5,
    totalItems: 0,
    totalPages: 0,
  });

  /* ---------------- LOAD TASKS ---------------- */

 




useEffect(()=>{

 const loadTasks = async (page = pagination.page) => {
    try {
      const res = await fetchTasks(workspaceid, page, pagination.rowPerpage,projectID);

      setTasks(res.items);

      setPagination((prev) => ({
        ...prev,
        page: res.currentPage,
        totalItems: res.totalItems,
        totalPages: res.totalPages,
      }));

      setError(null);
    } catch {
      setError("Failed to load tasks. Please try again later.");
    }
  };
  loadTasks()


},[pagination.page, pagination.rowPerpage, projectID, workspaceid])


  /* ---------------- PAGINATION ---------------- */

  const handleChangePage = (_: unknown, newPage: number) => {
    loadTasks(newPage + 1);
  };

  /* ---------------- APPROVE ---------------- */

  const handleApprove = async (taskId: string) => {
    try {
      await updateTaskStatus(taskId, "Approved", null);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: "approved" } : task
        )
      );
    } catch {
      setError("Failed to approve task. Please try again.");
    }
  };

  /* ---------------- REJECT ---------------- */

  const handleRejectClick = (task: Task) => {
    setSelectedTask(task);
    setRejectDialogOpen(true);
    setRejectionReason("");
  };

  const handleRejectConfirm = async () => {
    if (!selectedTask) return;

    try {
      await updateTaskStatus(
        selectedTask.id,
        "Rejected",
        rejectionReason
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === selectedTask.id
            ? { ...task, status: "rejected", rejectionReason }
            : task
        )
      );

      setRejectDialogOpen(false);
      setSelectedTask(null);
      setRejectionReason("");
    } catch {
      setError("Failed to reject task. Please try again.");
    }
  };

  /* ---------------- STATUS BADGE ---------------- */

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );

      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Check className="w-3 h-3 mr-1" /> Approved
          </Badge>
        );

      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <X className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
    }
  };

  /* ---------------- DATE FORMAT ---------------- */

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ---------------- ERROR UI ---------------- */

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow">
          <h1 className="mb-3 text-2xl font-bold text-red-800">Error</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  /* ---------------- EMPTY STATE ---------------- */

  if (!tasks.length) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow">
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />

          <h1 className="mb-3 text-2xl font-bold text-gray-800">
            All Clear!
          </h1>

          <p className="mb-6 text-gray-600">
            There are no pending task approvals at this time.
          </p>

          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <p className="text-sm text-green-800">
              You're up to date with all approvals.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <div className="container p-6 mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Task Approval Panel</h1>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Pending: {tasks.filter(t => t.status === "pending").length}</span>
          <span>Approved: {tasks.filter(t => t.status === "approved").length}</span>
          <span>Rejected: {tasks.filter(t => t.status === "rejected").length}</span>
        </div>
      </div>

      <div className="grid gap-4">

        {tasks.map((task) => (
          <Card key={task.id}>

            <CardHeader className="pb-3">

              <div className="flex items-start justify-between">

                <div className="space-y-1">

                  <CardTitle className="text-lg">
                    {task.taskName}
                  </CardTitle>

                  <div className="flex gap-4 text-sm text-muted-foreground">

                    <span><strong>Project:</strong> {task.project}</span>
                    <span><strong>User:</strong> {task.username}</span>
                    <span><strong>Submitted:</strong> {formatDate(task.submittedAt)}</span>

                  </div>

                </div>

                {getStatusBadge(task.status)}

              </div>

            </CardHeader>

            <CardContent>

              {task.status === "rejected" && task.rejectionReason && (
                <div className="p-3 mb-4 border border-red-200 rounded-md bg-red-50">
                  <p className="mb-1 text-sm font-medium text-red-800">
                    Rejection Reason:
                  </p>

                  <p className="text-sm text-red-700">
                    {task.rejectionReason}
                  </p>
                </div>
              )}

              {task.status === "pending" && (
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
          rowsPerPage={pagination.rowPerpage}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
        />

      </div>

      {/* REJECT DIALOG */}

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>

          <DialogHeader>
            <DialogTitle>Reject Task</DialogTitle>

            <DialogDescription>
              Provide a reason for rejecting "{selectedTask?.taskName}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">

            <Label>Rejection Reason</Label>

            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={!rejectionReason.trim()}
              onClick={handleRejectConfirm}
            >
              Reject Task
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  );
};