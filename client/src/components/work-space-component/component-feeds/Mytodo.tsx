import React, { useState } from "react";
import {
  PlusCircle,
  X,
  Upload,
  Paperclip,
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import KanbanBoard from "./KanbanBoard";

const columnDefinitions = [
  {
    id: "To Do",
    title: "To Do",
    headerColor: "bg-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    hoverColor: "bg-indigo-100",
    icon: <PlusCircle size={18} className='text-indigo-600' />,
  },
  {
    id: "Working",
    title: "Working",
    headerColor: "bg-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    hoverColor: "bg-amber-100",
    icon: <Calendar size={18} className='text-amber-500' />,
  },
  {
    id: "In Progress",
    title: "In Progress",
    headerColor: "bg-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "bg-blue-100",
    icon: <Upload size={18} className='text-blue-600' />,
  },
  {
    id: "Completed",
    title: "Completed",
    headerColor: "bg-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    hoverColor: "bg-emerald-100",
    icon: <CheckCircle size={18} className='text-emerald-600' />,
  },
];

export default function Mytodo() {
  return(<KanbanBoard/>)
  const [tasks, setTasks] = useState({
    "To Do": [],
    Working: [],
    "In Progress": [],
    Completed: [],
  });

  const [newTask, setNewTask] = useState({
    title: "",
    file: null,
    image: null,
  });
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = () => {
    if (!newTask.title) return;

    const task = {
      id: `${Date.now()}`,
      title: newTask.title,
      file: newTask.file,
      image: newTask.image ? URL.createObjectURL(newTask.image) : null,
      createdAt: new Date().toLocaleDateString(),
    };

    setTasks((prev) => ({
      ...prev,
      "To Do": [...prev["To Do"], task],
    }));

    setNewTask({ title: "", file: null, image: null });
    setShowForm(false);
  };

  const moveTask = (taskId, fromColumn, direction) => {
    const colIndex = columnDefinitions.findIndex(
      (col) => col.id === fromColumn
    );
    const newIndex = direction === "left" ? colIndex - 1 : colIndex + 1;
    if (newIndex < 0 || newIndex >= columnDefinitions.length) return;

    const toColumn = columnDefinitions[newIndex].id;
    const updatedFrom = [...tasks[fromColumn]];
    const taskToMove = updatedFrom.find((task) => task.id === taskId);
    const updatedTo = [...tasks[toColumn], taskToMove];

    setTasks({
      ...tasks,
      [fromColumn]: updatedFrom.filter((task) => task.id !== taskId),
      [toColumn]: updatedTo,
    });
  };

  const getColumnStyle = (columnId) => {
    const column = columnDefinitions.find((col) => col.id === columnId);
    return {
      bgColor: column.bgColor,
      headerColor: column.headerColor,
      borderColor: column.borderColor,
      hoverColor: column.hoverColor,
      icon: column.icon,
    };
  };

  const getTaskCardStyle = (columnId) => {
    if (columnId === "To Do") return "border-l-4 border-l-indigo-500";
    if (columnId === "Working") return "border-l-4 border-l-amber-500";
    if (columnId === "In Progress") return "border-l-4 border-l-blue-500";
    if (columnId === "Completed") return "border-l-4 border-l-emerald-500";
    return "";
  };

  return (
    <div className='h-screen bg-gray-100 flex flex-col overflow-hidden'>
      <div className='mt-12'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
          <div className='min-w-0'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
              My Todo
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className='bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm sm:text-base flex-shrink-0'
          >
            <PlusCircle size={18} />
            {showForm ? "Cancel" : "Add Task"}
          </button>
        </div>

        {showForm && (
          <div className='bg-white p-6 rounded-lg shadow-md mb-6 transition-all'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='font-semibold text-lg text-gray-800'>
                Create New Task
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={20} />
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>
                  Task Title
                </label>
                <input
                  type='text'
                  placeholder='Enter task title'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all'
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>
                    Attach Image
                  </label>
                  <div className='flex items-center space-x-2'>
                    <label className='cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all'>
                      <Upload size={16} />
                      <span>Upload Image</span>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) =>
                          setNewTask({ ...newTask, image: e.target.files[0] })
                        }
                        className='hidden'
                      />
                    </label>
                    {newTask.image && (
                      <span className='text-sm text-gray-600'>
                        {newTask.image.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>
                    Attach File
                  </label>
                  <div className='flex items-center space-x-2'>
                    <label className='cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all'>
                      <Paperclip size={16} />
                      <span>Upload File</span>
                      <input
                        type='file'
                        onChange={(e) =>
                          setNewTask({ ...newTask, file: e.target.files[0] })
                        }
                        className='hidden'
                      />
                    </label>
                    {newTask.file && (
                      <span className='text-sm text-gray-600'>
                        {newTask.file.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={handleAddTask}
                  className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-sm transition-all'
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULL SIZE BOARD */}
      <div className='flex-1 px-4 sm:px-6 pb-4 sm:pb-6 min-h-0'>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4 h-full'>
          {columnDefinitions.map((column, colIndex) => {
            const style = getColumnStyle(column.id);
            return (
              <div
                key={column.id}
                className={`rounded-lg shadow-md flex flex-col ${style.bgColor} transition-all duration-200 h-full overflow-auto h-64`}
              >
                <div
                  className={`${style.headerColor} text-white p-2 sm:p-3 rounded-t-lg flex items-center justify-between flex-shrink-0`}
                >
                  <div className='flex items-center gap-1 sm:gap-2 min-w-0'>
                    <div className='flex-shrink-0'>{column.icon}</div>
                    <h3 className='font-semibold text-sm sm:text-base truncate'>
                      {column.title}
                    </h3>
                  </div>
                  <span className='bg-white bg-opacity-30 text-white text-xs px-2 py-1 rounded-full'>
                    {tasks[column.id].length}
                  </span>
                </div>

                {/* Full Height Task List */}
                <div className='p-2 sm:p-3 flex-1 flex flex-col min-h-0  '>
                  {tasks[column.id].length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-full text-gray-400 text-sm'>
                      <p>No tasks here yet</p>
                      <p>Use move button to relocate</p>
                    </div>
                  ) : (
                    <div className='space-y-2 sm:space-y-3 flex-1 min-h-0'>
                      {tasks[column.id].map((task) => (
                        <div
                          key={task.id}
                          className={`bg-white border ${getTaskCardStyle(
                            column.id
                          )} rounded-lg p-3 sm:p-4 shadow-sm hover:shadow transition-all flex-shrink-0`}
                        >
                          <h4 className='font-medium text-gray-800 mb-2 text-sm sm:text-base break-words'>
                            {task.title}
                          </h4>
                          {task.image && (
                            <div className='mb-3'>
                              <img
                                src={task.image}
                                alt='Attachment'
                                className='w-full h-32 object-cover rounded-md'
                              />
                            </div>
                          )}
                          <div className='flex justify-between items-center text-xs text-gray-500'>
                            <span>Added {task.createdAt}</span>
                            {task.file && !task.image && (
                              <span className='flex items-center gap-1'>
                                <Paperclip size={12} />
                                {task.file.name.length > 15
                                  ? `${task.file.name.slice(0, 15)}...`
                                  : task.file.name}
                              </span>
                            )}
                          </div>

                          <div className='flex justify-between mt-3'>
                            <button
                              onClick={() =>
                                moveTask(task.id, column.id, "left")
                              }
                              disabled={colIndex === 0}
                              className={`flex items-center gap-1 text-sm px-2 py-1 rounded-md ${
                                colIndex === 0
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-600 hover:text-indigo-600"
                              }`}
                            >
                              <ArrowLeft size={16} /> Left
                            </button>
                            <button
                              onClick={() =>
                                moveTask(task.id, column.id, "right")
                              }
                              disabled={
                                colIndex === columnDefinitions.length - 1
                              }
                              className={`flex items-center gap-1 text-sm px-2 py-1 rounded-md ${
                                colIndex === columnDefinitions.length - 1
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-600 hover:text-indigo-600"
                              }`}
                            >
                              Right <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
