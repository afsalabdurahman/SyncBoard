import mongoose, { Document, Schema } from "mongoose";

const activityItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  createdby: { type: String, required: true },
  message:{type:String}
});
const ActivitySchema = new Schema(
  {
    workspaceActivities: { type: [activityItemSchema], default: [] },
    projectActivities: { type: [activityItemSchema], default: [] },
    userActivities: { type: [activityItemSchema], default: [] },
  },
  { timestamps: true } // optional: adds createdAt and updatedAt
);
export const ActivityModel = mongoose.model("Activity", ActivitySchema);
