import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import { sendAbuse } from '../apis/workspaceapis';
import { useMember } from '../../Member/hooks/memeberhooks';
import { ToastContainer,toast } from 'react-toastify';
export default function AbuseReportForm() {
  const memeber=useMember()
  console.log(memeber,"memeberss")
  const [formData, setFormData] = useState({
    type: '',
    otherType:'',
    severity: '',
    description: '',
    reportedContent: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const abuseTypes = ['Spam', 'Fraud', 'Harassment', 'Copyright', 'Inappropriate','Other'];
  const severityTypes = ['Critical', 'High', 'Medium', 'Low'];


  const handleSubmit = async(e) => {
    e.preventDefault();
  const status= await  sendAbuse(formData,memeber._id)
  if(status==201) {
    toast.success("Report send")
  }else{
    toast.error("Failed to send")
  }
setFormData({description:"",otherType:"",reportedContent:"",severity:"",type:""})
    console.log(formData)
    // setSubmitted(true);
    // setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

 

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800">Abuse Report</h1>
          </div>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Report submitted successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Abuse Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abuse Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type...</option>
                {abuseTypes.map(type => (
                  <option key={type}  value={type}>{type}</option>
                ))}
              </select>
            </div>
            {/* other */}
{formData.type === "Other" && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Other *
    </label>
    <input
      type="text"
      name="Specify type"
      value={formData.otherType}
      onChange={handleChange}
      placeholder="Specify Type"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
)}

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {severityTypes.map(severity => (
                  <button
                    key={severity}
                    type="button"
                    onClick={() => setFormData({...formData, severity})}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      formData.severity === severity
                        ? getSeverityColor(severity)
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>

           
           

         
          

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Provide details about the abuse..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Submit Report
            </button>
          </form>

          {/* Report Summary */}
          {(formData.type || formData.severity || formData.status) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Report Summary</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {formData.type && <div><span className="font-medium">Type:</span> {formData.type}</div>}
                {formData.severity && <div><span className="font-medium">Severity:</span> {formData.severity}</div>}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}