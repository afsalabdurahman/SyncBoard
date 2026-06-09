import { toast } from "react-toastify";
import {  useState } from "react";
import { ConfirmDialog } from "../../../Custom/ui/DeleteAlertButton";
import { Card, CardContent } from "../../../Custom/ui/card";
import { Badge } from "../../../Custom/ui/badge";
import { Button } from "../../../Custom/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar";
import {
  
  Users,
  Calendar,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import { WorkspaceMembersTable } from "./workspaceMembers";
import { cn } from "../../../Utility/utils";
import { useGetAlluserListQuery, useUpdateWorkspaceMutation } from "../../apis/fetchApi";
import { CloseIcon } from "../../../Custom/reusecomponents/CloseIcon";

export default function WorkspaceDetailsPage(props) {
  console.log(props,"Propss++")
  const [updateWorkspace, { isLoading: isUpdating }] = useUpdateWorkspaceMutation();
  const { data, isLoading } = useGetAlluserListQuery(
    { workspaceslug: props.viewDetails?.slug, page: 1, limit: 5 },
    { skip: !props.viewDetails?.slug }
  );

  const [statusToSet, setStatusToSet] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [sidebarCollapsed] = useState(false);

  const planColors = {
    free: "bg-gray-100 text-gray-800",
    basic: "bg-gray-100 text-gray-800",
    pro: "bg-purple-100 text-purple-800",
    enterprise: "bg-orange-100 text-orange-800",
  };

  const statusColors = {
    Active: "bg-green-100 text-green-800",
    suspended: "bg-red-100 text-red-800",
    Suspend: "bg-red-100 text-red-800", // in case backend uses "suspend"
    trial: "bg-blue-100 text-blue-800",
  };

  const suspend = () => {
    setStatusToSet("Suspend"); // or "suspend" — match what your backend expects
    setIsDialogOpen(true);
  };

  const reactivate = () => {
    setStatusToSet("Active");
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!statusToSet) return;

    try {
      await updateWorkspace({
        id: props.viewDetails.id,
        merge: { status: statusToSet },
      }).unwrap();

      toast.success(
        `Workspace ${statusToSet === "active" ? "reactivated" : "suspend"} successfully`
      );

      // Update local viewDetails state
      props.setViewDetails((prev) => ({
        ...prev,
        status: statusToSet,
      }));

      props.refetch?.();

      // Give toast time to appear before closing dialog
      setTimeout(() => {
        setIsDialogOpen(false);
        setStatusToSet(null);
      }, 600);

    } catch (err) {
    

      const errorMessage =
        err?.data?.message ||
        err?.error ||
        "Failed to update workspace status. Please try again.";

      toast.error(errorMessage);

      // Close dialog immediately on error
      setIsDialogOpen(false);
      setStatusToSet(null);
    }
  };

  if (isLoading || !props.viewDetails) {
    return <div className="p-10 text-center">Loading workspace details...</div>;
  }

  const currentStatus = props.viewDetails.status || "Active";

  return (
    <div className="min-h-screen bg-gray-50">
     
       

      <main className={cn("transition-all duration-300 pt-16", sidebarCollapsed ? "ml-16" : "ml-64")}>
        <div className="p-6 space-y-6">
          <div className="flex justify-end">
            <CloseIcon onClose={() => props.setDetails(null)} />
          </div>

          {/* Header */}
          <div className="rounded-xl bg-white border p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-14 w-14 rounded-lg">
                  <AvatarImage
                    src={props.viewDetails.avatar || "/placeholder.svg?height=56&width=56"}
                    alt={props.viewDetails.name}
                  />
                  <AvatarFallback className="text-xl">
                    {props.viewDetails.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900 truncate">
                      {props.viewDetails.name}
                    </h1>
                    <Badge
                      variant="outline"
                      className={planColors[props.viewDetails.plan] || "bg-gray-100"}
                    >
                      {props.viewDetails.plan?.toUpperCase() || "UNKNOWN"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={statusColors[currentStatus] || "bg-gray-100"}
                    >
                      {currentStatus.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2 flex-wrap">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      ID: {props.viewDetails.id?.slice(-8)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Created {new Date(props.viewDetails.createdAt).toLocaleDateString("en-US")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {currentStatus === "Active" || currentStatus === "trial" ? (
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50 gap-2"
                    onClick={suspend}
                    disabled={isUpdating}
                  >
                    <PauseCircle className="h-4 w-4" />
                    Suspend Workspace
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-700 gap-2"
                    onClick={reactivate}
                    disabled={isUpdating}
                  >
                    <PlayCircle className="h-4 w-4" />
                    Reactivate Workspace
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Members</p>
                    <p className="text-3xl font-bold mt-1">{props.viewDetails.members ?? 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add more cards if needed */}
          </div>

          {/* Members Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Members</h2>
            </div>

            <WorkspaceMembersTable
              members={data?.items ?? []}
              // onView={ }
              // onChangeRole={}
              // onSuspend={}
              // onRemove={}
            />
          </div>

          {/* Confirmation Dialog */}
          <ConfirmDialog
            open={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setStatusToSet(null);
            }}
            onConfirm={handleConfirm}
            title={
              statusToSet === "active"
                ? "Reactivate Workspace?"
                : "Suspend Workspace?"
            }
            description={
              statusToSet === "active"
                ? "This will allow users to access the workspace again."
                : "This will immediately prevent access for all members."
            }
          />
        </div>
      </main>
    </div>
  );
}