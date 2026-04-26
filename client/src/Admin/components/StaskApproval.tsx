import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Clock3,
  MessageSquare,
} from "lucide-react";

export const TaskApprovalSection = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Homepage Final UI",
      user: "Priya Patel",
      status: "pending",
      date: "Today • 10:30 AM",
      reason: "",
    },
    {
      id: 2,
      title: "SEO Meta Tags",
      user: "Marcus Reed",
      status: "pending",
      date: "Today • 09:15 AM",
      reason: "",
    },
  ]);

  const [rejectId, setRejectId] = useState(null);
  const [message, setMessage] = useState("");

  const approveTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: "approved" }
          : task
      )
    );
  };

  const openRejectBox = (id) => {
    setRejectId(id);
    setMessage("");
  };

  const submitReject = () => {
    if (!message.trim()) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === rejectId
          ? {
              ...task,
              status: "rejected",
              reason: message,
            }
          : task
      )
    );

    setRejectId(null);
    setMessage("");
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-[#f7f7f8] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-5">
        <h2 className="text-[16px] font-semibold text-gray-900">
          Task Approval
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Approve or reject submitted tasks
        </p>
      </div>

      {/* List */}
      <div className="p-4 space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900">
                  {task.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Submitted by {task.user}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {task.date}
                </p>

                {task.status === "approved" && (
                  <div className="mt-3 flex items-center gap-2 text-emerald-600 text-sm">
                    <CheckCircle2 size={16} />
                    Approved
                  </div>
                )}

                {task.status === "rejected" && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <XCircle size={16} />
                      Rejected
                    </div>

                    <div className="mt-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare size={14} />
                        Rejection Reason
                      </div>
                      {task.reason}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {task.status === "pending" && (
                  <>
                    <button
                      onClick={() => approveTask(task.id)}
                      className="rounded-xl bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-600"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => openRejectBox(task.id)}
                      className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}

                {task.status !== "pending" && (
                  <button className="rounded-xl border border-gray-200 p-2 hover:bg-gray-50">
                    <Eye size={16} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Reject Input */}
            {rejectId === task.id && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  placeholder="Enter rejection reason..."
                  className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none"
                />

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setRejectId(null)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={submitReject}
                    className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                  >
                    Submit Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

