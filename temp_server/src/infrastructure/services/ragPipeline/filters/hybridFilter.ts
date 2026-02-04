export const hybridFilter = (refined: string) => {
  if(refined==="current_task_TaskModel")return {key:"status",value:"In Progress",model:"TaskModel"}
  if(refined==="unknown") return {key:null,value:"Your question doesn't match any information available in the knowledge base. Please try asking something related to tasks, projects, deadlines, or system data."}
  if(refined==="due_soon_TaskModel") return{key:null,value:"duesoon",model:"TaskModel"}
  const parts = refined.split("_");

  const value = parts[0];    // Reject
  const key = parts[1];      // approvalStatus
  const model = parts[2];    // TaskModel

  return { key, value, model };
};
