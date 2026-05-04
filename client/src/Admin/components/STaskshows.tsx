import  { useEffect, useState } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  CalendarDays,
} from "lucide-react";

export const STaskBoard = ({taskList}) => {
  const [activeTab, setActiveTab] = useState("todo");
useEffect(()=>{
  setTasks(taskList)
},[taskList])

  const [tasks, setTasks] = useState([]);

  const filtered = tasks.filter((task) => task.status === activeTab);

  const tabCount = (status) =>
    tasks.filter((task) => task.status === status).length;

  const toggleOpen = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, open: !task.open } : task
      )
    );
  };



  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-[#f7f8fa] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-200">
        <Sparkles size={16} className="text-blue-500" />
        <h2 className="text-lg font-semibold">Tasks</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-5">
        <div className="flex gap-8 text-sm">
          <button
            onClick={() => setActiveTab("todo")}
            className={`py-4 border-b-2 ${
              activeTab === "todo"
                ? "border-blue-500 text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            To Do {tabCount("todo")}
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className={`py-4 border-b-2 ${
              activeTab === "progress"
                ? "border-blue-500 text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            In Progress {tabCount("progress")}
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`py-4 border-b-2 ${
              activeTab === "completed"
                ? "border-blue-500 text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            Completed {tabCount("completed")}
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="p-4 space-y-4">
        {filtered.map((task) => {
          const doneCount = task.subtasks.filter((s) => s.done).length;

          return (
            <div
              key={task.id}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{task.title}</h3>

                    <div className="mt-3 flex gap-3 text-sm text-gray-500 items-center">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {task.priority}
                      </span>

                      <div className="flex items-center gap-1">
                        <CalendarDays size={12} />
                        {task.date}
                      </div>

                      <span>
                        {doneCount}/{task.subtasks.length} subtasks
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-12 rounded-full text-white text-sm flex items-center justify-center ${task.color}`}
                    >
                      {task.userName}
                    </div>

                   

                    <button onClick={() => toggleOpen(task.id)}>
                      {task.open ? (
                        <ChevronUp size={16} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtasks */}
              {task.open && (
                <div className="border-t border-gray-100 bg-[#fafafa] px-4 py-4">
                  <p className="mb-3 text-[11px] uppercase tracking-widest text-gray-400">
                    Subtasks
                  </p>

                  <div className="space-y-3">
                    {task.subtasks.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between"
                      >
                        <label className="flex items-center gap-3 ">
                        

                          <span
                            className={
                              sub.done
                                ? "line-through text-gray-400"
                                : ""
                            }
                          >
                            {sub.title}
                          </span>
                        </label>

                      
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
