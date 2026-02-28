import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Search
} from 'lucide-react';
import debounce from 'lodash/debounce';
import { Pagination } from "@mui/material"
import { abuseReportList, searchApi, sendAbuse } from '../apis/workspaceapis';
import { useMember } from '../../Member/hooks/memeberhooks';
import { ToastContainer, toast } from 'react-toastify';
import apiService from '../../Services/apiServices/apiService';
import Tikets from '../../Admin/Pages/Tikets';

export default function AbuseReportForm() {
  const memeber = useMember();
  const [refresh,setRefresh]=useState(1);
const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    otherType: '',
    severity: '',
    description: '',
    reportedContent: ''
  });

  /* 🆕 Dummy Raised Tickets */
  const [tickets,setTickets] = useState([]);
  const [count,setCount]=useState()
useEffect(() => {
 

  const fetchReports = async () => {
    try {
      const response = await abuseReportList(
        memeber._id,
        memeber.workspace[0].workspaceId,
        1
      );
      setTickets(response?.data?.data ?? []);
      setCount(response.data.count)
    } catch (error) {
  
         if (error instanceof Error) {
      const message = error.message;
      toast.error(message)
    }else{
      toast.error("Failed to send report")
    }
    }
  };

  fetchReports();
}, [refresh, memeber?._id, memeber?.workspace]);


  const [search, setSearch] = useState('');

  const abuseTypes = ['Spam', 'Fraud', 'Harassment', 'Copyright', 'Inappropriate', 'Other'];
  const severityTypes = ['Critical', 'High', 'Medium', 'Low'];

  const handleSubmit = async (e) => {
    e.preventDefault();
 try {
  await sendAbuse(formData, memeber._id, memeber.workspace[0].workspaceId);
   toast.success('Report Sent');
 } catch (error) {
  
         if (error instanceof Error) {
      const message = error.message;
      toast.error(message)
    }else{
      toast.error("Failed to send report")
    }
    }

    
   

    setFormData({
      type: '',
      otherType: '',
      severity: '',
      description: '',
      reportedContent: ''
    });
    setRefresh(prev => prev + 1);
  };
const handleSerach = (e)=>{

  setSearch(e.target.value);
  if(filteredTickets.length==0){
    setLoading(true)
  }
  

}
//Debouse..
const debouncedSearch = debounce(async (searchQuery) => {
    if (!searchQuery) {
      setTickets([]);;
      setRefresh((prv)=>prv+1)
      return;
    }

    setLoading(true);
    try {
      

      const response = await searchApi(searchQuery,memeber.workspace[0].workspaceId,memeber._id,)
      setTickets(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, 300);


  useEffect(() => {
    debouncedSearch(search);
    // Cleanup debounce on unmount
    return () => debouncedSearch.cancel();
  }, [search]);


  //End Debousing.............
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleChangePage =async (page) =>{
    const response = await abuseReportList(
        memeber._id,
        memeber.workspace[0].workspaceId,
        page
      );
      setTickets(response?.data?.data ?? []);

}
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'High':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-700';
      case 'In Review':
        return 'bg-blue-100 text-blue-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.type.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer />

      <div className="max-w-4xl mx-auto space-y-8">

        {/* ================= FORM ================= */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800">Abuse Report</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Abuse Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Abuse Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-lg"
              >
                <option value="">Select type...</option>
                {abuseTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            {formData.type === 'Other' && (
              <input
                name="otherType"
                value={formData.otherType}
                onChange={handleChange}
                placeholder="Specify type"
                className="w-full border px-4 py-2 rounded-lg"
              />
            )}

            {/* Severity */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {severityTypes.map((severity) => (
                <button
                  key={severity}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity })}
                  className={`border rounded-lg py-2 ${
                    formData.severity === severity
                      ? getSeverityColor(severity)
                      : 'border-gray-300'
                  }`}
                >
                  {severity}
                </button>
              ))}
            </div>

            {/* Description */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the issue..."
              className="w-full border px-4 py-2 rounded-lg"
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
              Submit Report
            </button>
          </form>
        </div>

        {/* ================= RAISED TICKETS ================= */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Raised Tickets</h2>

            <div className="flex items-center gap-2 border px-3 py-1 rounded-lg">
              <Search size={16} />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => handleSerach(e)}
                className="outline-none"
              />
            </div>
          </div>

          {filteredTickets.length === 0  ? (
            <p className="text-gray-500 text-sm">No tickets found</p>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{ticket.type}</p>
                    <p className={`${getSeverityColor(ticket.severity)}`}>
                      Severity: {ticket.severity}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created: {ticket.createdAt}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        
        </div>
          <Pagination  component="div"
           count={Math.max(1, Math.ceil((count || 0) / 5))}
            onChange={(_, page) => handleChangePage(page)}
          
          />
      </div>
    </div>
  );
}
