import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideMenu from "../components/SideMenu";
import SubSideMenu from "../../Worksapce/components/SubSideMenu";
import ActivityFeed from "../components/ActivityFeed";
import MeetingRoom from "../components/MeetingRoom";
import Channel from "../components/Channel";
import Mytodo from "../components/Mytodo";
import TopBar from "../components/TopBar";
import Invite from "../components/Invite";
import MyProject from "../components/MyProject";
import Profile from "../components/Profile";
import RAG from "../pages/RagChatPage";
import Abuse from "../pages/AbuseReport"
import {Sparkles } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from "../../Custom/ui/tooltip"; // Add this import
import { RootState } from "../../Redux/store";
import { useUser, useUserBasedWorkspace } from "../hooks/workspacehooks";
import { useUserId } from "../../Admin/hooks/userhooks";
import { updatePermission } from "../../Redux/feature/user/userSlice";

function WorkSpacePage() {
  const [profileStatus, setProfileStatus] = useState(false);
  const [isRagOpen, setIsRagOpen] = useState(false);
const userId = useUser();
const user = useUserBasedWorkspace(userId?._id);
const dispatch = useDispatch();

useEffect(() => {
  if (user?.[0]?.permissions) {
    dispatch(updatePermission(user[0].permissions));
  }
}, [user, dispatch]);

  const currentStatusKey = useSelector((state: RootState) => {
    const trueKeys = Object.keys(state.status).filter(
      (key) => state.status[key]
    );
    return trueKeys[0] || "";
  });

  useEffect(() => {
    setProfileStatus(currentStatusKey === "Profile");
  }, [currentStatusKey]);

  const componentMap: Record<string, React.ComponentType> = {
    ActivityFeed,
    MeetingRoom,
    Channel,
    Mytodo,
    MyProject,
    Invite,
    Abuse
  };

  const Status = componentMap[currentStatusKey];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Fixed TopBar */}
      <header className='fixed top-0 left-0 w-full bg-white shadow z-50'>
        <TopBar />
      </header>

      {/* Main Content Area */}
      <div className='flex h-screen '>
        <div className='w-20 bg-gray-800 text-white flex-shrink-0'>
          <SideMenu />
        </div>

        {profileStatus ? (
          <div className='flex-1 bg-white overflow-y-auto'>
            <Profile />
          </div>
        ) : (
          <>
            <div className='w-1/5 bg-gray-100 border-l border-gray-300 flex-shrink-0'>
              <SubSideMenu />
            </div>
            <div className='flex-1 bg-white overflow-y-auto'>
              {Status ? <Status /> : null}
            </div>
          </>
        )}
      </div>

      {/* RAG Sidebar - Fixed on right side, 1/4 screen width */}
      <div
        className={`fixed top-[3.4rem] right-0 h-[calc(100vh-3.3rem)] w-1/4 bg-white border-l-2 border-gray-200 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isRagOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <RAG />
        </div>
      </div>

      {/* Toggle Button for RAG with Tooltip */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsRagOpen(!isRagOpen)}
            className={`fixed top-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-l-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center ${
              isRagOpen ? "right-[25%]" : "right-0"
            }`}
            aria-label="Toggle RAG Assistant"
          >
            {isRagOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            ) : (
              <Sparkles size={25} absoluteStrokeWidth />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI Assistant</p>
        </TooltipContent>
      </Tooltip>

      {/* Backdrop overlay when RAG is open */}
      {isRagOpen && (
        <div
          className="fixed inset-0  bg-opacity-20 z-30 transition-opacity duration-300"
          onClick={() => setIsRagOpen(false)}
        />
      )}
    </div>
  );
}

export default WorkSpacePage;
