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

import { fetchTasks, updateTaskCriteria, updateTaskStatus } from "../apis/taskApi";
import { PaginationState, Task } from "../types/taskTypes";

import { useWorkspaceid } from "../../Worksapce/hooks/workspacehooks";
import { TablePagination } from "@mui/material";
import { useSelector } from "react-redux";

interface AcceptanceCriteria {
  id?: string;
  title: string;
  status: "Pending" | "Completed";
}

export const TaskApproval = () => {
  const workspaceid = useWorkspaceid();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const projectID = useSelector(
    (state) => state.switch.projectId
  );

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    rowPerpage: 5,
    totalItems: 0,
    totalPages: 0,
  });

  /* ---------------- LOAD TASKS ---------------- */

 

  useEffect(() => {
     const loadTasks = async (page = pagination.page) => {
    try {
      const res = await fetchTasks(
        workspaceid,
        page,
        pagination.rowPerpage,
        projectID
      );

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
    loadTasks();
  }, [
    pagination.page,
    pagination.rowPerpage,
    projectID,
    workspaceid,
  
  ]);

  /* ---------------- PAGINATION ---------------- */

  const handleChangePage = (
    _: unknown,
    newPage: number
  ) => {
    loadTasks(newPage + 1);
  };

  /* ---------------- APPROVE ---------------- */

  const handleApprove = async (taskId: string) => {
    try {
      await updateTaskStatus(
        taskId,
        "Approved",
        null
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: "approved" }
            : task
        )
      );
    } catch {
      setError("Failed to approve task.");
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
            ? {
                ...task,
                status: "rejected",
                rejectionReason,
              }
            : task
        )
      );

      setRejectDialogOpen(false);
      setSelectedTask(null);
      setRejectionReason("");
    } catch {
      setError("Failed to reject task.");
    }
  };

  /* ---------------- STATUS BADGE ---------------- */

  const getStatusBadge = (
    status: Task["status"]
  ) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-600"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );

      case "approved":
        return (
          <Badge
            variant="outline"
            className="text-green-600 border-green-600"
          >
            <Check className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );

      case "rejected":
        return (
          <Badge
            variant="outline"
            className="text-red-600 border-red-600"
          >
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  /* ---------------- DATE FORMAT ---------------- */

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  /* ---------------- ERROR UI ---------------- */

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-red-600 font-bold">
            {error}
          </h2>
        </div>
      </div>
    );
  }

  /* ---------------- EMPTY UI ---------------- */

  if (!tasks.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 bg-white rounded shadow text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
          <h2 className="text-xl font-bold">
            No Pending Approvals
          </h2>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Task Approval Panel
        </h1>

        <div className="flex gap-4 text-sm">
          <span>
            Pending: {
              tasks.filter(
                (t) => t.status === "pending"
              ).length
            }
          </span>

          <span>
            Approved: {
              tasks.filter(
                (t) => t.status === "approved"
              ).length
            }
          </span>

          <span>
            Rejected: {
              tasks.filter(
                (t) => t.status === "rejected"
              ).length
            }
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => {
          const allCriteriaCompleted =
            task?.acceptanceCriteria?.every(
              (item: AcceptanceCriteria) =>
                item.status === "Completed"
            ) ?? false;

          return (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      {task.taskName}
                    </CardTitle>

                    <div className="text-sm text-gray-500 mt-2 flex gap-4">
                      <span>
                        Project: {task.project}
                      </span>
                      <span>
                        User: {task.username}
                      </span>
                      <span>
                        Submitted:{" "}
                        {formatDate(task.submittedAt)}
                      </span>
                    </div>
                  </div>

                  {getStatusBadge(task.status)}
                </div>
              </CardHeader>

              <CardContent>
                {/* ACCEPTANCE CRITERIA */}
                {task?.acceptanceCriteria?.length > 0 && (
                  <div className="mb-5">
                    <h3 className="font-semibold mb-3">
                      Acceptance Criteria
                    </h3>

                    <div className="space-y-2">
                      {task.acceptanceCriteria.map(
                        (
                          criteria: AcceptanceCriteria
                        ) => (
                          <div
                            key={
                              criteria.id ||
                              criteria.title
                            }
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
                          >
                            <span>
                              {criteria.title}
                            </span>

<button
  disabled={task.status === "approved"}
  onClick={async () => {
    try {
      if (task.status === "approved") return;

      await updateTaskCriteria(task.id, criteria.title);

      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          if (t.id !== task.id) return t;

          return {
            ...t,
            acceptanceCriteria: t.acceptanceCriteria.map(
              (item: AcceptanceCriteria) =>
                item.title === criteria.title
                  ? {
                      ...item,
                      // backend values: Completed / Pending
                      status:
                        item.status === "Completed"
                          ? "Pending"
                          : "Completed",
                    }
                  : item
            ),
          };
        })
      );
    } catch  {
     
      setError("Failed to update acceptance criteria");
    }
  }}
  className={`flex items-center gap-2 ${
    task.status === "approved"
      ? "cursor-not-allowed opacity-50"
      : "cursor-pointer"
  }`}
>
  {criteria.status === "Completed" ? (
    <>
      <Check className="w-5 h-5 text-green-600" />
      <span className="text-green-600 text-sm font-medium">
        Accepted
      </span>
    </>
  ) : (
    <>
      <X className="w-5 h-5 text-red-600" />
      <span className="text-red-600 text-sm font-medium">
        Pending
      </span>
    </>
  )}
</button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* REJECTION REASON */}
                {task.status === "rejected" &&
                  task.rejectionReason && (
                    <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded">
                      <p className="font-medium text-red-700">
                        Rejection Reason:
                      </p>
                      <p className="text-red-600 text-sm">
                        {task.rejectionReason}
                      </p>
                    </div>
                  )}

                {/* ACTION BUTTONS */}
                {task.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      disabled={!allCriteriaCompleted}
                      onClick={() =>
                        handleApprove(
                          task.id
                        )
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleRejectClick(
                          task
                        )
                      }
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

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
      <Dialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject Task
            </DialogTitle>

            <DialogDescription>
              Provide a reason for rejecting "
              {selectedTask?.taskName}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Label>
              Rejection Reason
            </Label>

            <Textarea
              value={rejectionReason}
              onChange={(e) =>
                setRejectionReason(
                  e.target.value
                )
              }
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRejectDialogOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={
                !rejectionReason.trim()
              }
              onClick={
                handleRejectConfirm
              }
            >
              Reject Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};