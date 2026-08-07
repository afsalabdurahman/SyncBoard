import { useEffect, useState } from "react";
import {
  useUser,
  useWorkspaceid,
  useWorkspaceName,
} from "../../Worksapce/hooks/workspacehooks";
import { useDispatch, useSelector } from "react-redux";
import { findWorkspaceById, listWorkspace } from "../apis/workspaceapis";
import { setWorkspace as reduxSetWorkspace } from "../../Redux/feature/WorkspaceSlice";
import { useNavigate } from "react-router-dom";
type Workspace = {
  name: string;
  id: string;
};

function getInitials(name: string) {
  if (!name) return "WS";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const ChooseWorkspace = () => {
  const dispatch = useDispatch();
const naviagate = useNavigate()
  const workspaceName = useWorkspaceName();
  const workspaceId = useWorkspaceid();
  const user = useUser();

  const isForward = useSelector(
    (state) => state?.forward?.isForward
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const [selectedWorkspace, setSelectedWorkspace] =
    useState<Workspace>({
      name: workspaceName,
      id: workspaceId,
    });

   

const selectWorkspace = async (sWorkspace)=>{
 
  setSelectedWorkspace(sWorkspace)
  const workspaceData=await findWorkspaceById(sWorkspace.id)
   dispatch(reduxSetWorkspace(workspaceData))
     setDropdownOpen(false);
}

  function getColors(name: string) {
    const colors = [
      "bg-rose-500",
      "bg-violet-500",
      "bg-sky-500",
      "bg-emerald-500",
      "bg-orange-500",
    ];

    const index = name.length % colors.length;
    return colors[index];
  }

  useEffect(() => {
    async function fetchAllWorkspace() {
      try {
        const response = await listWorkspace(user?._id ?? "");

      

        // Handle both array response and {data: []} response
        const workspaceList: Workspace[] = Array.isArray(response)
          ? response
          : response?.data || [];

       

        setWorkspaces(workspaceList);

        // Set current selected workspace
        const currentWorkspace =
          workspaceList.find(
            (item) => item.id === workspaceId
          ) || workspaceList[0];

        if (currentWorkspace) {
          setSelectedWorkspace(currentWorkspace);
        }
      } catch  {
       
        setWorkspaces([]);
      }
    }

    if (user?._id) {
      fetchAllWorkspace();
    }
  }, [user?._id, workspaceId, isForward]);

  return (
    <div className="relative">
      {/* Current Selected Workspace */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="group relative"
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center
          text-white text-[11px] font-semibold shadow-sm
          transition-all duration-200
          group-hover:scale-105 group-hover:ring-2 group-hover:ring-gray-200
          ${getColors(selectedWorkspace.name)}`}
        >
          {getInitials(selectedWorkspace.name)}
        </div>

        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div
          className="absolute top-14 left-0 w-64 bg-white border border-gray-200
          rounded-2xl shadow-xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Workspaces
            </p>
          </div>

          {/* Workspace List */}
          <div className="max-h-60 overflow-y-auto p-2">
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => {        
selectWorkspace(workspace)     
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                    text-white text-[10px] font-medium
                    ${getColors(workspace.name)}`}
                  >
                    {getInitials(workspace.name)}
                  </div>

                  {/* Workspace Name */}
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {workspace.name}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500 px-3 py-2">
                No workspaces found
              </p>
            )}
          </div>

          {/* Create Workspace */}
          <div className="border-t border-gray-100 p-2">
            <button
            onClick={()=>naviagate("/create/workspace")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl
              hover:bg-blue-50 text-blue-600 transition"
            >
              <div
                className="w-8 h-8 rounded-full bg-blue-100
                flex items-center justify-center text-lg font-semibold"
              >
                +
              </div>

              <span className="text-sm font-medium">
                Create New Workspace
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};