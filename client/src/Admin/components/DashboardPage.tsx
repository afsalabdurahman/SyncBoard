import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Users, FolderOpen, AlertTriangle, CheckCircle } from "lucide-react";
import { useEffect } from "react";
const taskStatusData = [
  { name: "To Do", value: 12, fill: "#ef4444" },
  { name: "In Progress", value: 8, fill: "#f59e0b" },
  { name: "Done", value: 15, fill: "#10b981" },
];

const projectProgressData = [
  { name: "Jan", completed: 4, total: 6 },
  { name: "Feb", completed: 6, total: 8 },
  { name: "Mar", completed: 8, total: 10 },
  { name: "Apr", completed: 5, total: 7 },
  { name: "May", completed: 9, total: 12 },
  { name: "Jun", completed: 7, total: 9 },
];
import { useSelector, useDispatch } from "react-redux";
import apiService from "../../services/api";
import { setUsers } from "../../Redux/features/AlluserSlice";
export function DashboardPage() {
  let initialState = useSelector((state: any) => {
    console.log(state, "state");
    let countProject = state.projects.list.length;
    let countMembers = state.workspace.workspace.members.length;
    return {
      countProject: countProject,
      countMembers: countMembers,
    };
  });

  //useEffetct
  let dispacth = useDispatch();
  const workspaceslug = useSelector(
    (state: any) => state.workspace.workspace.slug
  );
  console.log(workspaceslug,"Slug value")
  useSelector((state) => {
    console.log(state, "++++++++");
  });

  useEffect(() => {
    if (!workspaceslug) return; // prevent empty request

    apiService
      .get(`workspace/member/data/${workspaceslug}`)
      .then((response) => {
        console.log(response.data, "data fetch from api+++");
         dispacth(setUsers(response.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [workspaceslug]);

  //

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Projects
            </CardTitle>
            <FolderOpen className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {initialState.countProject}
            </div>
            <p className='text-xs text-muted-foreground'>+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Team Members</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {initialState.countMembers - 1}
            </div>
            <p className='text-xs text-muted-foreground'>+3 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Overdue Tasks</CardTitle>
            <AlertTriangle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0</div>
            <p className='text-xs text-muted-foreground'>-2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Completed Tasks
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0</div>
            <p className='text-xs text-muted-foreground'>+12 this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>
              Monthly project completion overview
            </CardDescription>
          </CardHeader>
          <CardContent className='pl-2'>
            <ChartContainer
              config={{
                completed: {
                  label: "Completed",
                  color: "hsl(var(--chart-1))",
                },
                total: {
                  label: "Total",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className='h-[300px]'
            >
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={projectProgressData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey='completed' fill='var(--color-completed)' />
                  <Bar
                    dataKey='total'
                    fill='var(--color-total)'
                    opacity={0.3}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Current status of all tasks</CardDescription>
          </CardHeader>
          <CardContent>
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
              className='h-[300px]'
            >
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
