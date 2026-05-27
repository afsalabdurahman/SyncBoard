import React, { useState, useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideMenu from "../components/SideMenu";
import SubSideMenu from "../../Worksapce/components/SubSideMenu";
import TopBar from "../components/TopBar";
import { Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../../Custom/ui/tooltip";

import { RootState } from "../../Redux/store";
import {
  useUser,
  useUserBasedWorkspace,
} from "../hooks/workspacehooks";

import { updatePermission } from "../../Redux/feature/user/userSlice";

// =========================
// Lazy Loaded Components
// =========================

const ActivityFeed = lazy(() => import("../components/ActivityFeed"));

const MeetingRoom = lazy(() => import("../components/MeetingRoom"));

const Channel = lazy(() => import("../components/Channel"));

const Mytodo = lazy(() => import("../components/Mytodo"));

const Invite = lazy(() => import("../components/Invite"));

const MyProject = lazy(() => import("../components/MyProject"));

const Profile = lazy(() => import("../components/Profile"));

const RAG = lazy(() => import("../pages/RagChatPage"));

const Abuse = lazy(() => import("../pages/AbuseReport"));

// =========================
// Loader Component
// =========================

const PageLoader = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

function WorkSpacePage() {
  const [profileStatus, setProfileStatus] = useState(false);
  const [isRagOpen, setIsRagOpen] = useState(false);

  const dispatch = useDispatch();

  const userId = useUser();

  const user = useUserBasedWorkspace(userId?._id);

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

  // =========================
  // Dynamic Component Map
  // =========================

  const componentMap: Record<
    string,
    React.LazyExoticComponent<React.ComponentType<unknown>>
  > = {
    ActivityFeed,
    MeetingRoom,
    Channel,
    Mytodo,
    MyProject,
    Invite,
    Abuse,
  };

  const Status = componentMap[currentStatusKey];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* =========================
          Fixed TopBar
      ========================= */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <TopBar />
      </header>

      {/* =========================
          Main Content
      ========================= */}
      <div className="flex h-screen">
        {/* Left Side Menu */}
        <div className="w-20 bg-gray-800 text-white flex-shrink-0">
          <SideMenu />
        </div>

        {profileStatus ? (
          <div className="flex-1 bg-white overflow-y-auto">
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          </div>
        ) : (
          <>
            {/* Sub Side Menu */}
            <div className="w-1/5 bg-gray-100 border-l border-gray-300 flex-shrink-0">
              <SubSideMenu />
            </div>

            {/* Dynamic Lazy Component */}
            <div className="flex-1 bg-white overflow-y-auto">
              <Suspense fallback={<PageLoader />}>
                {Status ? <Status /> : null}
              </Suspense>
            </div>
          </>
        )}
      </div>

      {/* =========================
          RAG Sidebar
      ========================= */}
      <div
        className={`fixed top-[3.4rem] right-0 h-[calc(100vh-3.3rem)] w-1/4 bg-white border-l-2 border-gray-200 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isRagOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <RAG />
          </Suspense>
        </div>
      </div>

      {/* =========================
          AI Toggle Button
      ========================= */}
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

      {/* =========================
          Backdrop Overlay
      ========================= */}
      {isRagOpen && (
        <div
          className="fixed inset-0 bg-opacity-20 z-30 transition-opacity duration-300"
          onClick={() => setIsRagOpen(false)}
        />
      )}
    </div>
  );
}

export default WorkSpacePage;