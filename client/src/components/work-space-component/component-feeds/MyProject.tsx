import React, { use, useEffect, useState } from "react";
import {
  Search,
  Calendar,
  Users,
  Star,
  Filter,
  MoreVertical,
  Clock,
  User,
} from "lucide-react";
import apiService from "../../../services/api";
import { useSelector, useDispatch } from "react-redux";
import ProjectDetailsPage from "./ProjectDetailsPage";
import {
  addProject,
  updateProject,
  removeProject,
  fetchProjectData,
} from "../../../Redux/workspace/admin/ProjectSlice";
import { socket } from "../../../services/socket";
import {setTasks} from "../../../Redux/workspace/admin/TaskSlice"

const MyProject = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [displayCount, setDisplayCount] = useState(3);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);
  
const initialProjects=useSelector((state)=>{
  return state.projects.list
})
  let userName = useSelector((state: any) => {
    return state.user.user.name;
  });
  const [projects, setProjects] = useState(initialProjects);
  console.log(projects, "newProjects");
  // useEffect(() => {
  //   apiService.get("/projects")
  //     .then((response) => {
  //       console.log(response.data, "response from axios");
  //       console.log(userName, "username");

  //       const myProjectsData = response.data.AllProjects.filter((project) =>
  //         project.assignedUsers.includes(userName)
  //       );

  //       setProjects(myProjectsData);
  //       console.log(myProjectsData, "my projectData");
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, [userName]);

  useEffect(() => {
     if (!userName) return;
    dispatch(fetchProjectData());
 apiService.get(`/task/mytask/${userName}`).then((response)=>{
 dispatch(setTasks(response.data))
      })
  }, [dispatch,userName]);
 
  
  console.log(projects, "usestateproje");

  const filteredProjects = (projects ?? []).filter(
    (project: { name: string; description: string; status: null }) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || project.status === filterStatus;
      return matchesSearch && matchesFilter;
    }
  );
  console.log(filteredProjects, "filterd projwcta");

  const displayedProjects = filteredProjects.slice(0, displayCount);
  const hasMoreProjects = filteredProjects.length > displayCount;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const showProjects = (projectName) => {
    setShowProjectDetails(true);
    if (!projects) return;
    projects.filter((project) => {
      if (project.name === projectName) {
        setProjectDetails(project);
      }
    });
  };

  if (showProjectDetails) {
    return (
      <div className='min-h-screen bg-gray-50 p-5 mt-6'>
        <ProjectDetailsPage
          setShowProjectDetails={setShowProjectDetails}
          projectDetails={projectDetails}
        />
      </div>
    );
  } else {
    return (
      <div className='min-h-screen bg-gray-50 p-6 '>
        <div className='max-w-7xl mx-auto '>
          {/* Header */}
          <div className='mt-5'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>
              My Projects
            </h2>
          </div>

          {/* Search and Filter Bar */}
          <div className='mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between'>
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Search projects...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div className='flex gap-3'>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='all'>All Status</option>
                <option value='active'>Active</option>
                <option value='pending'>Pending</option>
                <option value='completed'>Completed</option>
              </select>

              <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'>
                <Filter className='w-4 h-4' />
                Filter
              </button>
            </div>
          </div>

          {/* Projects Grid */}

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {projects?.map((project) => (
              <div
                key={project.id}
                className='bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200'
              >
                {/* Project Header */}
                <div className='p-6 pb-4'>
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`w-3 h-3 rounded-full ${getPriorityColor(
                          project.priority
                        )}`}
                      ></div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2'>
                    {project.name}
                  </h3>
                  <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                    {project.description}
                  </p>

                  {/* Progress Bar */}
                  <div className='mb-4'>
                    <div className='flex justify-between items-center mb-1'>
                      <span className='text-sm font-medium text-gray-700'>
                        Progress
                      </span>
                      <span className='text-sm text-gray-500'>
                        {project.progress}0%
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-blue-1 h-2 rounded-full transition-all duration-300'
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className='px-6 pb-4'>
                  {/* Dates */}
                  <div className='flex items-center gap-4 mb-4 text-sm text-gray-500'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='w-4 h-4' />
                      <span>Due: {formatDate(project.deadline)}</span>
                    </div>

                    <div className='flex items-center gap-1'>
                      <Clock className='w-4 h-4' />
                      <span>Started: not yet</span>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Users className='w-4 h-4 text-gray-500' />
                      <span className='text-sm text-gray-500'>
                        Team ({project.assignedUsers.length})
                      </span>
                    </div>
                    {/* <div className="flex -space-x-2">
                    {project.assignedUsers.slice(0, 4).map((name, index) => (
                      <div
                        key={member.id}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                        title={`${member.name} - ${member.role}`}
                      >
                        {member.avatar}
                      </div>
                    ))}
                    {project.members.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                        +{project.members.length - 4}
                      </div>
                    )}
                  </div> */}
                  </div>
                </div>

                {/* Project Footer */}
                <div className='px-6 py-3 bg-gray-50 rounded-b-xl '>
                  <button
                    onClick={() => showProjects(project.name)}
                    className='w-full text-blue-600 hover:text-blue-700 font-medium text-sm py-1 hover:bg-blue-50 rounded transition-colors cursor-pointer hover:bg-gray-100 transition-colors'
                  >
                    View Project Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {hasMoreProjects && (
            <div className='text-center mt-8'>
              <button
                onClick={() => setDisplayCount((prev) => prev + 3)}
                className='px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium'
              >
                Show More Projects ({filteredProjects.length - displayCount}{" "}
                remaining)
              </button>
            </div>
          )}

          {/* Empty State */}
          {projects && projects.length === 0 && (
            <div className='text-center py-12'>
              <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                <Search className='w-12 h-12 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No projects found
              </h3>
              <p className='text-gray-500'>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default MyProject;
