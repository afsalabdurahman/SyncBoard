import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,

} from "../../Custom/ui/card";
import { TaskDetails } from "./TaskDetails";
import { Badge } from "../../Custom/ui/badge";
import CommentButton from "../../Custom/ui/CommentButton";
import {
  Calendar,
  Flag,
  Lock,
  MessageSquareMoreIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import apiService from "../../Services/apiServices/apiService";
import SimpleAlert from "../../Custom/ui/alertBox";
import CommentBox from "../../Custom/ui/CommentBox";
import { AttachmentButton } from "../../Admin/components/AttachmentButton";
import { socket } from "../../Services/socket";
import { RootState } from "../../Redux/store";
import { SubtaskButton } from "../components/Subtask"
import { SubtaskPage } from "../pages/SubtaskPage";
import { toast } from "react-toastify";
import { KanbanApiTask, KanbanTask } from "../types/workspaceTypes"
import { catchErrorHandle } from "../../Utility/catchErrorHandle";






export default function KanbanBoard() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [popup, setPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null);
  // const [notify,setNotify]=useState(false)
  const [notifyTaskIds, setNotifyTaskIds] = useState<string[]>([]);
  const [isOpensub, setOpensub] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user);
  // const areAllSubtasksCompleted = (task: KanbanTask): boolean => {
  //   if (!task.subTask || task.subTask.length === 0) return true;
  //   return task.subTask.every((sub) => sub.status === "Completed");
  // };
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await apiService.get(`task/mytask/${user.name}`);
        const mappedTasks: KanbanTask[] = res.data.map((data: KanbanApiTask) => ({
          id: data._id.toString(),
          projectName: data.project || "Abcd",
          taskName: data.name || "Untitled Task",
          description: data.description || "No description provided.",
          dueDate: data.dueDate || "2024-01-20",
          approvalStatus: data.approvalStatus,
          rejectionMsg: data.rejectionMsg,
          subTask: data.subTask,
          priority: (data.priority?.toLowerCase?.() || "medium") as KanbanTask["priority"],
          status: (() => {
            const s = data.status;
            if (s === "To Do") return "todo";
            if (s === "In Progress") return "progress";
            if (s === "Completed") return "completed";
            return "todo";
          })() as KanbanTask["status"],
          comments: [],
          attachments: data.attachedURLs
        }));
        setTasks(mappedTasks);
      } catch {
        toast.error("Failed to fetch tasks:",);
      }
    };

    if (user?.name) fetchTasks();
  }, [user?.name, openCommentId, isOpensub]);

  const toggleComment = (taskId: string) => {
    setOpenCommentId((prev) => (prev === taskId ? null : taskId));
    setNotifyTaskIds((prev) =>
      prev.filter((id) => id !== taskId)
    );
  };


  useEffect(() => {
    if (!tasks.length) return;

    // Join all task rooms
    tasks.forEach((task) => {
      socket.emit("task-join-comment", task.id);
    });

    const handleNotification = (data: { taskId: string }) => {
      setNotifyTaskIds((prev) =>
        prev.includes(data.taskId)
          ? prev
          : [...prev, data.taskId]
      );
    };

    socket.on("comment-notification", handleNotification);

    return () => {
      socket.off("comment-notification", handleNotification);
    };
  }, [tasks]);
  const closeComment = () => setOpenCommentId(null);

  const handleDragStart = (e: React.DragEvent, task: KanbanTask) => {
    if (task.status === "completed") {
      e.preventDefault();
      return;
    }
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    document.body.classList.add("dragging-active");
  };

  const handleDragEnd = () => {
    document.body.classList.remove("dragging-active");
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: KanbanTask["status"]) => {

    if (newStatus == "completed") {
      const isFound = draggedTask?.subTask?.filter((task) => {
        return task.status !== "Completed"
      })
      if (isFound.length > 0) {
        toast.info("Complete all subtask then move")
        return false
      }
    }

    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === draggedTask.id ? { ...t, status: newStatus } : t))
    );

    const apiStatus =
      newStatus === "progress" ? "In Progress" :
        newStatus === "completed" ? "Completed" :
          "To Do";

    try {
      await apiService.patch(`task/status/${draggedTask.id}`, { status: apiStatus });
    } catch (error) {
      const err = catchErrorHandle(error, "Failed to drag");
      throw new Error(err)
    }

    setDraggedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityBadgeVariant = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getTasksByStatus = (status: KanbanTask["status"]) =>
    tasks.filter((task) => task.status === status);

  const showRejectionPopup = (msg: string) => {
    setMessage(msg);
    setPopup(true);
  };

  const columns = [
    { id: "todo", title: "To Do", status: "todo" as const },
    { id: "progress", title: "In Progress", status: "progress" as const },
    { id: "completed", title: "Completed", status: "completed" as const },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 mt-[1em]">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-white rounded-lg shadow-sm border flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              {/* Column Header */}
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg text-gray-800">{column.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {getTasksByStatus(column.status).length} tasks
                </p>
              </div>

              {/* Scrollable Tasks Area */}
              <div className="p-4 flex-1 overflow-y-auto min-h-[500px]">
                <div className="space-y-4">
                  {getTasksByStatus(column.status).map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-move hover:shadow-md transition-shadow bg-white border"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-blue-600 mb-1 truncate">
                              {task.projectName}
                            </p>
                            <CardTitle className="text-sm font-medium text-gray-900 line-clamp-2">
                              {task.taskName}
                            </CardTitle>
                          </div>

                          {task.status === "completed" ? (
                            <Lock className="text-red-500 flex-shrink-0" size={16} />
                          ) : (
                            <div
                              className={`w-3 h-3 rounded-full flex-shrink-0 ${getPriorityColor(
                                task.priority
                              )}`}
                            />
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="pt-2 space-y-4">
                        {/* Description */}
                        {task.description && (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {task.description.slice(0, 50) + "..."}
                            <TaskDetails taskId={task.id} />
                          </p>

                        )}

                        {/* Attachments */}
                        <AttachmentButton taskId={task.id} attachedUrl={task.attachments} />

                        {/* Date & Priority Row */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{formatDate(task.dueDate)}</span>
                          </div>
                          <Badge
                            variant={getPriorityBadgeVariant(task.priority)}
                            className="text-xs"
                          >
                            <Flag className="w-3 h-3 mr-1" />
                            {task.priority}
                          </Badge>
                        </div>

                        {/* Bottom Bar: Comments + Status */}
                        <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
                          <CommentButton
                            isOpen={openCommentId === task.id}
                            onClick={() => toggleComment(task.id)}
                            notify={notifyTaskIds.includes(task.id)}
                          />

                          <div className="flex items-center gap-3 flex-wrap justify-end">
                            {task.status === "completed" && (
                              <Badge variant="secondary" className="text-xs">
                                Waiting for approval…
                              </Badge>
                            )}

                            {task.rejectionMsg && task.approvalStatus === "Rejected" && (
                              <div className="flex items-center gap-2">
                                <Badge variant="destructive" className="text-xs">
                                  Rejected
                                </Badge>
                                <button
                                  type="button"
                                  onClick={() => showRejectionPopup(task.rejectionMsg!)}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                  title="View rejection reason"
                                >
                                  <MessageSquareMoreIcon size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                          <SubtaskPage
                            isOpensub={isOpensub}
                            setOpensub={setOpensub}
                            completed={task.subTask?.filter((s) => s.status === "Completed").length}
                            total={task.subTask?.length}
                            taskId={task.id}
                          />                      </div>

                        {/* Comment Box - appears below content when open */}
                        {openCommentId === task.id && (
                          <div className="mt-4 -mx-4 px-4 pb-4 border-t border-gray-100">
                            <CommentBox
                              isOpen={true}
                              onClose={closeComment}
                              taskId={openCommentId}
                            />
                          </div>
                        )}

                        {isOpensub === task.id && (
                          <div className="mt-4 -mx-4 px-4 pb-4 border-t border-gray-100">
                            <SubtaskButton setOpensub={setOpensub} task={task} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {/* Empty State */}
                  {getTasksByStatus(column.status).length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-sm">No tasks yet</p>
                      <p className="text-xs mt-1">Drag tasks here</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
        {/* {isOpensub==tasks.id
    <div className="mt-4 -mx-4 px-4 pb-4 border-t border-gray-100">

    <SubtaskButton setOpensub={setOpensub}/>
    </div>
    :""} */}
        {/* Global Popup */}
        {popup && <SimpleAlert message={message} onclose={() => setPopup(false)} />}
      </div>
    </div>
  );
}