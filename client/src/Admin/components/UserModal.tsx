import React, { useEffect, useState } from "react";
import { Button } from "../../Custom/ui/button";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../Custom/ui/dialog";

import { Input } from "../../Custom/ui/input";
import { Label } from "../../Custom/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Custom/ui/select";

import { updateUser } from "../../Redux/feature/users/AlluserThunks";
import { useWorkspaceid } from "../../Worksapce/hooks/workspacehooks";
import { updatePermissionApi } from "../apis/dashboardApi";

/* ---------------- TYPES ---------------- */

interface User {
  _id?: string;
  name: string;
  email: string;
  role: "Admin" | "Member";
  isBlocked: boolean;
  title?: string;
  permission?: string
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  user?: User | null;
}

interface FormState {
  name: string;
  email: string;
  role: "Admin" | "Member" | "";
  isBlocked: "Yes" | "No" | "";
  isAdmin: boolean;
  permission: "Viewer" | "Editor" | "Admin"
}

/* ---------------- COMPONENT ---------------- */

export function UserModal({ isOpen, onClose, onSubmit, user }: UserModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const workspaceId = useWorkspaceid()
console.log(user,"usersssssssss")
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    role: "",
    isBlocked: "",
    isAdmin: false,
    permission: "Editor"
  });

  /* ---------------- LOAD USER DATA ---------------- */

  useEffect(() => {
    if (!user) {
      setFormData({
        name: "",
        email: "",
        role: "",
        isBlocked: "",
        isAdmin: false,
        permission: "Editor"
      });
      return;
    }

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked ? "Yes" : "No",
      isAdmin: user.role === "Admin",
      permission: user.permission == "Member" ? "Editor" : "Viewer"
    });
  }, [user, isOpen]);

  /* ---------------- SUBMIT ---------------- */
const apiUpdatePermission=async (permission)=>{
  console.log(workspaceId,"IDDD")
await updatePermissionApi(permission,user._id,workspaceId)
}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id) return;

    const updatedData = {
      ...formData,
      isBlocked: formData.isBlocked === "Yes",
      isAdmin: formData.role === "Admin",
    };

    try {
      await dispatch(
        updateUser({
          userId: user._id,
          updatedData,
        })
      ).unwrap();

      toast.success("User updated successfully");

      onSubmit({
        ...user,
        ...updatedData,
        role: formData.role as "Admin" | "Member",
      });

      onClose();

    } catch (error) {

      toast.error(error.message);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">

        <DialogHeader>
          <DialogTitle>
            {user ? "Edit User" : "Add New User"}
          </DialogTitle>

          <DialogDescription>
            {user
              ? "Update user information and role."
              : "Add a new team member."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>

          <div className="grid gap-4 py-4">

            {/* NAME */}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Name</Label>

              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="col-span-3"
                required
              />
            </div>

            {/* EMAIL */}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email</Label>

              <Input
                readOnly
                type="email"
                value={formData.email}
                className="col-span-3"
              />
            </div>

            {/* ROLE */}

            {!formData.isAdmin && (
              <div className="grid grid-cols-4 items-center gap-4">

                <Label className="text-right">Role</Label>

                <Select
                  value={formData.role}
                  onValueChange={(value: "Admin" | "Member") =>
                    setFormData((prev) => ({
                      ...prev,
                      role: value,
                    }))
                  }
                >

                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                  </SelectContent>

                </Select>

              </div>
            )}

            {/* BLOCK */}

            {!formData.isAdmin && (
              <div className="grid grid-cols-4 items-center gap-4">

                <Label className="text-right">Block</Label>

                <Select
                  value={formData.isBlocked}
                  onValueChange={(value: "Yes" | "No") =>
                    setFormData((prev) => ({
                      ...prev,
                      isBlocked: value,
                    }))
                  }
                >

                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Block user?" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>

                </Select>

              </div>
            )}
            {/* UPdate permision */}

            <div className="grid grid-cols-4 items-center gap-4">

              <Label className="text-right">Permission</Label>

              <Select
                value={formData.permission}
  onValueChange={(value: "Viewer" | "Member" | "Admin") => {
    setFormData((prev) => ({
      ...prev,
      permission: value,
    }));

    apiUpdatePermission(value);
  }}
              >

                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Permission" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                  <SelectItem value="Member">Editor</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>

              </Select>

            </div>
          </div>

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button type="submit">
              {user ? "Update User" : "Add User"}
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}