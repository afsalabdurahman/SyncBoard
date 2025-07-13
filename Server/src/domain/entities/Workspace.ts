import { ObjectId } from "mongoose";

interface Member {
  userId: string;
  title: string;
}
export class Workspace {
  constructor(
    public name: string,
    public slug: string,
    public role: string,
    public ownerId: string,
    public members: Member[],
    // optional
    public createdAt: Date = new Date()
  ) {}
}
