import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { useSelector } from "react-redux";
import apiService from "../../Services/apiServices/apiService";

export default function MeetingRoom() {
  const workspaceSlug = useSelector(
    (state: any) => state.workspace.workspace.slug
  );

  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------------- FILTER USERS ---------------- */
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------- FETCH USERS ---------------- */
  useEffect(() => {
    if (!workspaceSlug) return;

    apiService
      .get(`workspace/member/data/${workspaceSlug}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("MeetingRoom error:", error);
      });
  }, [workspaceSlug]);

  return (
    <div className="mt-8 w-full bg-slate-50 min-h-screen p-4 max-w-[1000px] mx-auto">
      <div className="max-w-[60rem] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-slate-800">
            Members List
          </h1>
          <div className="bg-white p-1 rounded-full shadow-sm">
            <Users size={20} className="text-indigo-600" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search User"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((participant) => (
              <div
                key={participant.id}
                className="px-4 py-3 flex items-center justify-between border-b last:border-0 hover:bg-slate-50"
              >
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <img
                      src={
                        participant.imageUrl
                          ? participant.imageUrl
                          : "/images/user.jpeg"
                      }
                      alt={participant.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    {participant.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-slate-800 font-medium">
                      {participant.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {participant.role}
                    </p>
                  </div>
                </div>

                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500">
              No users found
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
