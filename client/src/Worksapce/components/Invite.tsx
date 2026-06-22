import  { useEffect, useState } from "react";
import { X, } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../Custom/reusecomponents/Loader";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useWorkspaceid } from "../hooks/workspacehooks";
import { findPermission, sendInvitation } from "../apis/workspaceapis";
import { NoPermission } from "../../Custom/reusecomponents/NoPermission";
import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";
const INVITE_MEMBER_ = import.meta.env.VITE_BASE_INVITE_LINK;
const Invite = () => {
  const workspaceName = useSelector((state: RootState) => {
   
    const isAdmin = state.user.user?.role == "Admin";
    const name = state.workspace.workspace?.name
    const slug = state.workspace.workspace?.slug
    return { isAdmin, name, slug };
  });
  const workspaceId=useWorkspaceid()
  console.log(workspaceId)
  const workspaceid=useWorkspaceid() as string
const [permission,setPermission]=useState(null)
  const userId = useSelector((state: RootState) => state.user.user?._id);



 
  const [emails, setEmails] = useState([]);

  const [currentEmail, setCurrentEmail] = useState("");

  const [inviteRole, setInviteRole] = useState("Member");

  const [load, setLoad] = useState(false);

  const [invitationLink,] = useState<string>(
    `${INVITE_MEMBER_}${workspaceName.slug}` // Replace with your actual invitation link
  );
  const addEmail = (email:string) => {
    if (email && !emails.includes(email) && isValidEmail(email)) {
      setEmails([...emails, email]);
      setCurrentEmail("");
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

 
  const handleSend = async () => {
    setLoad(true);
    
    
    // Add your send logic here
    if (emails.length > 4) {
      toast.error("Maximum 4 is allowed!");
      return false;
    }
    try {
  const response = await sendInvitation(emails,invitationLink,workspaceid)

      if (response) {
     
        setLoad(false);
  if(response?.message){
    toast.warning(response.message)
  }else{
toast.success("Invitation send");
        setTimeout(() => {
          // dispatch(setLog(response.data.logs))
          // navigate("/workspace");
        }, 5000);
      }
  }
        
    } catch  {
      setLoad(false);
      toast.error("Invitation send failed ");
    }
  };

 useEffect(()=>{
  async function fetchPermission(){
 const data=await findPermission(workspaceid,userId);
 
 setPermission(data)
  }
  fetchPermission()
 },[ userId, workspaceid])
 if(!permission){
  return(<LoadingSpinner/>)
 }
 if(permission=="Viewer"){

   return(<><NoPermission/></>)
 }

  return (
    <div className='mt-6 mx-auto bg-white rounded-lg shadow-lg p-6 relative'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg font-semibold text-gray-900'>
          Invite people to -{" "}
          <span className='text-blue-900 font-bold text-xl'>
            {workspaceName.name}
          </span>
        </h2>
        <button className='text-gray-400 hover:text-gray-600'>
          <X size={20} />
        </button>
      </div>
      <ToastContainer position='top-center' autoClose={5000} />
      {/* Email Input Section */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          To:
        </label>
        <div className='border border-gray-300 rounded-md p-2 min-h-[60px] flex flex-wrap gap-2 items-start'>
          {emails.map((email, index) => (
            <span
              key={index}
              className='inline-flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded text-sm'
            >
              {email}
              <button
                onClick={() => removeEmail(email)}
                className='ml-1 text-blue-600 hover:text-blue-800'
              >
                <X size={14} />
              </button>
            </span>
          ))}
         <input
  type="email"
  value={currentEmail}
  onChange={(e) => setCurrentEmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission or new line
      const trimmed = currentEmail.trim();
      if (trimmed) {
        addEmail(trimmed);
        setCurrentEmail(""); // Clear input only after adding
      }
    }
  }}
  onBlur={() => {
    const trimmed = currentEmail.trim();
    if (trimmed) {
      addEmail(trimmed);
      setCurrentEmail("");
    }
  }}
  placeholder={emails.length === 0 ? "Enter email addresses..." : ""}
  className="flex-1 min-w-[120px] outline-none text-sm"
/>

        </div>
      </div>

      {/* Invite Role Dropdown */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Invite as:
        </label>
        <select
          value={inviteRole}
          onChange={(e) => setInviteRole(e.target.value)}
          className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        >
          <option value='Member'>Member</option>
          {/* <option value='Admin'>Admin</option> */}
          {/* <option value="Guest">Guest</option>
          <option value="Viewer">Viewer</option> */}
        </select>
        {load ? (
          <div className='flex items-center justify-center mt-4'>
            <Loader />
          </div>
        ) : null}
      </div>

      {/* Bottom Actions */}

      {/* Send Button */}
      <div className='mt-6 flex justify-end'>
        <button
          onClick={handleSend}
          disabled={emails.length === 0}
          className='bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md text-sm font-medium transition-colors'
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Invite;
