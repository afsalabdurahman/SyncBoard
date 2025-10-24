import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../Services/socket";
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
import { useDispatch } from "react-redux";

function WorkSpacePage() {
  const [profileStatus, setProfileStatus] = useState(false);
  

  // Extract active component key from Redux state
  const currentStatusKey = useSelector((state: any) => {
    const trueKeys = Object.keys(state.status).filter(
      (key) => state.status[key]
    );
    return trueKeys[0] || "";
  });

  // Sync profileStatus when status changes
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
  };

  const Status = componentMap[currentStatusKey];

  return (
    <div>
      <header className='fixed top-0 left-0 w-full bg-white shadow z-50'>
        <TopBar />
      </header>

      <div className='flex h-screen pt-[3.3rem] mt-[-3rem]'>
        <div className='w-20 bg-gray-800 text-white'>
          <SideMenu />
        </div>

        {profileStatus ? (
          <div className='flex-1 bg-white '>
            <Profile />
          </div>
        ) : (
          <>
            <div className='w-1/5 bg-gray-100 border-l border-gray-300'>
              <SubSideMenu />
            </div>
            <div className='flex-1 bg-white overflow-y-auto '>
              {Status ? <Status /> : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WorkSpacePage;
