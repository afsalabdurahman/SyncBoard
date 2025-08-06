import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import type { AppDispatch } from "../../../Redux/store";
import { fetchAllLogs } from "../../../Redux/thunks/logThunks";
import { Activity, Clock, User, MessageCircle, UserPlus, Mail ,FolderKanban ,FileText, Settings } from 'lucide-react';

export default function ActivityFeed() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  
 const logs = useSelector((state) => {
  console.log(state.logs, "Inside cosepe++++"); // For debugging
 const workspace= state.logs.workspaceLogs.map((msg) => msg.messages);
  const project= state.logs.projectActivityLogs.map((msg)=>msg.messages)
  const user =state.logs.userActivityLogs.map((msg)=>msg.messages)
   return([...workspace,...project,...user])
}) ||[]
console.log(logs,"+++++")
  const isBlock = useSelector((state) => {
    console.log(state?.user?.user?.isBlock, "block state");
    return state?.user?.user.isBlock;
  });
  if (isBlock == true) {
    navigate("/login");
  }

  const getActivityIcon = (message) => {
    if (message.includes('Created')) return <User className="w-4 h-4" />;
    if (message.includes('Project') || message.includes('File')) return <FolderKanban  className="w-4 h-4" />;
    if (message.includes('mentioned')) return <MessageCircle className="w-4 h-4" />;
    if (message.includes('huddle')) return <Activity className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };


  const formatDate = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // You can customize this format
  };
  const workspaceId = useSelector((state) => {
    return state.workspace.workspace._id;
  });

  useEffect(() => {
    dispatch(fetchAllLogs(workspaceId));
  }, [dispatch]);

  return (
    <div className='mt-8 w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden max-w-[1000px] mx-auto'>
      <div className='px-6 py-4 bg-gray-50 border-b border-gray-100'>
        <h2 className='text-lg font-medium text-gray-800'>Activities</h2>
      </div>

  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
        {logs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">No recent activities</p>
                <p className="text-xs text-gray-500">Activity will appear here when things happen</p>
              </div>
            </div>
          </div>
        )}
        {logs.map((msg, index) => (
          <div 
            key={index} 
            className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5 text-gray-400 group-hover:text-gray-600">
                {getActivityIcon(msg)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-5 break-words">
                  {msg}
                </p>
                {/* <p className="text-xs text-gray-500 mt-1">
                  {getTimeAgo(index)}
                </p> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
