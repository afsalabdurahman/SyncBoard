import { useState } from 'react';

import { FiUser, FiHeadphones, FiPlus,FiCalendar,FiTv,FiFolder } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import {meeting,deactive, activity,channel,invite,mytodo,myproject,abuse  } from '../../Redux/feature/StatusSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { Flag } from 'lucide-react';
const SubSideMenu = () => {
  const WorkspaceData = useSelector((state: RootState) =>{
    const user=state.register;
    const workspaces=state.workspace.workspace
return{user,workspaces}
  } );
  const dispatch=useDispatch()

  const [bgColor, setBgColor] = useState("activitys");
  
const meetings = () =>{
  setBgColor("")
  dispatch(deactive())
  dispatch(meeting())
  setBgColor("meetings")
}
const activitys = () =>{
  setBgColor("")
  dispatch(deactive())
  setBgColor("activitys")
  dispatch(activity())
  
}
const channels=(data:string)=>{
  setBgColor("")
  dispatch(deactive())
  dispatch(channel())
  setBgColor(data)
}
const mytodos=()=>{
setBgColor("")
  dispatch(deactive())
  dispatch(mytodo())
  setBgColor("mytodos")
}
const myprojects=()=>{
  setBgColor("")
  dispatch(deactive())
  dispatch(myproject())
  setBgColor("myprojects")
}
const invites= () => {
  setBgColor("")
  dispatch(deactive())
dispatch(invite())
  setBgColor("invites")
}

const abuses= ()=>{
   setBgColor("")
  dispatch(deactive())
dispatch(abuse())
  setBgColor("abuses")
}
  return (
    
    <div className="bg-purple-900 text-white w-64 h-screen flex flex-col">
      {/* Header */}

<div className=" text-center flex items-center justify-between pt-[4rem] text-sm font-semibold border-b border-purple-700">
        <span className=' text-lg pt-[2rem] pl-[4rem]'>{WorkspaceData.workspaces.name}</span>
        
      </div>



      




      {/* Menu */}
      <div className="flex flex-col text-sm px-2 pt-[3.5rem] space-y-1">
        <button onClick={activitys} className={`flex items-center space-x-2 px-3 py-2 text-purple-300 hover:text-white rounded cursor-pointer ${bgColor === "activitys" ? "bg-purple-700" : ""}`}>
          <FiUser />
          <span>Activities</span>
        </button>

        <button onClick={meetings} className={`flex items-center space-x-2 px-3 py-2 text-purple-300 hover:text-white rounded cursor-pointer ${bgColor === "meetings" ? "bg-purple-700" : ""}`}>
          <FiHeadphones />
          <span>Members</span>
        </button>

        <button onClick={()=>channels("channels")} className={`flex items-center space-x-2 px-3 py-2 text-purple-300 hover:text-white rounded cursor-pointer ${bgColor === "channels" ? "bg-purple-700" : ""}`}>
          <FiTv />
          <span>Channel</span>
        </button>
<button onClick={myprojects}  className={`flex items-center space-x-2 px-3 py-2 text-purple-300 hover:text-white rounded cursor-pointer ${bgColor === "myprojects" ? "bg-purple-700" : ""}`}>
          <FiFolder />
          <span>My projects</span>
        </button>
        {/* Direct Messages */}
        <button onClick={mytodos} className={`flex items-center space-x-2 px-3 py-2 text-purple-300 hover:text-white rounded cursor-pointer ${bgColor === "mytodos" ? "bg-purple-700" : ""}`}>
          <FiCalendar />
          <span>Mytodo</span>
        </button>

        {/* Invite people */}
        <button onClick={invites} className={`flex items-center space-x-2 px-3 py-2 text-purple-300 hover:text-white rounded cursor-pointer ${bgColor === "invites" ? "bg-purple-700" : ""}`}>
          <FiPlus />
          <span>Invite people</span>
        </button>
         <button onClick={abuses} className={`flex items-center space-x-2 px-3 py-2 text-purple-300 hover:text-white rounded cursor-pointer ${bgColor === "abuses" ? "bg-purple-700" : ""}`}>
          <Flag size={15}/>
          <span>Abuse Report</span>
        </button>
      </div>
    </div>
  );
};

export default SubSideMenu;
