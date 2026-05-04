import { useSelector } from "react-redux";
import KanbanBoard from "./KanbanBoard";
import { TaskDetailsPage } from "../pages/TaskDetailPage";
export default function Mytodo() {
const title=useSelector((state)=>{
  return state.forward.title

})
const id = title.split("-")[1];

if(title.includes("view")){
  return (<TaskDetailsPage id={id}/>)
}else{
return(<KanbanBoard/>)
}

  

}
