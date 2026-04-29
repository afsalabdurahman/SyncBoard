import React, { useEffect, useState } from "react";
import { Plus, Search, Mail } from "lucide-react";
import apiService from "../../Services/apiServices/apiService";
import { updateProjectApi } from "../../Redux/feature/project/projectThunks";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useWorkspaceid, useWorkspaceSlug } from "../../Worksapce/hooks/workspacehooks";
import { sendInvitation } from "../../Worksapce/apis/workspaceapis";
import Loader from "../../Custom/reusecomponents/Loader";
const INVITE_MEMBER_ = import.meta.env.VITE_BASE_INVITE_LINK;
export const MembersCard = (memberProps: any) => {
   const projectId=useSelector((state)=>state.switch.projectId);
 const workspaceId=useWorkspaceid()
   const slug = useWorkspaceSlug()
   console.log(workspaceId,slug)
  const dispatch =useDispatch()
  const [showInvite, setShowInvite] = useState(false);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
 const [load, setLoad] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
 const [invitationLink] = useState<string>(
    `${INVITE_MEMBER_}${slug}` 
  );
  /* Existing Members */
  useEffect(() => {
    if (memberProps?.memebrList?.length) {
      const formattedMembers = memberProps.memebrList.map(
        (member: any, index: number) => ({
          id: index + 1,
          name: member.name,
          role: member.role,
          initials: member.name
            .split(" ")
            .map((word: string) => word[0])
            .join("")
            .toUpperCase(),
          color: `hsl(${(index * 137.5) % 360}, 70%, 55%)`,
        })
      );

      setMembers(formattedMembers);
    }
  }, [memberProps?.memebrList]);

  /* Debounce Search */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        searchUsers(search);
      } else {
        setSearchedUsers([]);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  /* Backend Search API */
 const searchUsers = async (keyword: string) => {
  try {
    setLoading(true);

    const res = await apiService.get(
      `/workspace/members/find/${slug}?query=${keyword}`
    );

    setSearchedUsers(res.data || []);
    
  } catch (error) {
    setSearchedUsers([]);
  } finally {
    setLoading(false);
  }
};

  /* Add User */
 const addUser = async (user: any) => {
  try {
    const words = user.name.split(" ");

    const initials =
      words[0][0].toUpperCase() +
      (words[1]?.[0]?.toUpperCase() || "");

    const newMember = {
      id: Date.now(),
      name: user.name,
      role: "MEMBER",
      initials,
      color: `hsl(${(members.length * 137.5) % 360}, 70%, 55%)`,
    };
const exists = members.some((e) => e.name === newMember.name);

if (exists) {
  toast.warning("Member already exists");
  return;
}
    const updatedMembers = [...members, newMember];

    setMembers(updatedMembers);

    

    await dispatch(
      updateProjectApi({
        projectId,
        projectData: {
          assignedUsers: updatedMembers.map((e) => e.name),
        },
      })
    ).unwrap();

    setSearch("");
    setSearchedUsers([]);
    setShowInvite(false);
  } catch (error) {
    console.log(error);
  }
};

  const inviteEmail = async() => {
    if (!email) return;
let emails=[];
emails.push(email)
 try {
  setLoad(true)
  const response = await sendInvitation(emails,invitationLink,workspaceId)

console.log(response,"res+++++++++++ponse")
      if (response.status == 200 || response.status ==201) {
        setLoad(false);
  
        toast.success("Invitation send");
        
      }
    } catch  {
      setLoad(false);
      toast.error("Invitation send failed ");
    }
setLoad(false);
    setEmail("");
  };

  return (
    <div className="w-[320px] h-[280px] rounded-2xl border border-gray-200 bg-[#f7f8fa] shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200 shrink-0">
        <h3 className="text-[15px] font-semibold text-[#111827]">
          Members
        </h3>

        <div className="flex items-center gap-3">
          <span className="text-[13px] text-gray-500">
            {members.length}
          </span>

          <button
            onClick={() => setShowInvite(!showInvite)}
            className="h-7 w-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Invite Panel */}
      {showInvite && (
        <div className="border-b border-gray-200 bg-white p-4 space-y-3 shrink-0">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Search Result */}
          {search && (
            <div className="space-y-2 max-h-28 overflow-y-auto">
              {loading && (
                <p className="text-sm text-gray-400 px-2">
                  Searching...
                </p>
              )}

              {!loading &&
                searchedUsers.map((user: any) => (
                  <button
                    key={user._id}
                    onClick={() => addUser(user)}
                    className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    {user.name}
                  </button>
                ))}

              {!loading &&
                searchedUsers.length === 0 && (
                  <p className="text-sm text-red-400 px-2">
                    User not found
                  </p>
                )}
            </div>
          )}

          {/* Email Invite */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail
                size={14}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Invite by email"
                className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-sm outline-none"
              />
            </div>

            <button
              onClick={inviteEmail}
              className="rounded-xl bg-blue-500 px-4 text-sm text-white hover:bg-blue-600"
            >
              Send
            </button>
             
                     
                   
          </div>
          {load ? (
                   <div className='flex items-center justify-center mt-0'>
                     <Loader />
                   </div>
                 ) : null}
        </div>
      )}

      {/* Members List */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full text-white text-[11px] flex items-center justify-center"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>

              <span className="text-[14px] text-[#111827]">
                {member.name}
              </span>
            </div>

            <span
              className={`rounded-full px-2 py-1 text-[10px] tracking-widest ${
                member.role === "OWNER"
                  ? "bg-blue-100 text-blue-500"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {member.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};