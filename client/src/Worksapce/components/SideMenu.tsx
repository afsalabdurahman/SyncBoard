import { useState, useEffect } from "react";
import { FiHome } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useDispatch } from "react-redux";
import {
  profile,
  deactive,
  activity,
} from "../../Redux/feature/StatusSlice";
import NotificationBell from "./Notification";
import { socket } from "../../Services/socket";
import { ChooseWorkspace } from "../pages/ChooseWorkspace";
const SideMenu = () => {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    socket.on("new-project", (data) => {
      setMessage(data.message);

      // Auto clear after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    });
    socket.on("new-task", (data) => {
      setMessage(data.message);
    });
    setTimeout(() => setMessage(null), 5000);

    return () => {
      socket.off("new-project");
      socket.off("new-task");
    };
  }, []);

  const dispatch = useDispatch();
  const [active, setActive] = useState("Home");
  const WorkspaceData = useSelector((state: RootState) => {
    const user = state.user.user;
    const workspaces = state.workspace.workspace;
    return { user, workspaces };
  });

  const menuItems = [
    { name: "Home", icon: <FiHome />, key: "home" },
   
    {
      name: "Notification",
      icon: <NotificationBell messages={message} />,
      key: "notification",
    },
 
  ];
  const Userprofile = { name: "Profile", key: "profile" };
  const Handleprofile = () => {
    setActive(Userprofile.name);
    dispatch(deactive());
    dispatch(profile());
  };
  const home = (name: string) => {
    setActive(name);
    if (name == "Home") {
      dispatch(deactive());
      dispatch(activity());
    }
  };
  return (
    <div className='flex flex-col bg-[#2a003f] text-white h-screen w-20 justify-between  pt-[0rem] pb-[5rem]'>
      {/* Top initials icon */}
      <div className='flex flex-col items-center space-y-6'>
        <div className=' w-10 h-10 r flex items-center justify-center '></div>

        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => home(item.name)}
            //   onClick={() => setActive(item.name)}
            className={`flex flex-col items-center space-y-1 focus:outline-none cursor-pointer ${
              active === item.name ? "text-white" : "text-gray-300"
            }`}
          >
            <div className='text-xl'>{item.icon}</div>
            <span className='text-[10px]'>{item.name}</span>
          </button>
        ))}
          <button  className="text-purple-300 hover:text-white">
             <ChooseWorkspace />
        </button>
 
      </div>

      {/* Bottom profile icon */}
      <button
        key={profile.key}
        onClick={Handleprofile}
        className={`flex flex-col items-center space-y-1 focus:outline-none cursor-pointer ${
          active === profile.name ? "text-white" : "text-gray-300"
        }`}
      >
        <div className='flex flex-col items-center'>
          <img
            src={WorkspaceData?.user?.imageUrl ?? "/images/user.jpeg"}
            alt='User Avatar'
            className='rounded-full w-10 h-10 '
          />
          <p className='text-[13px] font-mono'>{WorkspaceData?.user?.name}</p>
        </div>
      </button>
    
    </div>
  );
};

export default SideMenu;
