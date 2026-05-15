import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../Redux/store";
import { Activity, Clock, User, MessageCircle, FolderKanban } from 'lucide-react';
import { useUser, useUserBasedWorkspace, useWorkspaceid } from "../hooks/workspacehooks";
import { myLogs } from "../apis/workspaceapis";
import { updatePermission } from "../../Redux/feature/user/userSlice";

export default function ActivityFeed() {



  
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const workspaceId = useWorkspaceid() as string


  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const result = await myLogs(workspaceId);

      setLogs([...result]);
    };

    fetchLogs();
  }, [workspaceId]);




  const isBlock = useSelector((state) => {
    return state?.user?.user.isBlock;
  });
  if (isBlock == true) {
    navigate("/login");
  }

  const getActivityIcon = (message:string) => {
    if (message.includes('Created')) return <User className="w-4 h-4" />;
    if (message.includes('Project') || message.includes('File')) return <FolderKanban className="w-4 h-4" />;
    if (message.includes('mentioned')) return <MessageCircle className="w-4 h-4" />;
    if (message.includes('huddle')) return <Activity className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };


 

  useEffect(() => {
  }, [dispatch]);

const userId = useUser();
const user = useUserBasedWorkspace(userId?._id);


useEffect(() => {
  if (user?.[0]?.permissions) {
    dispatch(updatePermission(user[0].permissions));
  }
}, [user, dispatch]);





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
