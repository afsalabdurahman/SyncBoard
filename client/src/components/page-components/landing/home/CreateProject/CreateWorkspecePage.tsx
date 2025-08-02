import React, { useState,useEffect } from "react";
import { PlusCircle, Check } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { RootState } from "../../../../../Redux/store";
import { useSelector } from "react-redux";
import apiService from "../../../../../services/api";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {setWorkspace} from "../../../../../Redux/features/WorkspaceSlice"
import { setUserRole } from "../../../../../Redux/features/RegisterSlice";
import{updateUserPartial} from "../../../../../Redux/features/UserDataSlice"
import { setUserData } from "../../../../../Redux/features/UserDataSlice";

interface FormField {
  projectName: string;
  role: string;
}

const CreateWorkspacePage: React.FC = () => {
  let navigate=useNavigate()
let dispach=useDispatch()
  const email = useSelector((state: RootState) => state?.user?.user?.email);
  const Userrole= useSelector((state:RootState) =>state?.user?.user?.role);
 const ownerId=useSelector((state:RootState) =>state?.user?.user?._id);

  console.log(email, "emailsss");


  const [formFields, setFormFields] = useState<FormField[]>([
    { projectName: "", role: "" },
  ]);
  const [allowAutoSignups, setAllowAutoSignups] = useState<boolean>(true);

  const addField = (): void => {
    setFormFields([...formFields, { projectName: "", role: "" }]);
  };
  console.log(formFields, "form filed");

  const handleInputChange = (
    index: number,
    field: keyof FormField,
    value: string
  ): void => {
    const newFormFields = [...formFields];
    newFormFields[index][field] = value;
    setFormFields(newFormFields);
  };

  let handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(formFields, "form");
    let WorkspaceName = formFields[0].projectName;
    let title = formFields[0].role;
    let slug = WorkspaceName + ".com";
    

    console.log(email,WorkspaceName, title, slug, "datas");
    try {
      const response: AxiosResponse<any, any> = await apiService.post(
        "workspace/create",
        
        { 
          email,
          WorkspaceName,
          slug,
          title,
          role:Userrole,
          ownerId

        }
        ,{withCredentials: true}
      );
      console.log(response,"responseive axoios");
      if (response) {
dispach(setWorkspace(response.data.WorkSpace.isCreate))
dispach(setUserData(response.data.WorkSpace.user))
       navigate('/invite-members')
      }
    } catch (error) {
      console.log(error,"eroo  catch block axios")
      toast.error("Somthing went to wrong")
     
   
    }
  };
  return (
    <div className='flex flex-col w-full'>
      <div className='flex w-full'>
        <div className='w-1/2 p-8'>
          <div className='flex items-center mb-6'>
            <div className='text-white p-2 rounded-md mr-2'>
              <img className='h-13' src='/images/company-logo.png' alt='' />
            </div>
            <div>
              <span className='font-bold text-gray-700'>GridSync</span>
              <span className='text-xs text-gray-500 ml-2'>dev</span>
              <div className='text-xs bg-gray-200 px-1 rounded inline-block ml-2'>
                Pro
              </div>
            </div>
          </div>
<ToastContainer position='top-center' autoClose={5000} />
          <h2 className='text-2xl font-medium text-gray-700 mb-6'>
            Tell me about your Workspace name and Your Title?
          </h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              {formFields.map((field, index) => (
                <div key={index} className='mb-4'>
                  <input
                    type='text'
                    placeholder='Name of Workspace'
                    className='w-full border border-gray-300 rounded p-3 mb-2'
                    value={field.projectName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(index, "projectName", e.target.value)
                    }
                  />
                  <input
                    type='text'
                    placeholder='Title'
                    className='w-full border border-gray-300 rounded p-3'
                    value={field.role}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(index, "role", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className='flex items-center mb-8'>
              <div
                className={`w-5 h-5 border rounded mr-2 flex items-center justify-center cursor-pointer ${
                  allowAutoSignups
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setAllowAutoSignups(!allowAutoSignups)}
              >
                {allowAutoSignups && <Check size={14} color='white' />}
              </div>
              <span className='text-gray-500 text-sm'>
                Allow automatic signups with an{" "}
                <span className='bg-gray-100 px-1 rounded'>@cxnlab.com</span>{" "}
                email address
              </span>
            </div>

            <div className='flex items-center'>
              <button
                className='bg-purple-700 text-white py-2 px-8 rounded'
                type='submit'
              >
                Continue
              </button>
            </div>
          </form>
        </div>

        <div className='w-1/2 bg-gradient-to-br from-purple-100 to-purple-700 flex items-center justify-center relative'>
          <div className='absolute inset 0 flex items-center justify-center'>
            <div className='relative w-full h-full max-w-md max-h-md'>
              {/* Circular rings */}
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-teal-500/30'></div>
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-teal-500/30'></div>

              {/* Center circle */}
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center'>
                <div className='text-green-500'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8 1.33334C4.32 1.33334 1.33334 4.32 1.33334 8C1.33334 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8C14.6667 4.32 11.68 1.33334 8 1.33334ZM8 4.00001C9.10667 4.00001 10 4.89334 10 6.00001C10 7.10667 9.10667 8.00001 8 8.00001C6.89334 8.00001 6 7.10667 6 6.00001C6 4.89334 6.89334 4.00001 8 4.00001ZM8 12.8C6.33334 12.8 4.86 11.9733 4 10.7333C4.02 9.36667 6.66667 8.60001 8 8.60001C9.32667 8.60001 11.98 9.36667 12 10.7333C11.14 11.9733 9.66667 12.8 8 12.8Z'
                      fill='currentColor'
                    />
                  </svg>
                </div>
              </div>

              {/* User cards */}
              <div className='absolute top-24 right-16 bg-gray-900/80 p-3 rounded-lg backdrop-blur-sm w-48'>
                <div className='flex items-start'>
                  <div className='w-12 h-12 rounded-full overflow-hidden mr-3'>
                    <img
                      src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTawSi7VQEKIgrbEMun3wv8K6OUogfZebE1wvjEMusx08uQeusKqmCI0I6E6wn6S2wQCiI&usqp=CAU'
                      alt='Vanessa'
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='text-white'>
                    <p className='font-medium'>Vanessa</p>
                    <p className='text-xs text-gray-400'>Product manager</p>
                    <div className='bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded mt-1 flex items-center'>
                      <span className='mr-1'>US team</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='absolute bottom-24 left-16 bg-gray-900/80 p-3 rounded-lg backdrop-blur-sm w-48'>
                <div className='flex items-start'>
                  <div className='w-12 h-12 rounded-full overflow-hidden mr-3'>
                    <img
                      src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaf0PXl01lV9E4m8WVQeSHUPAIXyYU3cxsr4oMJOP7hjKX6WuESW2AJyPHTDA5BzlQaJc&usqp=CAU'
                      alt='Charlie'
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='text-white'>
                    <p className='font-medium'>Charlie</p>
                    <p className='text-xs text-gray-400'>
                      Software engineer tech lead
                    </p>
                    <div className='bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded mt-1 flex items-center'>
                      <span className='mr-1'>US team</span>
                    </div>
                  </div>
                </div>
                <div className='text-gray-400 text-xs mt-2'>
                  <code>R&D</code>
                </div>
              </div>

              {/* Additional profile images */}
              <div className='absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full overflow-hidden border-2 border-white'>
                <img
                  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHAtjvJKF7hm-BBhIlMK1EtE_cJe5NM9J6xg&s'
                  alt='Team member'
                  className='w-full h-full object-cover'
                />
              </div>

              <div className='absolute bottom-16 right-16 w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20C9.5 20 7.29 18.96 6 17.25C6.03 14.54 10.5 13.5 12 13.5C13.49 13.5 17.97 14.54 18 17.25C16.71 18.96 14.5 20 12 20Z'
                    fill='#999999'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful quote footer */}
      <div className='w-full mt-8 mb-8'>
        <div className='relative mx-auto max-w-4xl px-8 py-6 bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg shadow-md border-l-4 border-purple-500'>
          <div className='absolute -top-4 -left-4 text-purple-500 opacity-20'>
            <svg className='w-12 h-12' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.51.88-3.995 3.356-3.995 5.666h4v10.183h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.511.88-3.996 3.356-3.996 5.666h4v10.183h-10z' />
            </svg>
          </div>
          <p className='text-lg md:text-xl italic text-gray-700 leading-relaxed'>
            "Collaboration is not about gluing together existing ideas. It's
            about creating something new from diverse perspectives that couldn't
            have existed before. At GridSync, we believe in the power of
            teamwork to transform how we build and create."
          </p>
          <div className='flex items-center mt-4'>
            <div className='flex-shrink-0 mr-3'>
              <div className='w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-teal-400 flex items-center justify-center text-white font-bold'>
                GS
              </div>
            </div>
            <div>
              <p className='font-medium text-gray-900'>GridSync Team</p>
              <p className='text-sm text-gray-500'>
                Connecting minds, building futures
              </p>
            </div>
          </div>
          <div className='absolute bottom-2 right-2'>
            <svg
              className='h-6 w-6 text-purple-300'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M18.6 16.8l-1.2-1.2c1.9-1.9 1.9-4.9 0-6.8C15.5 6.9 12.5 6.9 10.6 8.8L7 12.4c-1.9 1.9-1.9 4.9 0 6.8 0.9 0.9 2.2 1.4 3.4 1.4s2.5-0.5 3.4-1.4l0.6-0.6 1.4 1.4-0.6 0.6c-2.7 2.7-7.1 2.7-9.8 0-2.7-2.7-2.7-7.1 0-9.8l3.6-3.6c2.7-2.7 7.1-2.7 9.8 0 2.7 2.7 2.7 7.1 0 9.8L18.6 16.8z' />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspacePage;
