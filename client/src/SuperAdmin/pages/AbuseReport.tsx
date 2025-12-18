import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Eye, Search, Clock, User, FileText } from 'lucide-react';
import { useFetchAbuseReportPageQuery, useUpdateAbuseReportStatusMutation } from '../apis/fetchApi';
import {Pagination} from "../../Custom/reusecomponents/Pagination"
import { toast } from 'react-toastify';
export  const AbuseReportsPage =()=> {
   const [page,setPage] = useState(1);
   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
      const [change,Setchange]=useState(1)

  const {data:reports,refetch,isLoading,error}=useFetchAbuseReportPageQuery({ page, limit: 5 })
  const  [updateReportStatus,   { isLoading: isUpdating } ] = useUpdateAbuseReportStatusMutation()
    useEffect(()=>{
refetch()
  },[])
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loadoooing posts</div>;
  

  // Mock data based on your structure
 
    
  //  const [reports,setReports]=useState([]);


   const count = Math.ceil((reports?.Data?.count ?? 0) / 5);
 
  // const [reports, setReports] = useState([
  //   {
  //     _id: '6924560d09e9a459517858a1',
  //     description: 'gdrdrgdr',
  //     type: 'Spam',
  //     userId: '692037f73049499ebf75a1b0',
  //     workspaceId: '692038083049499ebf75a1b4',
  //     severity: 'Critical',
  //     status: 'Waiting',
  //     createdAt: '2025-11-24T12:56:45.970+00:00',
  //     reportedBy: 'John Doe',
  //     reportedUserName: 'user_abc123'
  //   },
   
//   // ]);
// useEffect(() => {
//   refetch()
//   console.log(data.Data.reports,"reports")
//    setReports(data.Data.reports)
// }, [])
// //  setReports(data.Data.reports)
  

 

  const types = ['All', 'Spam', 'Harassment', 'Inappropriate Content', 'Other'];
  const severities = ['All', 'Low', 'Medium', 'High', 'Critical'];
  const statuses = ['All', 'Waiting', 'Under Review', 'Resolved', 'Dismissed','Rejected'];

  const getSeverityColor = (severity) => {
    const colors = {
      Low: 'bg-blue-50 text-blue-700 border-blue-200',
      Medium: 'bg-amber-50 text-amber-700 border-amber-200',
      High: 'bg-orange-50 text-orange-700 border-orange-200',
      Critical: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[severity] || 'bg-slate-50 text-slate-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      Waiting: 'bg-amber-50 text-amber-700 border-amber-200',
      UnderReview: 'bg-blue-50 text-blue-700 border-blue-200',
      Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Rejected: 'bg-slate-50 text-slate-700 border-slate-200'
    };
    return colors[status] || 'bg-slate-50 text-slate-700';
  };

  const filteredReports = reports.Data.reports.filter(report => {
    const matchesType = filterType === 'All' || report.type === filterType;
    const matchesSeverity = filterSeverity === 'All' || report.severity === filterSeverity;
    const matchesStatus = filterStatus === 'All' || report.status === filterStatus;
    const matchesSearch = report.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSeverity && matchesStatus && matchesSearch;
  });

  const handleStatusChange = async(reportId, report) => {
    try {
      await  updateReportStatus({reportId,report}).unwrap()
      toast.success("Report Updated")
      setSelectedReport(null)
      refetch()
    } catch (error) {
      console.log(error,"errr+++")
      toast.error(error.data.message)
    }

    setReports(reports.Data.reports.map(report => 
      report._id === reportId ? { ...report, status: newStatus } : report
    ));
    if (selectedReport && selectedReport._id === reportId) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
    
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


console.log(reports,"sfusefk")

  return (
  <div className="min-h-screen bg-gray-50">
     
 <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
      <div className="px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Review</p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {reports.Data.reports.filter(r => r.status === 'Waiting').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Under Review</p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {reports.Data.reports.filter(r => r.status === 'Under Review').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Resolved</p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {reports.Data.reports.filter(r => r.status === 'Resolved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Critical Cases</p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {reports.Data.reports.filter(r => r.severity === 'Critical').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reports by description or reporter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {types.map(type => <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>)}
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {severities.map(severity => <option key={severity} value={severity}>{severity === 'All' ? 'All Severities' : severity}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {statuses.map(status => <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>)}
            </select>
          </div>
        </div>

        {/* Reports List - Horizontal Cards */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report._id} className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="p-6">
                <div className="flex items-start justify-between gap-6">
                  {/* Left Section - Report Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        report.severity === 'Critical' ? 'bg-red-50' :
                        report.severity === 'High' ? 'bg-orange-50' :
                        report.severity === 'Medium' ? 'bg-amber-50' : 'bg-blue-50'
                      }`}>
                        <AlertTriangle className={`w-5 h-5 ${
                          report.severity === 'Critical' ? 'text-red-600' :
                          report.severity === 'High' ? 'text-orange-600' :
                          report.severity === 'Medium' ? 'text-amber-600' : 'text-blue-600'
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded border ${getSeverityColor(report.severity)}`}>
                            {report.severity}
                          </span>
                          <span className="px-2.5 py-1 text-xs font-medium rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {report.type}
                          </span>
                          <span className={`px-2.5 py-1 text-xs font-medium rounded border ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                          <span className="text-xs text-slate-500">ID: {report._id.slice(-8)}</span>
                        </div>

                        <p className="text-slate-900 font-medium mb-2">{report.description}</p>

                        <div className="flex items-center gap-6 text-sm text-slate-600">
                         
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>User: <span className="font-mono text-xs">{report.userName}</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(report.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No reports found</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-900">Report Details</h2>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Status Badges */}
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 text-sm font-medium rounded border ${getSeverityColor(selectedReport.severity)}`}>
                      {selectedReport.severity} Severity
                    </span>
                    <span className="px-3 py-1.5 text-sm font-medium rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {selectedReport.type}
                    </span>
                    <span className={`px-3 py-1.5 text-sm font-medium rounded border ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Report Description</label>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-slate-900">{selectedReport.description}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Report ID</label>
                      <p className="text-sm font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200">{selectedReport._id}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Reported User</label>
                      <p className="text-sm font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200">{selectedReport.userName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
                      <p className="text-sm font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200">{selectedReport.userId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Workspace ID</label>
                      <p className="text-sm font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200">{selectedReport.workspaceId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Created At</label>
                      <p className="text-sm bg-slate-50 px-3 py-2 rounded border border-slate-200">{formatDate(selectedReport.createdAt)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Change Status</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusChange(selectedReport._id, {status:'Under Review',userId:selectedReport.userId,workspaceId:selectedReport.workspaceId,description:selectedReport.description})}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark Under Review
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedReport._id, {status:'Resolved',userId:selectedReport.userId,workspaceId:selectedReport.workspaceId,description:selectedReport.description})}
                        className="flex-1 px-4 py-3 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Mark as Resolved
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedReport._id,{status:'Dismissed',userId:selectedReport.userId,workspaceId:selectedReport.workspaceId,description:selectedReport.description})}
                        className="flex-1 px-4 py-3 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Dismiss Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <Pagination currentPage={page} totalPages={count}onPageChange={setPage} maxVisible={count}/> */}
      </main>
      
    </div>
  );
};

