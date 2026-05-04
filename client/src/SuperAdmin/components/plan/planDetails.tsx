
import React, { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

import { Button } from "../../../Custom/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../Custom/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../Custom/ui/dialog";
import { Input } from "../../../Custom/ui/input";
import { Label } from "../../../Custom/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../Custom/ui/select";
import { Switch } from "../../../Custom/ui/switch";
import { Badge } from "../../../Custom/ui/badge";
import { Separator } from "../../../Custom/ui/separator";
import { createPlan, deletePlan, removePlan, updatePlan, useFetchAllPlansQuery } from "../../apis/fetchApi"
import { toast } from "react-toastify";
import LoadingSpinner from "../../../Custom/reusecomponents/LoadingSpinner";
import { ConfirmDialog } from "../../../Custom/ui/DeleteAlertButton";



type BillingInterval = "month" | "year";

interface Plan {
  _id: string;
  name: string;
  description: string;
  priceCents: number;
  billingInterval: BillingInterval;
  features: string[];
  status: string;
}

const emptyPlan: Omit<Plan, "id"> = {
  name: "",
  description: "",
  priceCents: 0,
  billingInterval: "month",
  features: [""],
  status: "Active",
};

export const PlanDetails = () => {
  const { data, isLoading, error, refetch } = useFetchAllPlansQuery("");
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState(emptyPlan);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
const [deletePlanId,setDeletePlanId]= useState(null)
  const resetForm = () => {
    setForm(emptyPlan);
    setEditingPlan(null);
  };



  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setForm(plan);
    setOpen(true);
  };

  const handleSave = async () => {

    setLoading(true)
    if (editingPlan) {
      
try {
  await updatePlan(form,editingPlan._id);
   setLoading(false)
        toast.success("New plan is created")
        refetch()
} catch (error) {
   setLoading(false)
    if (error instanceof Error) {
       
          toast.error(error.message)
        }
}

    } else {
   

    
      //  setPlans((prev) => [...prev, newPlan]);
      try {
        await createPlan(form);
        setLoading(false)
        toast.success("New plan is created")
        refetch()
      } catch (error) {
        setLoading(false)
        if (error instanceof Error) {
    
          toast.error(error.message)
        }

      }
    }

    setOpen(false);
    resetForm();
  };

  // const handleDelete = (id: string) => {
  //   setPlans((prev) => prev.filter((p) => p.id !== id));
  // };

  const toggleActive = async (id: string) => {
    // setPlans((prev) =>
    //   prev.map((p) =>
    //     p.id === id
    //       ? { ...p, status: p.status === "Active" ? "Active" : "Inactive" }
    //       : p
    //   )
    // );
    // console.log(id,"id,")
   try {
     await removePlan(id);
     refetch()
   } catch (error) {
      if (error instanceof Error) {
       
          toast.error(error.message)
        }
   }
  };

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setForm((prev) => {
      const features = [...prev.features];
      features[index] = value;
      return { ...prev, features };
    });
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };
  const [sidebarCollapsed] = useState(false)

  if (isLoading) return <p>Loading plans...</p>;

  if (error) return <p>Failed to load plans</p>;
  const handleDeletePlan = (id)=>{
       setDeletePlanId(id);
    setIsDialogOpen(true);
  }
  const handleConfirmDelete = async()=>{
   
    try {
     await deletePlan(deletePlanId);
     toast.success("Deleted successfull");
     refetch()
    } catch (error) {
       if (error instanceof Error) {
       
          toast.error(error.message)
        }
    }
  }
  return (
    <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
 <ConfirmDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project?"
        description="This project will be permanently deleted."
      />
      {/* Header */}
     <div className="flex items-center justify-between mb-6">
  {/* Left Section */}
  <div>
    <h1 className="text-3xl font-bold tracking-tight">
      Subscription Plans
    </h1>
    <p className="text-muted-foreground mt-1">
      Create and manage your subscription offerings
    </p>
  </div>

  {/* Right Section */}
  <Button onClick={handleOpenCreate}>
    <Plus className="mr-2 h-4 w-4" />
    New Plan
  </Button>
</div>

      {/* Plans Grid */}
      {data.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <h3 className="text-lg font-medium">No plans yet</h3>
          <p className="text-muted-foreground mt-1 mb-6">
            Get started by creating your first subscription plan
          </p>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((plan) => (
            <Card
              key={plan._id}
              className={`overflow-hidden transition-all ${plan.active
                ? "border-primary/30 shadow-sm hover:shadow-md"
                : "opacity-75"
                }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <Badge variant={plan.status == "Active" ? "default" : "secondary"}>
                    {plan.status == "Active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription className="mt-1.5">
                  {plan.description || "No description"}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="text-3xl font-bold">
                  ${(plan.priceCents / 100).toFixed(2)}
                  <span className="text-lg font-normal text-muted-foreground">
                    /{plan.billingInterval}
                  </span>
                </div>

                <Separator className="my-5" />

                <ul className="space-y-2.5 text-sm">
                  {plan.features.filter(Boolean).map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="bg-muted/40 px-6 py-4 flex items-center justify-between">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(plan)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() =>  handleDeletePlan(plan._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={plan.status =="Active"}
                    onCheckedChange={() => toggleActive(plan._id)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {plan.status == "Active"?"Active" : "Inactive"}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog / Modal */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>

            <DialogTitle>
              {editingPlan ? "Edit Plan" : "Create New Plan"}
            </DialogTitle>
            <DialogDescription>
              {editingPlan
                ? "Make changes to your subscription plan."
                : "Add a new subscription tier for your customers."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                placeholder="Pro Plan"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Best value for growing teams"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (in cents)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="9900"
                  value={form.priceCents || ""}
                  onChange={(e) =>
                    setForm({ ...form, priceCents: Number(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="interval">Billing Interval</Label>
                <Select
                  value={form.billingInterval}
                  onValueChange={(value) =>
                    setForm({
                      ...form,
                      billingInterval: value as BillingInterval,
                    })
                  }
                >
                  <SelectTrigger id="interval">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={form.status}
                onCheckedChange={() =>
                  setForm({ ...form, status: "Active" })
                }
              />
              <Label htmlFor="active">
                Plan is {form.status == "Active" ? "Active" : "Inactive"}
              </Label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
                  + Add feature
                </Button>
              </div>

              {form.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="e.g. Unlimited users"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {loading && <LoadingSpinner />}
          <DialogFooter>

            <br />
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} >
              {editingPlan ? "Save Changes" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}