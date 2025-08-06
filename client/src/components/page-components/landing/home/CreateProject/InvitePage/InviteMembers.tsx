import React, { useState } from "react";
import { Copy, ChevronDown, Plus, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiService from "../../../../../../services/api";
import { RootState } from "../../../../../../Redux/store";
import { AxiosResponse } from "axios";
import { Navigate, useNavigate } from "react-router";
import { UseSelector, useDispatch } from "react-redux";
import { workspace } from "../../../../../../Redux/features/WorkspaceSlice";

import { useSelector } from "react-redux";
import Loader from "../../../../utility/loadingPages/Loader";

interface EmailField {
  email: string;
  role: "member";
}

interface TeamMember {
  name: string;
  position: string;
  team?: string;
  avatar: string;
}

interface CollabInterfaceProps {
  initialEmails?: EmailField[];
  inviteLink?: string;
  teamMembers?: TeamMember[];
}

const InviteMembers: React.FC<CollabInterfaceProps> = ({
  initialEmails = [{ email: "", role: "member" }],
  inviteLink = `http://localhost:5173/invite-members/workspace-"$"`,
  teamMembers = [
    {
      name: "Vanessa",
      position: "product manager",
      team: "US team",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTawSi7VQEKIgrbEMun3wv8K6OUogfZebE1wvjEMusx08uQeusKqmCI0I6E6wn6S2wQCiI&usqp=CAU",
    },
    {
      name: "Charlie",
      position: "software engineer tech lead",
      team: "US team",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaf0PXl01lV9E4m8WVQeSHUPAIXyYU3cxsr4oMJOP7hjKX6WuESW2AJyPHTDA5BzlQaJc&usqp=CAU",
    },
  ],
}) => {
  let dispatch = useDispatch();
  let workspaceLink: any = useSelector((state: RootState) => {
    return state.workspace.workspace.slug;
  });
  const [loader, setLoader] = useState(false);
  const [emailss, setEmails] = useState<EmailField[]>(initialEmails);
  const [emails,setSingleEmail]=useState(null)
  const [invitationLink, setInvitationLink] = useState<string>(
    `http://localhost:5173/invite-members/workspace-${workspaceLink}`
  );
  const [count, setCount] = useState(0);
  let navigate = useNavigate();

  const addEmailField = (): void => {
    //validating invitaion field
    if (emailss.length < 4) {
      if (emailss[count].email.includes("@")) {
        setEmails([...emailss, { email: "", role: "member" }]);
        setCount(count + 1);
      } else {
        toast.error("Invalid email");
      }
    } else {
      toast.error("limit Exceed");
    }
  };
  const handleEmailChange = (index: number, value: string): void => {
    const updatedEmails = [...emailss];
    
    updatedEmails[index].email = value;
    setEmails(updatedEmails);
    setSingleEmail([value])
  };

  const handleRoleChange = (index: number, role: "member"): void => {
    const updatedEmailss = [...emailss];

    updatedEmails[index].role = role;
    setEmails(updatedEmails);
    
  };

  const copyInviteLink = (): void => {
    navigator.clipboard.writeText(invitationLink);
    toast.success("copy");
    // Could add toast notification here
  };
  const inviteteams = async () => {
    if (emailss[0].email == "") {
      toast.error("Please add email");
    } else {
      setLoader(true);
      try {
        const response: AxiosResponse<any, any> = await apiService.post(
          "workspace/invite",

          {
            
            emails,
            invitationLink,
            
          },
          { withCredentials: true }
        );

        if (response) {
          setLoader(false);
          console.log(response, "fromserver after invite");
          toast.success("Invitation send");
          setTimeout(() => {
            dispatch(setLog(response.data.logs));
            navigate("/work-space");
          }, 5000);
        }
      } catch (error) {
        setLoader(false);
        console.log(error);
        toast.error("Invitation send failed ");
      }
    }
  };
  return (
    <div className='flex w-full'>
      {/* Left Section */}
      <div className='flex-1 p-6 bg-white'>
        <div className='flex items-center space-x-2 mb-8'>
          <img className='h-25' src='/images/company-logo.png' alt='' />
          <div className='flex items-center'>
            <span className='font-semibold text-gray-800'>GridSync</span>
            <div className='ml-2 px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded'>
              dev
            </div>
          </div>
        </div>

        <div className='flex items-center mb-6'>
          <h2 className='text-2xl font-medium text-gray-700 mr-2'>
            Who else is on your team?
          </h2>
          {loader ? <Loader /> : null}
        </div>

        <div className='mb-6'>
          <p className='text-sm text-gray-500 mb-2'>
            Invite with link (anyone with a @cxnlab.com email)
          </p>
          <div className='flex border border-gray-300 rounded overflow-hidden'>
            <input
              type='text'
              className='flex-1 p-2 text-sm'
              value={`http://localhost:5173/invite-members/workspace-${workspaceLink}`}
              readOnly
            />
            <button
              className='px-3 bg-white border-l border-gray-300 flex items-center cursor-pointer
'
              onClick={copyInviteLink}
            >
              <Copy size={18} className='text-gray-500' />
              <span className='ml-1 text-sm'>Copy</span>
            </button>
            <ToastContainer position='top-center' autoClose={5000} />
          </div>
        </div>

        <div className='mb-6'>
          <p className='text-sm text-gray-500 mb-2'>Invite with email</p>

          {emailss.map((emailField, index) => (
            <div key={index} className='flex mb-2'>
              <input
                type='email'
                placeholder="Add member's email here"
                className='flex-1 p-2 text-sm border border-gray-300 rounded-l'
                value={emailField.email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
              />
            </div>
          ))}

          <button
            onClick={addEmailField}
            className='text-sm text-gray-600 flex items-center mt-2  cursor-pointer'
          >
            <Plus size={16} className='mr-1' />
            Add another
          </button>
        </div>

        <div className='flex justify-between mt-6'>
          <button
            onClick={() => navigate("/work-space")}
            className='text-gray-500 font-medium  cursor-pointer'
          >
            Remind me later
          </button>

          <button
            onClick={inviteteams}
            className='px-4 py-2 bg-gray-200 text-gray-500 rounded font-medium  cursor-pointer'
          >
            Invite your team
          </button>
        </div>
      </div>

      {/* Right Section - Visual Representation */}
      <div className='flex-1 bg-purple-900 relative'>
        <div className='h-full flex flex-col justify-between p-6'>
          <div className='flex-1 relative'>
            {/* Team visualization with orbits */}
            <div className='w-full h-full flex items-center justify-center relative'>
              {/* Outer orbit */}
              <div className='absolute w-96 h-96 rounded-full border border-teal-500/30'></div>

              {/* Middle orbit */}
              <div className='absolute w-64 h-64 rounded-full border border-teal-500/30'></div>

              {/* Center circle - you */}
              <div className='absolute'>
                <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center'>
                  <div className='w-8 h-8 bg-green-500 rounded-md flex items-center justify-center'>
                    <div className='w-4 h-4 bg-white rounded-sm'></div>
                  </div>
                </div>
              </div>

              {/* Team member 1 - Vanessa */}
              <div className='absolute top-24 right-16'>
                <div className='bg-gray-900/80 p-3 rounded-lg w-64'>
                  <div className='flex items-center'>
                    <img
                      src={teamMembers[0].avatar}
                      alt={teamMembers[0].name}
                      className='w-10 h-10 rounded-full'
                    />
                    <div className='ml-2'>
                      <p className='text-white'>{teamMembers[0].name}</p>
                      <p className='text-xs text-gray-400'>
                        {teamMembers[0].position}
                      </p>
                      {teamMembers[0].team && (
                        <div className='flex items-center mt-1'>
                          <div className='w-4 h-4 bg-blue-500 text-white flex items-center justify-center rounded-sm text-xs mr-1'></div>
                          <span className='text-xs text-gray-400'>
                            {teamMembers[0].team}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Random team member avatar */}
              <div className='absolute left-24 top-48'>
                <img
                  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT83ohlO-3rqyFnIVwIV8L1J2NyeU2jGpmnLA&s'
                  alt='Team member'
                  className='w-12 h-12 rounded-full'
                />
              </div>

              {/* Team member 2 - Charlie */}
              <div className='absolute bottom-20 left-1/4'>
                <div className='bg-gray-900/80 p-3 rounded-lg w-64'>
                  <div className='flex items-center'>
                    <img
                      src={teamMembers[1].avatar}
                      alt={teamMembers[1].name}
                      className='w-10 h-10 rounded-full'
                    />
                    <div className='ml-2'>
                      <p className='text-white'>{teamMembers[1].name}</p>
                      <p className='text-xs text-gray-400'>
                        {teamMembers[1].position}
                      </p>
                      {teamMembers[1].team && (
                        <div className='flex items-center mt-1'>
                          <div className='w-4 h-4 bg-blue-500 text-white flex items-center justify-center rounded-sm text-xs mr-1'></div>
                          <span className='text-xs text-gray-400'>
                            {teamMembers[1].team}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty member avatar */}
              <div className='absolute right-32 bottom-32'>
                <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
                  <div className='w-6 h-6 bg-white rounded-full'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;
