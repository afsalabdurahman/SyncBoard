import { useState, useRef, use, useEffect } from "react";
import api from "../../../../services/api";
import { AxiosResponse } from "axios";
import Loader from "../../../page-components/utility/loadingPages/Loader";
import axios from "axios";

import {
  setUserData,
  updateUserPartial,
} from "../../../../Redux/features/UserDataSlice";
import {
  setUserEmail,
  setUserName,
  setUserPassword,
  clearUserProfiles,
} from "../../../../Redux/features/RegisterSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";

import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  Globe,
  FileText,
  Star,
  MessageSquare,
  Users,
  Tag,
  AlertCircle,
  Shield,
  Award,
  User,
  Edit,
  Check,
  X,
  Key,
  ChevronDown,
  Save,
  Camera,
  MapPinHouse,
  LoaderIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import apiService from "../../../../services/api";
export default function Profile() {
  //image
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleOverlayClick = () => {
    fileInputRef.current.click();
  };
  // const currentProfile = useSelector(
  //   (state: any) => state.register.user_profile
  // );

  const Userdata = useSelector((state: any) => {
    console.log("State Profile:-", state);
    let date = new Date(state.workspace.workspace.createdAt);
    let formateDate = date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    let data = {
      user: state.register,
      workspace: state.workspace,
      joinDate: formateDate,
      userData: state.user,
    };
    return data;
  });
  console.log(Userdata.userData.user._id, "userdata from profile");
  const userId = Userdata.userData.user._id;
  const [activeTab, setActiveTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [isLoading, setLoading] = useState(false);
  // Using state to manage profile data so it can be edited
  const [profileData, setProfileData] = useState({
    name: Userdata?.userData?.user?.name || null,
    role: Userdata?.userData?.user?.role || null,
    status: "NA",
    imageUrl: Userdata?.userData?.user?.imageUrl || null,
    address: Userdata?.userData?.user?.address || null,
    title: Userdata?.userData?.user?.title || null,
    location: Userdata?.userData?.user?.location || null,
    email: Userdata?.userData?.user?.email || null,
    phone: Userdata?.userData?.user?.phone || null,
    joinDate: Userdata?.joinDate || null,
    skills: ["NA"],
    about: Userdata?.userData?.user?.about || null,
  });
  // console.log(Userdata?.userData.user.imageUrl,"user img")

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log(file, "file updateimageeeeig000000");
    if (file && file.type.startsWith("image/")) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "My_frist_cloud");

      setLoading(true);

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/ddoxcgkv2/image/upload",
          formData
        );

        const imageUrl = response.data.secure_url;

        // Optional: set local preview or state
        setProfileData((prev) => ({
          ...prev,
          imageUrl,
        }));
        //       const profileDatas = {
        // imageUrl: response.data.secure_url}
        //dispatch(addUserProfile({ imageUrl: imageUrl }));
        dispatch(updateUserPartial({ imageUrl: imageUrl }));
        // Build updated profileData for backend
        const updatedProfile = {
          ...profileData,
          imageUrl,
        };
        const axiosResponse: AxiosResponse<any> = await api.patch(
          `/api/member/profile/update/${userId}`,
          {
            profileData: updatedProfile,
          },
          { withCredentials: true }
        );
        console.log(axiosResponse, "from setrver500");
        // dispatch(setUserName(profileData.));
      } catch (error) {
        console.error("Error uploading or updating profile:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please select a valid image file.");
    }
  };

  // Form state for editing different sections
  const [formData, setFormData] = useState({});

  // Handle starting edit mode for a section
  const handleEdit = (section, initialData) => {
    setEditSection(section);
    setFormData(initialData);
    setIsEditing(true);
  };

  // Handle saving edits

  const changePassword = () => {
    navigate("/change-password?user=true");
  };
  const handleSave = async () => {
    dispatch(updateUserPartial(formData));

    const updatedProfile = {
      ...profileData,
      ...formData,
    };

    setProfileData(updatedProfile);

    console.log(updatedProfile, "before send to back end");

    try {
      const response: AxiosResponse<any, any> = await api.patch(
       `member/profile/update/${userId}`,
        {
          profileData: updatedProfile, // Use the up-to-date object
        },
        { withCredentials: true }
      );

      if (response.status) {
        toast.success("updated");
        setIsEditing(false);
        setEditSection(null);
      } else {
        setIsEditing(false);
        setEditSection(null);
      }
    } catch (error) {
      console.log(error, "error+");
    }
  };

  // Handle canceling edits
  const handleCancel = () => {
    setIsEditing(false);
    setEditSection(null);
  };

  // Handle form input changes

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle adding a new skill
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const TabButton = ({ id, label, icon }) => {
    const Icon = icon;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center px-4 py-2 text-sm font-medium ${
          activeTab === id
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
        }`}
      >
        <Icon size={16} className='mr-2' />
        {label}
      </button>
    );
  };

  useEffect(() => {
    apiService
      .get("/user-data", { email: Userdata?.userData?.user?.email })
      .then((response) => {
        console.log(response.data.userData, "user data from profile0000");
        dispatch(setUserData(response.data.userData));
      });
  }, []);

  return (
    <div className=' mt-[em] overflow-x-auto overflow-y-auto  '>
      <ToastContainer position='top-center' autoClose={5000} />
      {/* Header with cover photo */}
      {/* h-[35em] w-[95em]  */}

      {/* Profile information */}
      <div className='bg-white shadow'>
        <div className='max-w-5xl mx-auto px-5 sm:px-6 lg:px-8'>
          <div className='relative'>
            {/* Profile image */}

            <div className='absolute'>
              <div className='relative h-30 w-30 rounded-full border-4 border-white overflow-hidden group'>
                {isLoading ? (
                  <Loader />
                ) : (
                  <img
                    src={profileData.imageUrl || "/images/user.jpeg"}
                    alt={profileData.name}
                    className='h-full w-full object-cover'
                  />
                )}
                <div className='absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white'></div>

                {/* Hidden file input */}
                <input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  className='hidden'
                  onChange={handleFileChange}
                />

                {/* Overlay to trigger upload */}
                <div
                  className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer'
                  onClick={handleOverlayClick}
                >
                  <Camera size={24} className='text-white' />
                </div>
              </div>
            </div>

            {/* Profile header */}
            <div className='ml-36 pt-5 pb-5 mt-12'>
              <div className='flex justify-between'>
                <div>
                  {editSection === "basicInfo" ? (
                    <div className='mb-4'>
                      <div className='mb-3'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Name
                        </label>
                        <input
                          type='text'
                          name='name'
                          value={formData.name || ""}
                          onChange={handleChange}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                        />
                      </div>

                      <div className='mb-3'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Role
                        </label>
                        <input
                          readOnly
                          tabIndex={-1}
                          type='text'
                          name='role'
                          value={formData.role || ""}
                          onChange={handleChange}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-default bg-gray-100'
                        />
                      </div>
                      <div className='grid grid-cols-2 gap-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Title
                          </label>
                          <input
                            type='text'
                            name='title'
                            value={formData.title || ""}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Location
                          </label>
                          <input
                            type='text'
                            name='location'
                            value={formData.location || ""}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                          />
                        </div>
                      </div>
                      <div className='flex mt-4 space-x-2 justify-end'>
                        <button
                          onClick={handleCancel}
                          className='px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className='px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700'
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='flex items-center'>
                        <h1 className='text-2xl font-bold text-gray-900 flex items-center'>
                          {profileData.name}
                          <span className='ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800'>
                            {profileData.pronouns}
                          </span>
                        </h1>
                        <button
                          onClick={() =>
                            handleEdit("basicInfo", {
                              name: profileData.name,
                              pronouns: profileData.pronouns,
                              role: profileData.role,
                              title: profileData.title,
                              location: profileData.location,
                            })
                          }
                          className='ml-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded'
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                      <p className='text-gray-600'>{profileData.role}</p>
                      <div className='flex items-center mt-1 text-sm text-gray-500'>
                        <Briefcase size={14} className='mr-1' />
                        <span>{profileData.title}</span>
                        <span className='mx-2'>•</span>
                        <MapPin size={14} className='mr-1' />
                        <span>{profileData.location}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className='flex space-x-2'>
                  <button className='px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 h-[3em]'>
                    <MessageSquare size={16} className='inline-block mr-1' />
                    Message
                  </button>
                  {!isEditing && (
                    <button
                      onClick={() =>
                        handleEdit("basicInfo", {
                          name: profileData.name,
                          pronouns: profileData.pronouns,
                          role: profileData.role,
                          title: profileData.title,
                          location: profileData.location,
                        })
                      }
                      className='px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 h-[3em]'
                    >
                      <Edit size={16} className='inline-block mr-1' />
                      Edit Profile
                    </button>
                  )}
                </div>
                <button
                  onClick={changePassword}
                  className='px-4 py-2 text-sm font-semibold rounded-md bg-red-600 text-white border border-red-700 shadow hover:bg-red-700 transition-colors flex items-center gap-2 h-[3em]'
                >
                  <Key className='flex-shrink-0 h-5 w-5 text-white' />
                  Change Password
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className='border-b border-gray-200'>
              <div className=''>
                <br></br>
                <br></br>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-3 gap-6'>
          {/* Left sidebar with contact info */}
          <div className='col-span-1'>
            <div className='bg-white shadow rounded-lg p-6'>
              <h2 className='text-lg font-medium text-gray-900 mb-4'>
                Contact Information
              </h2>

              {editSection === "contactInfo" ? (
                <div className='space-y-4'>
                  <div className='mb-3'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Email
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email || ""}
                      onChange={handleChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>

                  <div className='mb-3'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Phone
                    </label>
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone || ""}
                      onChange={handleChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>

                  <div className='mb-3'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Address
                    </label>
                    <input
                      type='text'
                      name='address'
                      value={formData.address || ""}
                      onChange={handleChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>

                  <div className='flex space-x-2 justify-end'>
                    <button
                      onClick={handleCancel}
                      className='px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className='px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700'
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div className='flex justify-between items-start'>
                    <div className='flex items-start'>
                      <Mail className='flex-shrink-0 h-5 w-5 text-gray-400 mt-1' />
                      <div className='ml-3 text-sm'>
                        <p className='font-medium text-gray-900'>Email</p>
                        <p className='text-gray-500'>{profileData.email}</p>
                      </div>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() =>
                          handleEdit("contactInfo", {
                            email: profileData.email,
                            phone: profileData.phone,
                            address: profileData.address,
                          })
                        }
                        className='p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded'
                      >
                        <Edit size={14} />
                      </button>
                    )}
                  </div>

                  <div className='flex items-start'>
                    <Phone className='flex-shrink-0 h-5 w-5 text-gray-400 mt-1' />
                    <div className='ml-3 text-sm'>
                      <p className='font-medium text-gray-900'>Phone</p>
                      <p className='text-gray-500'>{profileData.phone}</p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <MapPinHouse className='flex-shrink-0 h-5 w-5 text-gray-400 mt-1' />
                    <div className='ml-3 text-sm'>
                      <p className='font-medium text-gray-900'>Address</p>
                      <p className='text-gray-500'>{profileData.address}</p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <Calendar className='flex-shrink-0 h-5 w-5 text-gray-400 mt-1' />
                    <div className='ml-3 text-sm'>
                      <p className='font-medium text-gray-900'>Start Date</p>
                      <p className='text-gray-500'>{profileData.joinDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main content area */}
          <div className='col-span-2'>
            {activeTab === "about" && (
              <>
                <div className='bg-white shadow rounded-lg p-6 mb-6'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-medium text-gray-900'>About</h2>
                    {!isEditing && (
                      <button
                        onClick={() =>
                          handleEdit("about", { about: profileData.about })
                        }
                        className='p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded'
                      >
                        <Edit size={16} />
                      </button>
                      //skills

                      //end skill
                    )}
                  </div>

                  {editSection === "about" ? (
                    <div>
                      <textarea
                        name='about'
                        value={formData.about || ""}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                        rows={4}
                      />
                      <div className='flex mt-4 space-x-2 justify-end'>
                        <button
                          onClick={handleCancel}
                          className='px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className='px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700'
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className='text-gray-600'>{profileData.about}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
