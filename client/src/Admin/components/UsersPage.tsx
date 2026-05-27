import { useEffect, useState } from "react";
import { Button } from "../../Custom/ui/button";
import { TablePagination } from "@mui/material";

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

import { Badge } from "../../Custom/ui/badge";
import { ConfirmDialog } from "../../Custom/ui/DeleteAlertButton";
import { UserModal } from "./UserModal";

import { Edit, Trash2, RotateCcw } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";

import {
  fetchAllUsers,
  removeUser,
} from "../../Redux/feature/users/AlluserThunks";

import { setUserPage } from "../../Redux/feature/users/AlluserSlice";

import { usePaginationUser, useUsers } from "../hooks/userhooks";
import { DialogMessage, userPage } from "../types/userTypes";
import { toast } from "react-toastify";
import { useWorkspaceid } from "../../Worksapce/hooks/workspacehooks";

/* ---------------- TYPES ---------------- */





/* ---------------- COMPONENT ---------------- */

export function UsersPage() {
  const projectID=useSelector((state)=>state.switch.projectId);
  
  const dispatch = useDispatch<AppDispatch>();
const workspaceid = useWorkspaceid();

  const users = useUsers();

  const { page, rowPerPage, totalItems } = usePaginationUser();

  const workspaceSlug = useSelector(
    (state: RootState) => state.workspace.workspace.slug
  );

  const [refreshKey, setRefreshKey] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<userPage | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [deleteUserId, setDeleteUserId] = useState<string>("");

  const [dialogMessage, setDialogMessage] = useState<DialogMessage>({
    title: null,
    description: null,
  });

  /* ---------------- FETCH USERS ---------------- */

  useEffect(() => {
    dispatch(
      fetchAllUsers({
        page,
        limit: rowPerPage,
        workspaceslug: workspaceSlug,
        projectId:projectID
      })
    );
  }, [dispatch, refreshKey, page, rowPerPage, workspaceSlug,projectID]);

  /* ---------------- PAGINATION ---------------- */

  const handleChangePage = (_: unknown, newPage: number) => {
    dispatch(setUserPage(newPage + 1));
  };

  /* ---------------- DELETE ---------------- */

  const handleDeleteUser = (id: string) => {
    setDeleteUserId(id);

    setDialogMessage({
      title: "Do you want to remove this user?",
      description: "This action will remove the user.",
    });

    setIsDialogOpen(true);
  };

  /* ---------------- RESTORE ---------------- */

  const handleRestoreUser = (id: string) => {
    setDeleteUserId(id);

    setDialogMessage({
      title: "Do you want to restore this user?",
      description: "This action will restore the user.",
    });

    setIsDialogOpen(true);
  };

  /* ---------------- CONFIRM ---------------- */

  const handleConfirm = async () => {

    const isRestore = dialogMessage.title?.includes("restore");

    await dispatch(
      removeUser({
        deleteUser: deleteUserId,
        updatedProfile: { isDeleted: !isRestore },
      })
    ).unwrap();
toast.success("Update successfull")
    setRefreshKey((prev) => prev + 1);

    setIsDialogOpen(false);
  };

  /* ---------------- MODAL ---------------- */

  const openEditModal = (user: userPage) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeDialog = () => {
    setDialogMessage({ title: null, description: null });
    setIsDialogOpen(false);
  };

  /* ---------------- BADGES ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>

      <Card>

        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members and roles
          </CardDescription>
        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Blocked</TableHead>
                <TableHead>Removed</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {users.map((user) => (

                <TableRow key={user._id}>

                  <TableCell>{user.name}</TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Badge>{user.title}</Badge>
                  </TableCell>
 <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={user.isBlocked ? "destructive" : "default"}>
                      {user.isBlocked ? "Yes" : "No"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={user.isDeleted ? "destructive" : "default"}>
                      {user.isDeleted ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
<TableCell>
  <Badge>
    {
      user.workspace?.find(
        (workspace) => workspace.workspaceId === workspaceid
      )?.permissions || "No Permission"
    }
  </Badge>
</TableCell>
                  <TableCell className="text-right">

                    <div className="flex justify-end gap-2">

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {!user.isAdmin && (
                        user.isDeleted ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreUser(user._id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )
                      )}

                    </div>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {}}
        user={editingUser}
      />

      <ConfirmDialog
        open={isDialogOpen}
        onClose={closeDialog}
        onConfirm={handleConfirm}
        title={dialogMessage.title}
        description={dialogMessage.description}
      />

      <TablePagination
        component="div"
        count={totalItems}
        rowsPerPage={rowPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
      />

    </div>
  );
}