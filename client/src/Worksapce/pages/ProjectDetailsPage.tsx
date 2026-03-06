import React, { useState, useEffect } from "react";
import { formatDate } from "../../Utility/dateformate";
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
  GitBranch,
} from "lucide-react";
import apiService from "../../Services/apiServices/apiService";
import { setUserData } from "../../Redux/feature/user/userSlice";
import { useSelector } from "react-redux";

const ProjectDetailsPage = (props: any) => {
  const [myTasks, setMytask] = useState([]);
  const [taskFilter, setTaskFilter] = useState("all");
  const projectId = props.projectDetails._id;
  useEffect(() => {
    apiService.get(`task/project/${projectId}?filter=${taskFilter}`).then((res) => {

      setMytask(res.data);
    });
  }, [projectId,taskFilter]);
  const [progress, setProgress] = useState();
  const total = myTasks.length;
 const completed = myTasks.filter(
  (task) => task.status === "Completed"
);
  const allTask = useSelector((state) => {
    return state.task.tasks;
  });
  const totalProgress = Math.round((completed.length / total) * 100);

  

  const [activeTab, setActiveTab] = useState("overview");
  
  const [showAddTask, setShowAddTask] = useState(false);
  const [task1, setTask1] = useState(null);
  const [projectAdminName, setProjectAdminName] = useState(null);

  //find pdf or image
  const isImage = (filename: string) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
  const isPdf = (filename: string) => /\.pdf$/i.test(filename);
  let hasPdf = false;
  let hasImage = false;

  if (props.projectDetails) {
    hasPdf = props?.projectDetails.attachedUrl.some(isPdf);
    hasImage = props?.projectDetails.attachedUrl.some(isImage);
  }
  const pdfArray = props?.projectDetails.attachedUrl.map((url: string) => {
    if (url.includes(".pdf")) {
      return url;
    }
  });

  const imageArry = props.projectDetails.attachedUrl?.filter(
    (url: string) => url.includes(".jpg") || url.includes(".png") ||url.includes(".webp")
  );
  
  //Define task
  const tasks = [
    {
      id: 1,
      title: "Design Homepage Layout",
      assignee: "Maria Garcia",
      status: "completed",
      priority: "high",
      dueDate: "2024-06-15",
    },
    {
      id: 2,
      title: "Implement User Authentication",
      assignee: "Alex Chen",
      status: "in-progress",
      priority: "high",
      dueDate: "2024-06-18",
    },
    {
      id: 3,
      title: "Setup Database Schema",
      assignee: "David Kim",
      status: "completed",
      priority: "medium",
      dueDate: "2024-06-12",
    },
    {
      id: 4,
      title: "Write API Documentation",
      assignee: "David Kim",
      status: "To Do",
      priority: "Low",
      dueDate: "2024-06-25",
    },
    {
      id: 5,
      title: "Mobile Responsive Testing",
      assignee: "Emma Wilson",
      status: "in-progress",
      priority: "medium",
      dueDate: "2024-06-20",
    },
  ];

 

 
  const projectData = {
    id: "PRJ-001",
    name: "E-Commerce Platform Redesign",
    description:
      "Complete redesign of the company e-commerce platform with modern UI/UX, improved performance, and mobile responsiveness.",
    status: "In Progress",
    priority: "High",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    progress: 0,
    budget: "$125,000",
    spent: "$81,250",
    manager: {
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      avatar: "/api/placeholder/40/40",
    },
    client: "TechCorp Solutions",
  };


  const getStatusColor = (status: any) => {
    
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "To Do":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredTasks = (task1 ?? []).filter((task) => {
    if (taskFilter === "all") return true;
    return task.status === taskFilter;
  });

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-4'>
              <h1 className='text-2xl font-bold text-gray-900'>
                {props.projectDetails.name}
              </h1>
              <span className='px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                {projectData.status}
              </span>
            </div>
            <div className='flex items-center space-x-3'>
              <button
                onClick={() => props.setShowProjectDetails(false)}
                className='p-2 rounded-full hover:bg-red-200 transition duration-200'
                aria-label='Close'
              >
                <X className='w-5 h-5 text-gray-700' />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Project Overview Cards - Vertical Layout */}
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <div className='space-y-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-blue-100 flex-shrink-0'>
                <Calendar className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>End Date</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {formatDate(props.projectDetails.deadline)}
                </p>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-green-100 flex-shrink-0'>
                <CheckCircle2 className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Progress</p>
                <p className='text-lg font-semibold text-gray-900'>
               {`${totalProgress?totalProgress:0}% `}
                </p>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-purple-100 flex-shrink-0'>
                <Users className='h-6 w-6 text-purple-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Team Size</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {props.projectDetails.assignedUsers.length} Members
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='border-b border-gray-200 mb-8'>
          <nav className='-mb-px flex space-x-8'>
            {["overview", "tasks", "team", "files"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {activeTab === "overview" && (
              <div className='space-y-6'>
                {/* Project Description */}
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Project Description
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    {props.projectDetails.description}
                  </p>
                </div>

                {/* Progress Chart */}
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Project Progress
                  </h3>
                  <div className='w-full bg-gray-200 rounded-full h-4'>
                    <div
                      className='bg-blue-500 h-4 rounded-full transition-all duration-300'
                      style={{ width: `${totalProgress?totalProgress:0}%` }}
                    ></div>
                  </div>
                  <p className='text-sm text-gray-600 mt-2'>
                    {`${totalProgress?totalProgress:0}% `}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className='bg-white rounded-lg shadow'>
                <div className='p-6 border-b'>
                  <div className='flex items-center space-x-4 mt-4'>
                    <div className='flex items-center space-x-2'>
                      <Filter className='h-4 w-4 text-gray-400' />
                      <select
                        value={taskFilter}
                        onChange={(e) => setTaskFilter(e.target.value)}
                        className='border rounded-lg px-3 py-1'
                      >
                        <option value='all'>All Tasks</option>
                        <option value='To Do'>To Do</option>
                        <option value='In Progress'>In Progress</option>
                        <option value='completed'>Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg bg-white">

  {/* Header */}
  <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
    <h3 className="font-semibold text-gray-800">
      My Tasks ({myTasks.length})
    </h3>
  </div>

  {/* Scrollable Container */}
  <div className="max-h-[500px] overflow-y-auto divide-y">

    {myTasks.length === 0 && (
      <div className="p-8 text-center text-gray-500">
        No tasks available
      </div>
    )}

    {myTasks.map((task) => (
      <div
        key={task.id}   // ⚠️ Use unique id instead of index
        className="p-5 hover:bg-gray-50 transition"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* Left Section */}
          <div className="flex-1 min-w-0">
            
            {/* Task Name */}
            <h4 className="font-medium text-gray-900 truncate">
              {task.name}
            </h4>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">

              {/* Status */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status.replace("-", " ")}
              </span>

              {/* Priority */}
              <span
                className={`font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority} Priority
              </span>

              {/* Deadline */}
              <span className="text-gray-500">
                Due: {task.deadline}
              </span>

            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 shrink-0">

            <span className="text-sm text-gray-600 truncate max-w-[120px]">
              {task.assignedUser}
            </span>

            <button className="p-2 rounded-md hover:bg-gray-200 transition">
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>

          </div>
        </div>
      </div>
    ))}
  </div>
</div>
              </div>
            )}

            {activeTab === "team" && (
              <div className='bg-white rounded-lg shadow'>
                <div className='p-6 border-b'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Team Members
                  </h3>
                </div>
               <div className="border rounded-lg">
  <div className="p-4 border-b bg-gray-50">
    <h3 className="font-semibold text-gray-800">
      Assigned Members ({props.projectDetails.assignedUsers.length})
    </h3>
  </div>

  <div className="max-h-[350px] overflow-y-auto divide-y">
    {props.projectDetails.assignedUsers.map((member: string, index: number) => {
      
      const initials = member
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

      return (
        <div
          key={`${member}-${index}`}
          className="p-4 hover:bg-gray-50 transition"
        >
          <div className="flex items-center justify-between">
            
            <div className="flex items-center space-x-4">
              
              {/* Avatar */}
              <div className="h-10 w-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                {initials}
              </div>

              {/* User Info */}
              <div>
                <h4 className="font-medium text-gray-900">
                  {member}
                </h4>
                <p className="text-sm text-gray-500">
                  Team Member
                </p>
              </div>

            </div>

          </div>
        </div>
      );
    })}
  </div>
</div>
              </div>
            )}

            {activeTab === "files" && (
              <div className='bg-white rounded-lg shadow'>
                <div className='p-6 border-b'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Project Files
                    </h3>
                  </div>
                </div>
              <div className="p-6">
  {props.projectDetails.attachedUrl && (
    <div className="space-y-8">

      {/* 📄 PDF Section */}
      {pdfArray?.filter(Boolean).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            PDF Files ({pdfArray.length})
          </h3>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {pdfArray
              .filter(Boolean)
              .map((pdfUrl: string, index: number) => (
                <a
                  key={`pdf-${index}`}
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[140px] flex-shrink-0 flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <FileText
                    size={40}
                    strokeWidth={1.5}
                    className="text-red-500"
                  />
                  <span className="mt-2 text-sm font-medium">
                    PDF {index + 1}
                  </span>
                </a>
              ))}
          </div>
        </div>
      )}

      {/* 🖼 Image Section */}
      {imageArry?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Images ({imageArry.length})
          </h3>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {imageArry.map((imageUrl: string, index: number) => (
              <a
                key={`img-${index}`}
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[200px] flex-shrink-0 group"
              >
                <div className="relative overflow-hidden rounded-lg border">
                  <img
                    src={imageUrl}
                    alt={`Project Image ${index + 1}`}
                    className="w-[200px] h-[150px] object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <p className="mt-2 text-sm text-center font-medium">
                  Image {index + 1}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )}
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
          <div className='space-y-6'>
            {/* Project Info */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Project Information
              </h3>
              <div className='space-y-4'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Project Manager
                  </p>
                  <div className='flex items-center space-x-2 mt-1'>
                    <div className='h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center'>
                      <User className='h-3 w-3 text-gray-600' />
                    </div>
                    <span className='text-sm text-gray-900'>
                      {projectAdminName ? projectAdminName : null}
                    </span>
                  </div>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Client</p>
                  <p className='text-sm text-gray-900'>
                    {props.projectDetails.clientName}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Priority</p>
                  <span
                    className={`text-sm font-medium ${getPriorityColor(
                      projectData.priority.toLowerCase()
                    )}`}
                  >
                    {props.projectDetails.preiority}
                  </span>
                </div>
              </div>
            </div>

        
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
