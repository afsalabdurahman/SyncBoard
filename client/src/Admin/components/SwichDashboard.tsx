import  { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  
  CardHeader,
  CardTitle,
} from "../../Custom/ui/card";
import { Users, FolderOpen, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import{ProjectProgressCard} from "./ProjectProgressCard"
import { MembersCard } from './SProjectMembersList';
import { STaskBoard } from './STaskshows';
import { BurndownChart } from './SBurnoutChart';
import { TaskDistribution } from './STaskStatus';
import { TaskApprovalSection } from './StaskApproval';
import { projectSpecifyDashboard } from '../apis/dashboardApi';
import { setTitle } from '../../Redux/feature/ForwardSlice';
import { useDispatch } from 'react-redux';
interface props{
name:string,
_id:string
}

function SwichDashboard({selectedProject}:props) {
const [dashboardCard, setDashboardCard] = useState(null);
const [taskDistribution, setTaskDistribution] = useState(null);
const [memebrList, setMemebrList] = useState([]);
const [burnDown, setBurnDown] = useState([]);
const [taskList, setTaskList] = useState([]);
const [approvalData, setApprovalData] = useState(null);
const dispatch = useDispatch()

useEffect(() => {

  async function fecthProjectDashboard(selectedProject: string) {
    const result = await projectSpecifyDashboard(selectedProject);

    if (!result) return;

    if (result[0].status === "fulfilled") {
      setDashboardCard(result[0].value.data);
    }

    if (result[1].status === "fulfilled") {
      setTaskDistribution(result[1].value.data);
    }

    if (result[2].status === "fulfilled") {
      setMemebrList(result[2].value.data);
    }

    if (result[3].status === "fulfilled") {
      setBurnDown(result[3].value.data);
    }

    if (result[4].status === "fulfilled") {
      setTaskList(result[4].value.data);
    }

    if (result[5]?.status === "fulfilled") {
      setApprovalData(result[5].value.data);
    }
  }

  if (selectedProject) {
    fecthProjectDashboard(selectedProject);
  }
}, [selectedProject]);




  return (
    <div >
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Task
            </CardTitle>

            <FolderOpen className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardCard?.total_task}
            </div>

           

          </CardContent>
        </Card>

        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium">
               Members
            </CardTitle>

            <Users className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">
              {dashboardCard?.total_members}
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
              {dashboardCard?.overdue_task}
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
              {dashboardCard?.completed_task}
            </div>

         

          </CardContent>

        </Card>

      </div>
      {/* over all progress bar ........................... */}
<div className="w-full mt-5 rounded-3xl bg-gray-100 p-6">
  <div className="grid grid-cols-3 gap-6 items-stretch">
    
    <div className="w-full h-full">
     <ProjectProgressCard
  totalTask={dashboardCard?.total_task}
  completedTask={dashboardCard?.completed_task}
  projectProgress={dashboardCard?.projectProgress}
/>
    </div>

    <div className="w-full h-full">
      <TaskDistribution taskDistribution={taskDistribution} />
    </div>

    <div className="w-full h-full">
      <MembersCard memebrList={memebrList} />
    </div>

  </div>
</div>
 <div className="w-full mt-5 rounded-3xl bg-gray-100 p-6">
  <BurndownChart burndown={burnDown}/>
 </div>

 {/* cut */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-5 w-full">

  {/* Daily Updates - Task Board */}
  <div className="rounded-3xl bg-white shadow-md border border-gray-200 p-6">

    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
        Daily Updates
      </h2>

      <button
      
        onClick={() => dispatch(setTitle("tasks"))}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
      >
        View Tasks
        <ArrowRight size={16} />
      </button>
    </div>

    <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      <STaskBoard taskList={taskList} />
    </div>
  </div>


  {/* Daily Updates - Approval Board */}
  <div className="rounded-3xl bg-white shadow-md border border-gray-200 p-6">

    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
        Daily Updates
      </h2>

      <button
        onClick={() => dispatch(setTitle("approval"))}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
      >
        View Approvals
        <ArrowRight size={16} />
      </button>
    </div>

    <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      <TaskApprovalSection approvalData={approvalData} />
    </div>
  </div>

</div>
 
    {/* end Prohect progress */}
    
    </div>
  )
}

export default SwichDashboard
