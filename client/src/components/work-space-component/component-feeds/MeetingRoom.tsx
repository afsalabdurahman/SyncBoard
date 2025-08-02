import { useEffect, useState } from "react";
import { Search, UserPlus, Link, User, Users } from "lucide-react";
import { socket } from "../../../services/socket";
import { useSelector } from "react-redux";
import apiService from "../../../services/api";
import axios, { AxiosResponse } from "axios";
import { stat } from "fs";
export default function MeetingRoom() {
  const workspaceSlug = useSelector(
    (state: any) => state.workspace.workspace.slug
  );
  console.log(workspaceSlug, "slug name");
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (!workspaceSlug) return; // prevent empty request

    apiService
      .get(`workspace/member/data/${workspaceSlug}`)
      .then((response) => {
        console.log(response, "response dat from meeting rroom");
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error,"from meetingroom");
      });
  }, []); // ✅ Re-run if workspaceSlug changes

  const [searchQuery, setSearchQuery] = useState("");

  const handleConnect = () => {
    // Handler for connect button
    console.log("Connecting to meeting...");
  };

  return (
    <div className='mt-8 w-full  bg-slate-50 min-h-screen p-4 max-w-[1000px] mx-auto  '>
      <div className='max-w-[60rem] mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-xl font-semibold text-slate-800'>Meeting Room</h1>
          <div className='bg-white p-1 rounded-full shadow-sm'>
            <Users size={20} className='text-indigo-600' />
          </div>
        </div>

        {/* Search Bar */}
        <div className='relative mb-6'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search size={18} className='text-slate-400' />
          </div>
          <input
            type='text'
            className='block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-600 placeholder-slate-400'
            placeholder='Search User'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Invite Section */}
        <div className='bg-white rounded-lg shadow-sm border border-slate-200 mb-4 overflow-hidden'>
          <div className='px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer'>
            <div className='flex items-center'>
              <div className='p-1.5 bg-indigo-100 rounded-md mr-3'>
                <UserPlus size={18} className='text-indigo-600' />
              </div>
              <span className='text-slate-700 font-medium'>Invite user</span>
            </div>
            <Link size={18} className='text-slate-400' />
          </div>
        </div>

        {/* Participants List */}
        <div className='bg-white rounded-lg shadow-sm border border-slate-200 mb-6 overflow-hidden'>
          {user.map((participant) => (
            <div
              key={participant.id}
              className='px-4 py-3 flex items-center justify-between border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors'
            >
              <div className='flex items-center'>
                <div className='relative mr-3'>
                  <img
                    src={participant.imageUrl}
                    alt={participant.name}
                    className='w-10 h-10 rounded-full object-cover border-2 border-slate-200'
                  />
                  {participant.online && (
                    <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                  )}
                </div>
                <div>
                  <p className='text-slate-800 font-medium'>
                    {participant.name}
                  </p>
                  <p className='text-xs text-slate-500'>{participant.role}</p>
                </div>
              </div>
              <div className='w-3 h-3 rounded-full bg-green-500'></div>
            </div>
          ))}
        </div>

        {/* Connect Button */}
        <div className='flex justify-center'>
          <button
            onClick={handleConnect}
            className='px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
