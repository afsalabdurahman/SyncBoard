import type React from "react";
import apiService from "../../services/api";
import { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setUsers, clearUsers } from "../../Redux/features/AlluserSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface User {
  _id?: number;
  name: string;
  email: string;
  role: string;
  isBlock: string;
  title:string;
  
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<User, "id">) => void;
  user?: User | null;
}

export function UserModal({ isOpen, onClose, onSubmit, user }: UserModalProps) {
  let dispatch = useDispatch();
  const userId = user?._id;
  console.log(user, "before editing...");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    isBlock: "",
    isAdmin: false,
  });
  console.log(formData, "before editing2...");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        isBlock: user.isBlock === true ? "Yes" : "No",
        isAdmin: user.role === "Admin" ? true : false,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "",
        isBlock: "",
        isAdmin: false,
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData, "handle sumbimit form");

    const updatedData = {
      ...formData,
      isBlock: formData.isBlock === "Yes" ? true : false,
      isAdmin: formData.role === "Admin" ? true : false,
    };

    try {
      const axiosResponse: AxiosResponse<any> = await apiService.patch(
        `member/profile/update/${userId}`,
        {
          profileData: updatedData,
        },
        { withCredentials: true }
      );
      console.log(axiosResponse, "response axioss");
   

      console.log(axiosResponse, "axios resposne");
      setTimeout(() => {
        toast.success("updated");
      }, 0);
      dispatch(clearUsers());
      onSubmit(formData);
    } catch (error) {
      console.log(error, "from axioss");
    }

    setTimeout(() => {
      onClose();
    }, 5000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <ToastContainer position='top-center' autoClose={5000} />
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Update user information and role."
              : "Add a new team member to your organization."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <Input
                readOnly
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='col-span-3'
                required
              />
            </div>
            {formData.isAdmin ? null : (
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='role' className='text-right'>
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "Admin" | "Member") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Admin'>Admin</SelectItem>
                    <SelectItem value='Member'>Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {formData.isAdmin ? null : (
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='block' className='text-right'>
                  Block
                </Label>
                <Select
                  value={formData.isBlock}
                  onValueChange={(value: "No" | "Yes") =>
                    setFormData({ ...formData, isBlock: value })
                  }
                >
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='Want to Block' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='No'>No</SelectItem>
                    <SelectItem value='Yes'>Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit'>{user ? "Update User" : "Add User"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
