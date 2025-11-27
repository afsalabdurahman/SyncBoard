import { FiArrowLeft, FiArrowRight, FiClock, FiSearch, FiHelpCircle,FiLogOut } from 'react-icons/fi';
import { Tooltip, TooltipTrigger, TooltipContent } from "../../Custom/ui/tooltip"; // Add this import
import { useState } from 'react';
import { useUser } from '../hooks/workspacehooks';
import {logout} from "../apis/workspaceapis"
import { checkDomainOfScale } from 'recharts/types/util/ChartUtils';
const TopBar = () => {
  const user = useUser()
  console.log(user,"userrrrr")
    const [isLogout, setIsSetLogut] = useState(false);
  return (
    <div className="bg-purple-900 h-10 flex items-center px-4 justify-between text-white text-sm">
      {/* Left side navigation icons */}
      <div className="flex items-center space-x-4">
        <button className="hover:text-gray-300">
          <FiArrowLeft />
        </button>
        <button className="hover:text-gray-300">
          <FiArrowRight />
        </button>
        <button className="hover:text-gray-300">
          <FiClock />
        </button>
      </div>

      {/* Center search bar */}
      <div className="flex flex-1 mx-4">
        <input
          type="text"
          placeholder="Search ABC ltd"
          className="bg-purple-700 text-white placeholder-purple-300 px-3 py-1 rounded w-full focus:outline-none"
        />
        <button className="ml-2 text-purple-300 hover:text-white">
          <FiSearch />
        </button>
      </div>

      {/* Right help icon */}
      <div>
         <Tooltip>
      <TooltipTrigger asChild>
        <button className="hover:text-gray-300">
          <FiLogOut onClick={()=>logout(user._id)} />
        </button>
          </TooltipTrigger>
            <TooltipContent>
              Logout
            </TooltipContent>
            </Tooltip>
      </div>
    </div>
  );
};

export default TopBar;
