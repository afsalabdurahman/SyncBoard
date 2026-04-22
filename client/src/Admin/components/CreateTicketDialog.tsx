import { useState } from "react";
import { Ticket } from "../types/TiketTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../Custom/ui/dialog";
import { Button } from "../../Custom/ui/button";
import { Input } from "../../Custom/ui/input";
import { Textarea } from "../../Custom/ui/textarea";
import { Label } from "../../Custom/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Custom/ui/select";


interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "messages">) => void;
}

const CreateTicketDialog = ({ open, onOpenChange, onCreateTicket }: CreateTicketDialogProps) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Ticket["priority"]>("medium");
   const [category,setCategoty]=useState("technical")
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

   

    onCreateTicket({
      title: title.trim(),
      description: description.trim(),
      status: "open",
      priority,
      category,
      workspaceId: "",
      userId: "",
      _id: "",
      SLno: ""
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategoty("")



    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>
            Submit a new support request to the super admin team
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
               <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategoty( e.target.value )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        
                        <option value="technical">Technical Issue</option>
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="access">Access / Permissions</option>
                        <option value="performance">Performance Issue</option>
                        <option value="integration">Integration Problem</option>
                        <option value="billing">Billing / Account</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

           
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as Ticket["priority"])}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Ticket</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
