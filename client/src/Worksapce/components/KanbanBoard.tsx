import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../Custom/ui/card";
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

interface Attachment {
  id: string;
  file: File;
  type: "image" | "pdf" | "doc" | "other";
  preview?: string;
}

interface Comment {
  id: number;
  name: string;
  text: string;
  timestamp: Date;
  attachments: Attachment[];
}

interface Task {
  id: string;
  projectName: string;
  taskName: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "progress" | "completed";
  approvalStatus: any;
  rejectionMsg: string | null;
  comments: Comment[];
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [popup, setPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await apiService.get(`task/mytask/${user.name}`);
        const mappedTasks: Task[] = res.data.map((data: any) => ({
          id: data._id.toString(),
          projectName: data.project || "Abcd",
          taskName: data.name || "Untitled Task",
          description: data.description || "No description provided.",
          dueDate: data.dueDate || "2024-01-20",
          approvalStatus: data.approvalStatus,
          rejectionMsg: data.rejectionMsg,
          priority: (data.priority?.toLowerCase?.() || "medium") as Task["priority"],
          status: (() => {
            const s = data.status;
            if (s === "To Do") return "todo";
            if (s === "In Progress") return "progress";
            if (s === "Completed") return "completed";
            return "todo";
          })() as Task["status"],
          comments: [],
        }));
        setTasks(mappedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    if (user?.name) fetchTasks();
  }, [user?.name]);

  const toggleComment = (taskId: string) => {
    setOpenCommentId((prev) => (prev === taskId ? null : taskId));
  };

  const closeComment = () => setOpenCommentId(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
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

  const handleDrop = async (e: React.DragEvent, newStatus: Task["status"]) => {
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
      console.error("Failed to update task status:", error);
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

  const getTasksByStatus = (status: Task["status"]) =>
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
    <div className="p-6 bg-gray-50 min-h-screen" style={{ marginTop: "1.5em" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-white rounded-lg shadow-sm border"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg text-gray-800">{column.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {getTasksByStatus(column.status).length} tasks
                </p>
              </div>

              <div className="p-4 space-y-4 min-h-[500px]">
                {getTasksByStatus(column.status).map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-blue-600 mb-1">
                            {task.projectName}
                          </p>
                          <CardTitle className="text-sm font-medium text-gray-900">
                            {task.taskName}
                          </CardTitle>
                        </div>
                        {task.status === "completed" ? (
                          <Lock color="red" size={16} />
                        ) : (
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-3 space-y-3">
                      {task.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Date + Priority */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {formatDate(task.dueDate)}
                        </div>
                        <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">
                          <Flag className="w-3 h-3 mr-1" />
                          {task.priority}
                        </Badge>
                      </div>

                      {/* Bottom bar: Comment + Status */}
                      <div className="flex items-center justify-between gap-3 mt-2 min-h-[44px]">
                        {/* Left: Comment button */}
                        <CommentButton
                          isOpen={openCommentId === task.id}
                          onClick={() => toggleComment(task.id)}
                        />

                        {/* Right: Status indicators */}
                        <div className="flex items-center gap-3">
                          {task.status === "completed" && (
                            <Badge variant="secondary" className="text-xs px-3 py-1">
                              Waiting for approval…
                            </Badge>
                          )}

                          {task.rejectionMsg && task.approvalStatus === "Rejected" && (
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive" className="text-xs px-2 py-0.5">
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
                      </div>

                      {/* Comment Box (only for the active task) */}
                      {openCommentId === task.id && (
                        <CommentBox
                          isOpen={true}
                          onClose={closeComment}
                          taskId={openCommentId}
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}

                {getTasksByStatus(column.status).length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-sm">No tasks yet</p>
                    <p className="text-xs mt-1">Drag tasks here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Global popups */}
        {popup && <SimpleAlert message={message} onclose={() => setPopup(false)} />}
      </div>
    </div>
  );
}