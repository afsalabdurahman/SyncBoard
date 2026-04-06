import React, { useState } from 'react';

interface Subtask {
  id: number;
  name: string;
  completed: boolean;
}

interface AssignedUser {
  id: number;
  name: string;
  color: string;
}

export const TaskDetailPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const [task, setTask] = useState({
    name: 'Build Task Management Dashboard',
    description: 'Create a beautiful full-screen task detail modal with Tailwind CSS, real-time progress tracking, and subtask management.',
    dueDate: '2026-04-05',
    priority: 'High' as 'High' | 'Medium' | 'Low',
    status: 'In Progress' as 'To Do' | 'In Progress' | 'Completed',
    assignedUsers: [
      { id: 1, name: 'Afsal', color: 'bg-blue-500' },
      { id: 2, name: 'Priya', color: 'bg-pink-500' },
      { id: 3, name: 'Rahul', color: 'bg-emerald-500' },
    ] as AssignedUser[],
    subtasks: [
      { id: 1, name: 'Design UI Layout', completed: true },
      { id: 2, name: 'Implement React Component', completed: true },
      { id: 3, name: 'Add Tailwind Styling', completed: true },
      { id: 4, name: 'Create Progress Circle', completed: false },
      { id: 5, name: 'Integrate Subtask Toggle', completed: false },
    ] as Subtask[],
  });


  const completedCount = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subProgress = totalSubtasks > 0 ? Math.round((completedCount / totalSubtasks) * 100) : 0;

  const displayProgress =
    task.status === 'Completed'
      ? 100
      : subProgress === 100
      ? 90
      : subProgress;

  // SVG circle values
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * displayProgress) / 100;

  // Toggle subtask completion
  const toggleSubtask = (id: number) => {
    setTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((sub) =>
        sub.id === id ? { ...sub, completed: !sub.completed } : sub
      ),
    }));
  };

  // Update status (To Do | In Progress | Completed)
  const updateStatus = (newStatus: 'To Do' | 'In Progress' | 'Completed') => {
    setTask((prev) => ({ ...prev, status: newStatus }));
  };

  // Update priority
  const updatePriority = (newPriority: 'High' | 'Medium' | 'Low') => {
    setTask((prev) => ({ ...prev, priority: newPriority }));
  };


  const updateField = (field: keyof typeof task, value: any) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const getPriorityColor = (p: string) => {
    if (p === 'High') return 'bg-red-500 text-white';
    if (p === 'Medium') return 'bg-amber-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const getStatusColor = (s: string) => {
    if (s === 'To Do') return 'bg-slate-200 text-slate-700';
    if (s === 'In Progress') return 'bg-blue-100 text-blue-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-lg font-medium"
      >
        Open Task Popup Demo
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col">

      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
          <h1 className="text-2xl font-semibold text-zinc-900 truncate max-w-md">
            {task.name}
          </h1>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 rounded-2xl transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white p-6 md:p-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
    
          <div className="lg:col-span-7 space-y-10">

            <div>
              <p className="text-sm font-medium text-zinc-500 mb-3">STATUS</p>
              <div className="flex flex-wrap gap-3">
                {(['To Do', 'In Progress', 'Completed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={`px-6 py-3 rounded-3xl text-sm font-semibold transition-all ${
                      task.status === s
                        ? 'bg-zinc-900 text-white shadow-lg scale-105'
                        : `${getStatusColor(s)} hover:bg-zinc-100`
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

 
            <div>
              <p className="text-sm font-medium text-zinc-500 mb-3">PRIORITY</p>
              <div className="flex gap-3">
                {(['High', 'Medium', 'Low'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => updatePriority(p)}
                    className={`px-8 py-3 rounded-3xl text-sm font-semibold transition-all ${
                      task.priority === p
                        ? `${getPriorityColor(p)} shadow-lg scale-105`
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <p className="text-sm font-medium text-zinc-500 mb-2">DUE DATE</p>
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
                className="bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-blue-500 w-full md:w-80"
              />
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-medium text-zinc-500 mb-2">DESCRIPTION</p>
              <textarea
                value={task.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={6}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-3xl px-6 py-5 text-lg resize-y focus:outline-none focus:border-blue-500"
              />
            </div>


            <div>
              <p className="text-sm font-medium text-zinc-500 mb-4">ASSIGNED TO</p>
              <div className="flex -space-x-4">
                {task.assignedUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className={`w-12 h-12 ${user.color} text-white text-xl font-semibold flex items-center justify-center border-4 border-white rounded-2xl shadow-md ring-2 ring-white`}
                    title={user.name}
                  >
                    {user.name[0]}
                  </div>
                ))}
                <button className="w-12 h-12 bg-zinc-100 border-4 border-white text-zinc-400 flex items-center justify-center rounded-2xl hover:bg-zinc-200 transition-colors">
                  +
                </button>
              </div>
            </div>
          </div>

 
          <div className="lg:col-span-5 space-y-10">

            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-zinc-500 mb-4 text-center">
                TASK PROGRESS
              </p>

              <div className="relative w-48 h-48">
      
                <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
   
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    fill="none"
                    stroke={displayProgress === 100 ? '#10b981' : '#3b82f6'}
                    strokeWidth="14"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                  />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-bold text-zinc-900">
                    {displayProgress}
                  </span>
                  <span className="text-xl -mt-1 text-zinc-400">%</span>

                  {displayProgress === 100 && (
                    <div className="mt-1 text-emerald-600 text-sm font-medium flex items-center gap-1">
                      ✓ COMPLETE
                    </div>
                  )}
                  {displayProgress === 90 && (
                    <div className="mt-1 text-amber-600 text-sm font-medium">Subtasks Done</div>
                  )}
                </div>
              </div>

              <div className="mt-6 text-xs text-zinc-500 text-center max-w-[220px]">
                {subProgress === 100
                  ? 'All subtasks completed → 90% (mark as Completed for 100%)'
                  : `${completedCount} of ${totalSubtasks} subtasks done`}
              </div>
            </div>

            {/* Subtasks List */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-medium text-zinc-500">SUBTASKS</p>
                <div className="text-xs bg-zinc-100 px-3 py-1 rounded-2xl text-zinc-500">
                  {completedCount}/{totalSubtasks}
                </div>
              </div>

              <div className="space-y-3">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    onClick={() => toggleSubtask(subtask.id)}
                    className="group flex items-center gap-4 bg-zinc-50 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 px-6 py-5 rounded-3xl cursor-pointer transition-all"
                  >
                    <div
                      className={`w-7 h-7 flex items-center justify-center rounded-2xl border-2 transition-all ${
                        subtask.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-zinc-300 group-hover:border-zinc-400'
                      }`}
                    >
                      {subtask.completed && (
                        <span className="text-white text-xl leading-none">✓</span>
                      )}
                    </div>

                    <span
                      className={`flex-1 text-lg ${
                        subtask.completed
                          ? 'line-through text-zinc-400'
                          : 'text-zinc-800'
                      }`}
                    >
                      {subtask.name}
                    </span>

                    <span
                      className={`text-xs font-medium px-4 py-1 rounded-2xl ${
                        subtask.completed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {subtask.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar (optional) */}
      <div className="bg-white border-t border-zinc-200 px-6 py-5 flex justify-end">
        <button
          onClick={() => setIsOpen(false)}
          className="px-8 py-4 bg-zinc-900 hover:bg-black text-white font-semibold rounded-3xl transition-colors flex items-center gap-2"
        >
          Close Popup
        </button>
      </div>
    </div>
  );
};

export default TaskDetailPopup;