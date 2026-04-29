import { useEffect, useState } from "react";
import { fetchProjectNames } from "../apis/dashboardApi";
import { useWorkspaceid } from "../../Worksapce/hooks/workspacehooks";
import { setSwitchProject } from "../../Redux/feature/swichProjectSlice";
import { useDispatch } from "react-redux";

type Project = {
  name: string;
  _id: string;
};

function getInitials(name: string) {
  if (!name) return "AL";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const SwapProject = () => {
   const dispatch = useDispatch();
  const workspaceId = useWorkspaceid();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>([
    {
      name: "All",
      _id: "",
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<Project>({
    name: "All",
    _id: "",
  });
console.log(selectedProject,"selectedProject")
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
    async function fetchAllprojects() {
      try {
        const names = await fetchProjectNames(workspaceId);

        const updatedProjects = [
          { name: "All", _id: "" },
          ...names,
        ];

        setProjects(updatedProjects);
        setSelectedProject(updatedProjects[0]);
      } catch {
        setProjects([{ name: "All", _id: "" }]);
        setSelectedProject({ name: "All", _id: "" });
      }
    }

    if (workspaceId) {
      fetchAllprojects();
    }
  }, [workspaceId]);

  return (
    <div className="relative">
      {/* Click Rounded Box */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="group relative"
      >
        <span
          className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md transition-all duration-300 group-hover:scale-110 group-hover:ring-4 group-hover:ring-gray-200 ${getColors(
            selectedProject.name
          )}`}
        >
          {getInitials(selectedProject.name)}
        </span>

        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute top-[65px] left-0 w-56 bg-white border border-gray-300 rounded-xl shadow-lg p-2 space-y-1 z-50">
          {projects.map((project) => (
            <button
              key={project._id || "all"}
              onClick={() => {
                setSelectedProject(project);
                  dispatch(
                    setSwitchProject({
                      projectId: project._id||"",
                      projectName: project?.name||"",
                      isSwitch: true,
                    })
                  );
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${getColors(
                  project.name
                )}`}
              >
                {getInitials(project.name)}
              </span>

              <span className="text-sm text-black truncate">
                {project.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};