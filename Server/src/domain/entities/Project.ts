class Project {
  id?: string;
  name?: string;
  description?: string;
  assignedUsers?: [string];
  deadline?: Date;
  status?: string;
  priority?: string;
  clientName?: string;
  projectAdminId?: string;
  attachedUrl?: [string];
  createdAt?: Date;
  updateAt?: Date;

  constructor(
    id?: string,
    name?: string,
    description?: string,
    assignedUsers?: [string],
    deadline?: Date,
    status?: string,
    priority?: string,
    clientName?: string,
    projectAdminId?: string,
    attachedUrl: [string],
    createdAt: Date,
    updateAt: Date
  ) {
    this.id=id;
    this.assignedUsers=assignedUsers;
    this.attachedUrl=attachedUrl;
    this.clientName=clientName;
    this.createdAt=createdAt;
    this.deadline=deadline;
    this.description=description;
    this.name=name;
    this.priority=priority;
    this.projectAdminId=projectAdminId;
    this.status=status;
    this.updateAt=updateAt;
  }
  
}
