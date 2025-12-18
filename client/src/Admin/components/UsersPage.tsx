import { useState, useEffect } from "react";
import { Button } from "../../Custom/ui/button";
import apiService from "../../Services/apiServices/apiService";
import {TablePagination} from"@mui/material"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Custom/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../Custom/ui/table";
import { RootState } from "../../Redux/store";
import { AppDispatch } from "../../Redux/store";
import { ConfirmDialog } from "../../Custom/ui/DeleteAlertButton";
import { Badge } from "../../Custom/ui/badge";
import { UserModal } from "./UserModal";
import { Edit, Trash2, Plus, RotateCcw } from "lucide-react";
import { useSelector } from "react-redux";
import { setUsers, addUser, setUserPage } from "../../Redux/feature/users/AlluserSlice";
import { fetchAllUsers, removeUser } from "../../Redux/feature/users/AlluserThunks";
import { useDispatch } from "react-redux";
import { usePaginationUser, useUsers } from "../hooks/userhooks";
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isBlocked: string;
}

export function UsersPage() {
  //axios
  let users = useUsers()

  const [refreshKey, setRefreshKey] = useState(0);
  const [userss, setUserss] = useState<User[]>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage,setDialoqMessage]=useState({title:null,description:null})
  const dispatch:AppDispatch =  useDispatch();
   const {page,rowPerPage,totalItems,totalPage} = usePaginationUser()
  const workspaceslug = useSelector(
    (state: RootState) => state.workspace.workspace.slug
  );
  console.log(workspaceslug, "slugg");
  useSelector((state) => {
    console.log(state, "++++++++");
  });

//   useEffect(()=>{
// console.log(users)
//   },[users.length])

useEffect(()=>{
 dispatch(fetchAllUsers({page,limit:rowPerPage,workspaceslug}))
},[dispatch,refreshKey])

const handleChangePage = (event, newPage) => {
  
    dispatch(setUserPage(newPage + 1));
   dispatch(fetchAllUsers({ page: newPage + 1, limit: rowPerPage ,workspaceslug}));
  };


  // useEffect(() => {
  //   if (!workspaceslug) return; // prevent empty request

  //   apiService
  //     .get(`workspace/member/data/${workspaceslug}`)
  //     .then((response) => {
  //       console.log(response.data, "data fetch from api+++");
  //       dispatch(setUsers(response.data));
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, [userss,refreshKey]);

  console.log(users, "usersssss");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<string>("");
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
 


   
    // let updatedProfile= { isDelete: true };
    await dispatch(removeUser({deleteUser,updatedProfile:{isDeleted:true} })).unwrap()
    //  dispatch(fetchAllUsers(workspaceslug))
    setRefreshKey(5)
   
    }else{
   
      
         await dispatch(removeUser({deleteUser,updatedProfile:{isDeleted:false} })).unwrap()
    
  
    }
  // setRefreshKey((prev) => prev + 1);
   
  };

  // const openAddModal = () => {
  //   setEditingUser(null);
  //   setIsModalOpen(true);
  // };

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
        {/* <Button onClick={openAddModal}>
          <Plus className='mr-2 h-4 w-4' />
          Add User
        </Button> */}
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
                        user.isBlocked ? "Yes" : "No"
                      )}
                    >
                      {user.isBlocked ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getBlockBadgeVariant(
                        user.isDeleted ? "Yes" : "No"
                      )}
                    >
                      {user.isDeleted ? "Yes" : "No"}
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
                      {user.isAdmin?null:
                      <>
                        {user.isDeleted ? (
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
}
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
       <TablePagination
                  
                   component="div"
                   count={totalItems||0}
                   rowsPerPage={rowPerPage||0}
                   page={page-1}
                   onPageChange={handleChangePage||0}
                   
                    rowsPerPageOptions={[]}
                    
                 />
    </div>
  );
}
