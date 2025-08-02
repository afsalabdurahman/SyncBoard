import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { useDispatch } from "react-redux";
import apiService from "../../services/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ConfirmDialog } from "../../components/ui/DeleteAlertButton";
import { Badge } from "../../components/ui/badge";
import { UserModal } from "./UserModal";
import { Edit, Trash2, Plus, RotateCcw } from "lucide-react";
import { useSelector } from "react-redux";
import { setUsers, addUser } from "../../Redux/features/AlluserSlice";
import { describe } from "node:test";
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isBlock: string;
}

export function UsersPage() {
  //axios
  let users = useSelector((state: any) => {
    console.log(state, "stetete");
    return state.alluser.users;
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [userss, setUserss] = useState<User[]>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage,setDialoqMessage]=useState({title:null,description:null})
  let dispacth = useDispatch();
  const workspaceslug = useSelector(
    (state: any) => state.workspace.workspace.slug
  );
  console.log(workspaceslug, "slugg");
  useSelector((state) => {
    console.log(state, "++++++++");
  });

  useEffect(() => {
    if (!workspaceslug) return; // prevent empty request

    apiService
      .get(`workspace/member/data/${workspaceslug}`)
      .then((response) => {
        console.log(response.data, "data fetch from api+++");
        dispacth(setUsers(response.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userss,refreshKey]);

  console.log(users, "usersssss");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState("");
  const [restoreUser,setRestoreUser]=useState("")
  console.log(editingUser, "edit userFuncion return");
  console.log(users, "users");
  const handleAddUser = (userData: Omit<User, "id">) => {
    const newUser = {
      ...userData,
      id: Math.max(...users.map((u) => u.id)) + 1,
    };
    setUserss([...users, newUser]);
  };

  const handleEditUser = (userData: Omit<User, "id">) => {
    if (editingUser) {
      setUserss(
        users.map((user) =>
          user.id === editingUser.id
            ? { ...userData, id: editingUser.id }
            : user
        )
      );
    }
  };
  const handleUNDeleteUser = (id: string) => {
    console.log("undelete");
    setDeleteUser(id)
        setDialoqMessage({
  title: "Do you want to restore",
  description: "This action cause restore user."
});
 setIsDialogOpen(true);
  };
  const handleDeleteUser = (id: number) => {
    setDeleteUser(id);
    setDialoqMessage({
  title: "Do you want to remove",
  description: "This action cause remove user."
});

    setIsDialogOpen(true);
    console.log(id, "delete clicked");
    // setUserss(users.filter((user) => user.id !== id));
  };
  const handleConfirm = async (confirm) => {
    console.log(confirm,"confir")
    if(confirm.includes("remove")){
  let updatedProfile= { isDelete: true };
   try {
      const response= await apiService.patch(
        `member/profile/update/${deleteUser}`,
        {
          profileData: updatedProfile, // Use the up-to-date object
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error)
    }
    }else{
        let updatedProfile= { isDelete: false };
       try {
      const response= await apiService.patch(
        `member/profile/update/${deleteUser}`,
        {
          profileData: updatedProfile, // Use the up-to-date object
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error)
    }
    }
  setRefreshKey((prev) => prev + 1);
   
  };

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
const closeDialog = () =>{
  setDialoqMessage({title:null,description:null})
  setIsDialogOpen(false)
}
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Owner":
        return "primary";
      case "Admin":
        return "destructive";
      case "Member":
        return "default";
      case "Viewer":
        return "secondary";
      default:
        return "default";
    }
  };
  const getBlockBadgeVariant = (block: string) => {
    switch (block) {
      case "Yes":
        return "destructive";
      case "No":
        return "default";

      default:
        return "default";
    }
  };

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>Users</h2>
        <Button onClick={openAddModal}>
          <Plus className='mr-2 h-4 w-4' />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Block/Unblock</TableHead>
                <TableHead>Remove</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{user.title}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getBlockBadgeVariant(
                        user.isBlock ? "Yes" : "No"
                      )}
                    >
                      {user.isBlock ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getBlockBadgeVariant(
                        user.isDelete ? "Yes" : "No"
                      )}
                    >
                      {user.isDelete ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openEditModal(user)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <>
                        {user.isDelete ? (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleUNDeleteUser(user._id)}
                          >
                            <RotateCcw className='h-4 w-4' />
                          </Button>
                        ) : (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        )}
                      </>
                    </div>
                  </TableCell>
                </TableRow>
              ))}{" "}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        user={editingUser}
      />
      <ConfirmDialog
        open={isDialogOpen}
        onClose={() => closeDialog()}
        onConfirm={()=>handleConfirm(dialogMessage.title)}
        title={dialogMessage.title}
        description={dialogMessage.description}
      />
    </div>
  );
}
