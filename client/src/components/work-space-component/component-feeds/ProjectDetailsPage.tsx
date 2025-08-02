import React, { useState, useEffect } from 'react';
import { formatDate } from '../../../services/Dateformate';
import { 
  Calendar, 
  Users, 
  Clock, 
  FileImage,
  CheckCircle2, 
  AlertCircle, 
  User, 
  MessageSquare, 
  FileText, 
  MoreVertical,
  Plus,
  Filter,
  Search,
  Upload,
  Download,
  Star,
  X,
  GitBranch
} from 'lucide-react';
import apiService from '../../../services/api';
import { setUserData } from '../../../Redux/features/UserDataSlice';
import { useSelector } from 'react-redux';

const ProjectDetailsPage = (props:any) => {
  
  const projectId=props.projectDetails._id
  console.log(projectId,"projrctId")

const allTask=useSelector((state)=>{
 return state.task.tasks
})
console.log(allTask,"alllTasks")

const myProjectTasks=allTask.filter((task)=>task.projectId==projectId)
console.log(myProjectTasks,"mytas0000000k%%%%%%%%kss")



  const [activeTab, setActiveTab] = useState('overview');
  const [taskFilter, setTaskFilter] = useState('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const[task1,setTask1]=useState(null)
  const[projectAdminName,setProjectAdminName]=useState(null);
  //find pdf or image
  const isImage = (filename: string) =>/\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
const isPdf = (filename: string) => /\.pdf$/i.test(filename);
let hasPdf = false;
let hasImage = false;

if(props.projectDetails){
 hasPdf = props?.projectDetails.attachedUrl.some(isPdf);
 hasImage = props?.projectDetails.attachedUrl.some(isImage);
}
let pdfArray=props?.projectDetails.attachedUrl.map((url:string)=>{
  if(url.includes(".pdf")){
    return url
  }
})
console.log(pdfArray,"arry pdf")
let imageArry = props.projectDetails.attachedUrl?.filter((url: string) =>
  url.includes(".jpg") || url.includes(".png")
);
console.log(imageArry,pdfArray)
//Define task
let tasks = [
    { id: 1, title: 'Design Homepage Layout', assignee: 'Maria Garcia', status: 'completed', priority: 'high', dueDate: '2024-06-15' },
    { id: 2, title: 'Implement User Authentication', assignee: 'Alex Chen', status: 'in-progress', priority: 'high', dueDate: '2024-06-18' },
    { id: 3, title: 'Setup Database Schema', assignee: 'David Kim', status: 'completed', priority: 'medium', dueDate: '2024-06-12' },
    { id: 4, title: 'Write API Documentation', assignee: 'David Kim', status: 'To Do', priority: 'Low', dueDate: '2024-06-25' },
    { id: 5, title: 'Mobile Responsive Testing', assignee: 'Emma Wilson', status: 'in-progress', priority: 'medium', dueDate: '2024-06-20' }
  ];
//setTask1(tasks)
//
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await apiService.get(`/user/data/${props.projectDetails.projectAdminId}`);
//       console.log(response, "++++++response");
//       // You can also update state if needed
//        setProjectAdminName(response.data.user[0].name);
//        const mytask:any= await apiService.get(`/user/project/task/${props.projectDetails.id}`)
//        console.log(mytask,"my task from ziox")
//  if (mytask) {
//   const updatedTasks = mytask.data.map((task: any) => ({
//     title: task.name,
//     assignee: task.assignedTo,
//     status: task.status === "To Do" ? "todo" : 
//             task.status === "In Progress" ? "in-progress" :
//             task.status === "Completed" ? "completed" : "completed",
//     priority: task.priority === "Medium" ? "medium" : task.priority,
//     dueDate: formatDate(task.deadline)
//   }));
//   // If you want to update the tasks state, use setTask1 or another state setter
//   // setTask1(updatedTasks);
//   // If you want to overwrite the tasks array, you should define it as a state variable
//   // For now, just log or use updatedTasks as needed
//   console.log(updatedTasks, "updated tasks");
//   tasks=[...updatedTasks]
//   setTask1(tasks)
//  }
     
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   fetchData();
// }, [props.projectId]);

console.log(tasks,"tsksssss+++++++")
  // Mock project data
  const projectData = {
    id: 'PRJ-001',
    name: 'E-Commerce Platform Redesign',
    description: 'Complete redesign of the company e-commerce platform with modern UI/UX, improved performance, and mobile responsiveness.',
    status: 'In Progress',
    priority: 'High',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    progress: 0,
    budget: '$125,000',
    spent: '$81,250',
    manager: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: '/api/placeholder/40/40'
    },
    client: 'TechCorp Solutions',
    
  };
console.log(projectAdminName,"Admin name")
  

  

 

  const getStatusColor = (status:any) => {
    console.log(status,"my status")
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'To Do': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredTasks = (task1 ?? []).filter(task => {
    if (taskFilter === 'all') return true;
    return task.status === taskFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">{props.projectDetails.name}</h1>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {projectData.status}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              
              <button  onClick={()=>props.setShowProjectDetails(false)}
      className="p-2 rounded-full hover:bg-red-200 transition duration-200"
      aria-label="Close"
    >
      <X className="w-5 h-5 text-gray-700" />
               
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Overview Cards - Vertical Layout */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">End Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(props.projectDetails.deadline)}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-lg font-semibold text-gray-900">{props.projectDetails.status=="Planning"?"0%":"10%"}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 flex-shrink-0">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Team Size</p>
                <p className="text-lg font-semibold text-gray-900">{props.projectDetails.assignedUsers.length} Members</p>
              </div>
            </div>

         
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'tasks', 'team', 'files', ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Project Description */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h3>
                  <p className="text-gray-600 leading-relaxed">{props.projectDetails.description}</p>
                  
                  
                </div>

                {/* Progress Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-1 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${projectData.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">0% Planning</p>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  
                  
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <select 
                        value={taskFilter} 
                        onChange={(e) => setTaskFilter(e.target.value)}
                        className="border rounded-lg px-3 py-1"
                      >
                        <option value="all">All Tasks</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="divide-y">
                  {myProjectTasks.map((task,index) => (
                    <div key={index} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{task.name}</h4>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </span>
                            <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority} priority
                            </span>
                            <span className="text-sm text-gray-500">Due: {task.deadline}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{task.assignedUser}</span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                </div>
                <div className="divide-y">
                  {props.projectDetails.assignedUsers.map((member) => (
                    <div  className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                           
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{member}</h4>
                            {/* <p className="text-sm text-gray-600">{member.role}</p> */}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Project Files</h3>
                    
                  </div>
                </div>
<div className="p-6">
  {/* pdf */}
  {props.projectDetails.attachedUrl ? (
    <div className="flex flex-col gap-4">
      {/* PDF Icon */}
      {pdfArray && pdfArray.filter(Boolean).map((pdfUrl: string, idx: number) => (
        <div key={`pdf-${idx}`} className="flex items-center gap-1 text-red-600">
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer"> <FileText size={28} strokeWidth={1.5} /></a>
         
          <span className="text-sm">pdf</span>
        </div>
      ))}
      {/* Image Icon */}
      {imageArry && imageArry.map((imageUrl: string, idx: number) => (
        <div key={`img-${idx}`} className="flex items-center gap-1 text-blue-500">
           <a href={imageUrl} target="_blank" rel="noopener noreferrer">      <FileImage size={28} strokeWidth={1.5} /></a>
    
          <span className="text-sm">image</span>
        </div>
      ))}
    </div>
  ) : null}
</div>
              </div>
            )}

            {/* {activeTab === 'activity' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="divide-y">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-6">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Project Manager</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-900">{projectAdminName?projectAdminName:null}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Client</p>
                  <p className="text-sm text-gray-900">{props.projectDetails.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Priority</p>
                  <span className={`text-sm font-medium ${getPriorityColor(projectData.priority.toLowerCase())}`}>
                    {props.projectDetails.preiority}
                  </span>
                </div>
               
              </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Discussion
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Create Branch
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;