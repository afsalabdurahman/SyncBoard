export interface arryOfActivities {
  id: string;
  name: string;
  createdby: string;
}


export class Activities {
  workspaceActivities?: arryOfActivities;
  projectActivities?: arryOfActivities;
  userActivities?: arryOfActivities;

  constructor({
    workspaceActivities,
    projectActivities,
    userActivities,
  }: {
    workspaceActivities?: arryOfActivities;
    projectActivities?: arryOfActivities;
    userActivities?: arryOfActivities;
  }) {
    this.workspaceActivities = workspaceActivities;
    this.projectActivities = projectActivities;
    this.userActivities = userActivities;
  }

  toObject() {
    return {
      workspaceActivities: this.workspaceActivities,
      projectActivities: this.projectActivities,
      userActivities: this.userActivities,
    };
  }
}
