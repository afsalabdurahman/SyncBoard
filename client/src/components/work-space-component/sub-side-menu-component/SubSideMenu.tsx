import { useState } from 'react';
import { FiUser, FiHeadphones, FiChevronDown, FiPlus,FiCalendar,FiTv,FiFolder } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import {meeting,deactive, activity,channel,invite,mytodo,myproject  } from '../../../Redux/workspace/StatusSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
const SubSideMenu = () => {
  let WorkspaceData = useSelector((state: RootState) =>{
    let user=state.register;
    let workspaces=state.workspace.workspace
return{user,workspaces}
  } );
  console.log(WorkspaceData,"dtaa")
  let dispatch=useDispatch()
  const [showChannels, setShowChannels] = useState(false);
  const [showDMs, setShowDMs] = useState(true);
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
console.log(bgColor,"bgColor")
  return (
    
    <div className="bg-purple-900 text-white w-64 h-screen flex flex-col">
      {/* Header */}
      <div className=" text-center flex items-center justify-between pt-[4rem] text-sm font-semibold border-b border-purple-700">
        <span className=' text-lg pt-[2rem] pl-[4rem]'>{WorkspaceData.workspaces.name}</span>
        <button className="text-purple-300 hover:text-white">
          <FiPlus />
        </button>
      </div>

      {/* Menu */}
      <div className="flex flex-col text-sm px-2 pt-[3.5rem] space-y-1">
        <button onClick={activitys} className={`flex items-center space-x-2 px-3 py-2 text-purple-300 hover:text-white rounded cursor-pointer ${bgColor === "activitys" ? "bg-purple-700" : ""}`}>
          <FiUser />
          <span>Activities</span>
        </button>

        <button onClick={meetings} className={`flex items-center space-x-2 px-3 py-2 text-purple-300 hover:text-white rounded cursor-pointer ${bgColor === "meetings" ? "bg-purple-700" : ""}`}>
          <FiHeadphones />
          <span>Meeting room</span>
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
      </div>
    </div>
  );
};

export default SubSideMenu;
