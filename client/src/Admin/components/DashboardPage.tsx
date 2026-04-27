import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Custom/ui/card";

import { RootState } from "../../Redux/store";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,

} from "../../Custom/ui/chart";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Users, FolderOpen, AlertTriangle, CheckCircle } from "lucide-react";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SwichDashboard from "./SwichDashboard";
import { fetchProjectNames } from "../apis/dashboardApi";
import { useWorkspaceid } from "../../Worksapce/hooks/workspacehooks";
import {setSwitchProject} from "../../Redux/feature/swichProjectSlice";
import { useDispatch } from "react-redux";
export function DashboardPage() {
  const dispatch = useDispatch();
  // dispatch(setSwitchProject({
    
  // })) 


  const workspaceId = useWorkspaceid();
  const isSwitch= useSelector((state)=>state.switch.isSwitch);
  const projectID=useSelector((state)=>state.switch.projectId);
  console.log(isSwitch,"isSwich",projectID)
  const initialState = useSelector((state: RootState) => {
    console.log(state,"stateee")
    const countProject = state.projects.list.length;
    const countProjectCompleted = state.projects.list.filter((project) => project.status == "Completed");
    const countProjectInProgress = state.projects.list.filter((project) => project.status == "In Progress");
    const countTaskTODO = state.task.tasks.filter(
      (task) => task.status === "To Do"
    ).length;
    const countTaskProgress = state.task.tasks.filter(
      (task) => task.status === "In Progress"
    ).length;
    const countTaskCompleted = state.task.tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const countMembers = state.workspace.workspace.members.length;

    return {
      countProject,
      countMembers,
      countProjectCompleted,
      countProjectInProgress,
      countTaskTODO,
      countTaskProgress,
      countTaskCompleted

    };
  });
  const projectStats = [
    { name: "Total", value: initialState.countProject, fill: "hsl(var(--chart-2))" },
    { name: "Completed", value: initialState.countProjectCompleted.length, fill: "hsl(var(--chart-1))" },
    { name: "In Progress", value: initialState.countProjectInProgress.length, fill: "hsl(var(--chart-3))" },
  ];
  const taskStatusData = [
    { name: "To Do", value: initialState.countTaskTODO, fill: "#ef4444" },
    { name: "In Progress", value: initialState.countTaskProgress, fill: "#f59e0b" },
    { name: "Done", value: initialState.countTaskCompleted, fill: "#10b981" },
  ];

const [projects, setProjects] = useState<{ name: string; _id: string }[]>([
  {
    name: "All",
    _id: "",
  },
]);
const [selectedProject, setSelectedProject] = useState<string|null>("");
useEffect(() => {
  async function fetchAllprojects(workspaceId: string) {
    try {
      const names = await fetchProjectNames(workspaceId);

      setProjects([
        { name: "All", _id: "" },
        ...names,
      ]);
    } catch{
     setSelectedProject("")
    }
  }

  fetchAllprojects(workspaceId);
}, [workspaceId]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

      <div className="w-full bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">
          <h4 className="text-3xl font-bold tracking-tight"> {selectedProject.name} Overview</h4>
        </div>

        {/* Project Selector */}
        <div className="relative">
         <select
    value={projectID}
    onChange={(e) => dispatch(setSwitchProject({projectId:e.target.value,projectName:e.target.name,isSwitch:true}))}
    className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
  >
    {projects.map((project) => (
      <option key={project._id} value={project._id}  >
        {project.name}
      </option>
    ))}
  </select>

          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>


      </div>
      {projectID? <SwichDashboard selectedProject={projectID} /> :
        <aside>
          {/* divisio start from here........................................ */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>

                <FolderOpen className="h-4 w-4 text-muted-foreground" />

              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">
                  {initialState.countProject}
                </div>



              </CardContent>
            </Card>

            <Card>

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>

                <Users className="h-4 w-4 text-muted-foreground" />

              </CardHeader>

              <CardContent>

                <div className="text-2xl font-bold">
                  {initialState.countMembers - 1}
                </div>



              </CardContent>

            </Card>

            <Card>

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                <CardTitle className="text-sm font-medium">
                  Overdue Tasks
                </CardTitle>

                <AlertTriangle className="h-4 w-4 text-muted-foreground" />

              </CardHeader>

              <CardContent>

                <div className="text-2xl font-bold">
                  0
                </div>



              </CardContent>

            </Card>

            <Card>

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>

                <CheckCircle className="h-4 w-4 text-muted-foreground" />

              </CardHeader>

              <CardContent>

                <div className="text-2xl font-bold">
                  {initialState.countTaskCompleted}
                </div>



              </CardContent>

            </Card>

          </div>

          {/* Charts */}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">


            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>
                  Total, completed and in-progress projects
                </CardDescription>
              </CardHeader>

              {initialState.countProject != 0 ?
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Projects",
                        color: "hsl(var(--muted-foreground))",
                      },
                      Total: {
                        label: "Total",
                        color: "hsl(var(--chart-2))",
                      },
                      Completed: {
                        label: "Completed",
                        color: "hsl(var(--chart-1))",
                      },
                      "In Progress": {
                        label: "In Progress",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[280px] sm:h-[320px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={projectStats}
                        layout="vertical"           // ← makes labels easier to read
                        margin={{ left: 20, right: 30, top: 10, bottom: 10 }}
                      >
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" />

                        <XAxis type="number" hide={true} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          width={100}
                          fontSize={14}
                        />

                        <Tooltip content={<ChartTooltipContent />} cursor={false} />

                        <Bar
                          dataKey="value"
                          radius={[4, 4, 4, 4]}
                          barSize={36}
                        // fill is taken from data → fill property
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent> : (<div className="flex flex-col items-center justify-center text-center space-y-4">
                  {/* You can replace this src with your own Lottie, GIF or static image */}
                  <img
                    src="https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg"
                    alt="No projects created yet"
                    className="w-44 h-44 sm:w-52 sm:h-52 object-contain opacity-90"
                  />

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      No projects created yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Start by creating your first project to see progress and statistics here.
                    </p>
                  </div>
                </div>)

              }


            </Card>
            <Card className="col-span-3">

              <CardHeader>

                <CardTitle>
                  Task Status Distribution
                </CardTitle>

                <CardDescription>
                  Current status of all tasks
                </CardDescription>

              </CardHeader>

              <CardContent>
                {initialState.countTaskTODO == 0 && initialState.countProjectInProgress == 0 && initialState.countProjectCompleted == 0 ? (
                  <div className="flex flex-col items-center justify-center text-center space-y-6">
                    {/* Animated / Beautiful Empty Image */}
                    <div className="relative">
                      <img
                        src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg"
                        alt="No tasks found"
                        className="w-56 h-56 object-contain opacity-90"
                      />
                      {/* Optional floating icon */}
                      <div className="absolute -top-4 -right-4 bg-primary/10 text-primary rounded-full p-3 animate-bounce">
                        📋
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold text-foreground">
                        No tasks found
                      </h3>
                      <p className="text-muted-foreground max-w-sm">
                        This project doesn't have any tasks yet.<br />
                        Create your first task to get started.
                      </p>
                    </div>
                  </div>) :
                  <ChartContainer
                    config={{
                      todo: {
                        label: "To Do",
                        color: "#ef4444",
                      },
                      progress: {
                        label: "In Progress",
                        color: "#f59e0b",
                      },
                      done: {
                        label: "Done",
                        color: "#10b981",
                      },
                    }}
                    className="h-[300px]"
                  >

                    <ResponsiveContainer width="100%" height="100%">

                      <PieChart>

                        <Pie
                          data={taskStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >

                          {taskStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.fill}
                            />
                          ))}

                        </Pie>

                        <ChartTooltip content={<ChartTooltipContent />} />

                      </PieChart>

                    </ResponsiveContainer>

                  </ChartContainer>
                }
              </CardContent>

            </Card>

          </div>
        </aside>}

    </div>
  );
}