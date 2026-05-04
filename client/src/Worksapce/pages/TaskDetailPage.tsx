"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  AlertCircle,
  Link,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setTitle } from "../../Redux/feature/ForwardSlice";
import {  taskDetailsApi, updateSubTaskStatus } from "../apis/workspaceapis";

/* ---------------- SAMPLE DATA ---------------- */



/* ---------------- BADGE ---------------- */

const Badge = ({
  text,
  color,
}: {
  text: string;
  color: string;
}) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}
  >
    {text}
  </span>
);

/* ---------------- INFO ITEM ---------------- */

const InfoItem = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

/* ---------------- MAIN COMPONENT ---------------- */

export const TaskDetailsPage = ({ id }) => {

  const [task, setTask] = useState();

  const dispatch = useDispatch()
  /* Toggle Subtask */

  useEffect(() => {
    async function fetchTaskDetails(taskId: string) {
      const task = await taskDetailsApi(taskId);
     
      setTask(task)
      setComments(task?.comments)
    }

    fetchTaskDetails(id)
  }, [id])




  const toggleSubtask = async (id: number, title) => {
    const updated = task?.subTask?.map((item) =>
      item.id === id
        ? { ...item, done: !item.done }
        : item
    );

    await updateSubTaskStatus(task?._id, title)
    setTask({
      ...task,
      subTask: updated,
    });
  };


  // const toggleApproval = async (id: number) => {

  //   const updated = task?.approvalCriteria?.map((item) =>
  //     item.id === id
  //       ? { ...item, completed: !item.completed }
  //       : item
  //   );
  //   setTask({
  //     ...task,
  //     subTask: updated,
  //   });

  //   await ApprovalCriteria(task?._id, task?.name)

  // };


  /* Add Comment */
  // const handleAddComment = () => {
  //   if (!newComment.trim()) return;

  //   const newItem = {
  //     id: Date.now(),
  //     user: "You",
  //     text: newComment,
  //     time: "Just now",
  //   };

  //   setComments([...comments, newItem]);
  //   setNewComment("");
  // };

  const completedCount = task?.subTask?.filter(
    (item) => item.done
  ).length;

  return (
    <div className=" p-6 bg-gray-50 min-h-screen" >
      <div className="max-w-7xl mx-auto mt[4em]">

        {/* CLOSE BUTTON */}
        <button onClick={() => dispatch(setTitle(""))} className="  right-5 z-50 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg ">
          <X size={15} />
        </button>

        <div className="grid md:grid-cols-3 h-full mt-6">

          {/* LEFT SECTION */}
          <div className="md:col-span-2 overflow-y-auto p-3 space-y-6 border-r mt-[-2em]">

            {/* HEADER */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm ">
              <p className="text-sm text-gray-500">
                {task?._id}
              </p>

              <h1 className="text-2xl font-bold mt-2">
                {task?.name}
              </h1>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge
                  text={task?.status}
                  color="bg-blue-100 text-blue-600"
                />
                <Badge
                  text={task?.priority}
                  color="bg-red-100 text-red-600"
                />
                <Badge
                  text={task?.approvalStatus}
                  color="bg-yellow-100 text-yellow-700"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <h2 className="text-lg font-semibold mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-7">
                {task?.description}
              </p>
            </div>

            {/* SUBTASKS */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Subtasks
                </h2>

                <span className="text-sm text-gray-500">
                  {completedCount}/{task?.subTask.length} completed
                </span>
              </div>

              <div className="space-y-3">
                {task?.subTask.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border rounded-xl p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          toggleSubtask(item.id, item.title)
                        }
                      >
                        <CheckCircle2
                          className={
                            item.done
                              ? "text-green-500"
                              : "text-gray-300"
                          }
                        />
                      </button>

                      <span>{item.title}</span>
                    </div>

                    <Badge
                      text={item.status}
                      color="bg-gray-100 text-gray-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* COMMENTS */}
            {/* <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="text-blue-500" />
                <h2 className="text-lg font-semibold">
                  Comments
                </h2>
              </div>

     
              <div className="border rounded-xl p-4 mb-5">
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) =>
                    setNewComment(e.target.value)
                  }
                  placeholder="Write comment..."
                  className="w-full resize-none outline-none"
                />

                <div className="flex justify-between mt-4">
                  <button className="flex items-center gap-2 text-purple-600">
                    <Paperclip size={18} />
                    Attach File
                  </button>

                  <button
                    onClick={handleAddComment}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Send size={16} />
                    Send
                  </button>
                </div>
              </div>

          
             {
              comments?.length!==0? (<div className="space-y-4 max-h-[300px] overflow-y-auto">
                {comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className="border rounded-xl p-4"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">
                        {comment.user}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {comment.time}
                      </span>
                    </div>

                    <p className="text-gray-600 mt-2">
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
          ):null
             }
             </div> */}



            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                Attachments
              </h2>

              <div className="space-y-3">
                {task?.attachedURLs?.map((item) => (
                  <a
                    key={item.id}
                    href={item.link}
                    className="flex items-center gap-3 border rounded-xl p-4 hover:bg-gray-50"
                  >
                    <Link className="text-purple-500" />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="overflow-y-auto p-6 space-y-6 bg-white mt-[-1em]">

            {/* TASK DETAILS */}
            <div className="border rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-5">
                Task Details
              </h2>

              <div className="space-y-5">
                <InfoItem
                  icon={<User className="text-blue-500" />}
                  title="Assignee"
                  value={task?.assignedUser?.name}
                />

                <InfoItem
                  icon={
                    <Calendar className="text-green-500" />
                  }
                  title="Deadline"
                  value={task?.deadline}
                />

                <InfoItem
                  icon={
                    <AlertCircle className="text-red-500" />
                  }
                  title="Priority"
                  value={task?.priority}
                />

                <InfoItem
                  icon={
                    <Clock className="text-orange-500" />
                  }
                  title="Project"
                  value={task?.project.name}
                />
              </div>
            </div>

            {/* APPROVAL CRITERIA */}
            <div className="border rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-green-600 mb-4">
                Approval Criteria
              </h2>

              <div className="space-y-3">
                {task?.approvalCriteria.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl"
                  >



                    <span className="text-sm text-gray-700">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}