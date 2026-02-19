import { useEffect, useState, useCallback } from "react";
import { Search, Users } from "lucide-react";
import { useSelector } from "react-redux";
import apiService from "../../Services/apiServices/apiService";
import { fetchAllUsers } from "../../Redux/feature/users/AlluserThunks";
import { allMembers, paginationUser, searchUser } from "../apis/workspaceapis";
import { Pagination } from "@mui/material";
import { setPage } from "../../Redux/feature/project/projectSlice";


function useDebounce<T>(value: T, delay: number = 450): T {
  const [debouncedValue, setDebouncedValue] = useState(value);




  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function MeetingRoom() {
  const [page,setPage]=useState();
const [total,setTotal]=useState()
  const workspaceSlug = useSelector(
    (state: any) => state.workspace.workspace.slug
  );
useSelector((state)=>{
  console.log(state,"state")
})
useEffect(()=>{
 async function fetch(){
const data=await paginationUser(workspaceSlug,1);
setMembers(data.items);
setTotal(data.totalItems);
setPage(data.currentPage)
  }
 fetch()

},[workspaceSlug])



  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery.trim(), 450);

  const fetchMembers = useCallback(async (query: string) => {
    if (!workspaceSlug) return;

    setLoading(true);
    try {
      
    const response= await searchUser(workspaceSlug,query)

       setMembers(response || []);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceSlug]);

  // Trigger fetch on workspace change OR debounced search change
  useEffect(() => {
    fetchMembers(debouncedSearch);
  }, [fetchMembers, debouncedSearch]);
const handleChangePage = (page)=>{
  console.log(page,"pagee")
}
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
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading members...
            </div>
          ) : members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className="px-4 py-3 flex items-center justify-between border-b last:border-0 hover:bg-slate-50"
              >
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <img
                      src={member.imageUrl ?? "/images/user.jpeg"}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    {member.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-slate-800 font-medium">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>

                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500">
              {debouncedSearch
                ? "No members found matching your search"
                : "No members found"}
            </div>
          )}
        </div>
<Pagination 
component="div"
count={Math.ceil(total/4)}
page={page}
 onChange={(_, page) => handleChangePage(page)}

/>
      </div>
    </div>
  );
}