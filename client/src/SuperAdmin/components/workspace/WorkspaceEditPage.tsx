// WorkspaceEditPage.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { ConfirmDialog } from "../../../Custom/ui/DeleteAlertButton";
import { useUpdateWorkspaceMutation } from "../../apis/fetchApi";
import { CloseIcon } from "../../../Custom/reusecomponents/CloseIcon";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../Custom/ui/card";
import { Input } from "../../../Custom/ui/input";
import { Label } from "../../../Custom/ui/label";
import { Button } from "../../../Custom/ui/button";
import { Badge } from "../../../Custom/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar";

import {
  Building2,
  Calendar,
  Users,
  Crown,
  
  AlertTriangle,
  Save,
  CheckCircle,
} from "lucide-react";

import { cn } from "../../../Utility/utils";

export default function WorkspaceEditPage({
  viewDetails,
  setDetails,
  refetch,
  setViewDetails,
}) {
  const [updateWorkspace, { isLoading }] = useUpdateWorkspaceMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusToSet, setStatusToSet] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    planKey: "free",
    status:"active"
  });

  useEffect(() => {
    if (!viewDetails) return;

    setFormData({
      name: viewDetails.name || "",
      description: viewDetails.description || "",
      planKey: viewDetails.plan || "free",
    });
  }, [viewDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlanChange = (newPlan) => {
    setFormData((prev) => ({ ...prev, planKey: newPlan }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateWorkspace({
        id: viewDetails.id,
        merge: formData,
      }).unwrap();

      toast.success("Workspace updated successfully");
      setViewDetails((prev) => ({ ...prev, name: formData.name, plan: formData.planKey }));
      refetch?.();
    } catch (err) {
  
      const errorMsg =
        err?.data?.message ||
        err?.error ||
        "Failed to update workspace. Please try again.";
      toast.error(errorMsg);
    }
    
    //  setDetails(null)
  };

  const requestStatusChange = (newStatus) => {
    setStatusToSet(newStatus);
    setDialogOpen(true);
  };

const confirmStatusChange = async () => {
    if (!statusToSet) return;

    try {
      await updateWorkspace({
        id: viewDetails.id,
        merge: { status: statusToSet },
      }).unwrap();

      toast.success(
        `Workspace ${statusToSet === "active" ? "reactivated" : "suspended"} successfully`
      );

      setViewDetails((prev) => ({ ...prev, status: statusToSet }));
      refetch?.();

      // Small delay so toast appears before closing dialog
      setTimeout(() => {
        setDialogOpen(false);
        setStatusToSet(null);
      }, 700);

    } catch (err: unknown) {
      const errorMsg = err?.data?.message || "Failed to update workspace status";
      toast.error(errorMsg);

      // Close dialog immediately on error
      setDialogOpen(false);
      setStatusToSet(null);
    }
  };

  if (!viewDetails) return <div className="p-10 text-center">Loading workspace...</div>;

  const isFree = formData.planKey === "free";

  return (
    <div className="min-h-screen bg-gray-50/70 pb-24 ml-[15em]">
      <form onSubmit={onSubmit} className="mx-auto max-w-6xl px-5 py-18 space-y-8">
        {/* <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        /> */}

        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b px-6 py-4 -mx-5 md:-mx-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-1 ring-gray-200">
              <AvatarImage src={viewDetails.avatar} />
              <AvatarFallback className="bg-blue-100 text-blue-800 text-xl font-semibold">
                {viewDetails.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{viewDetails.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-medium px-3 py-1",
                    isFree
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {viewDetails.plan?.toUpperCase() || "FREE"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ID: {viewDetails.id?.slice(-8)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-1.5 min-w-[180px]"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Update Workspace"}
            </Button>
            <CloseIcon onClose={() => setDetails(null)} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickStatCard
            icon={Users}
            label="Members"
            value={viewDetails.members ?? 0}
            color="blue"
          />
          <QuickStatCard
            icon={Calendar}
            label="Created"
            value={
              viewDetails.createdAt
                ? format(new Date(viewDetails.createdAt), "MMM d, yyyy")
                : "—"
            }
            color="purple"
          />
        </div>

        {/* General */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Workspace Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter workspace name"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (read-only)</Label>
              <Input
                value={viewDetails.slug || ""}
                disabled
                className="bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Plan Selection */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              Subscription Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: "free", label: "Free", icon: Infinity, color: "gray" },
                { id: "basic", label: "Basic", icon: CheckCircle, color: "blue" },
                { id: "pro", label: "Pro", icon: Crown, color: "amber" },
                {
                  id: "enterprise",
                  label: "Enterprise",
                  icon: Users,
                  color: "violet",
                },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePlanChange(p.id)}
                  className={cn(
                    "relative flex flex-col items-center p-6 border-2 rounded-xl transition-all hover:shadow-md",
                    formData.planKey === p.id
                      ? `border-${p.color}-500 bg-${p.color}-50 ring-2 ring-${p.color}-300/50`
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <p.icon
                    className={cn("h-10 w-10 mb-3", `text-${p.color}-600`)}
                  />
                  <span className="font-semibold text-lg">{p.label}</span>
                  {formData.planKey === p.id && (
                    <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      Active
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
      
      </form>
  <Card className="border-red-200 bg-red-50/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewDetails.status === "active" ? (
              <Button
                variant="destructive"
                onClick={() => requestStatusChange("suspend")}
              >
                Suspend Workspace
              </Button>
            ) : (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => requestStatusChange("active")}
              >
                Reactivate Workspace
              </Button>
            )}
          </CardContent>
        </Card>


      <ConfirmDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setStatusToSet(null);
        }}
        onConfirm={confirmStatusChange}
        title={
          statusToSet === "suspend"
            ? "Suspend Workspace?"
            : "Reactivate Workspace?"
        }
        description="This action can be reversed later, but may affect users immediately."
      />
    </div>
  );
}

function QuickStatCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("p-3 rounded-full", `bg-${color}-100`)}>
          <Icon className={cn("h-6 w-6", `text-${color}-700`)} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}