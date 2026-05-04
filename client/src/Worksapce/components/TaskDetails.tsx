import { useDispatch } from "react-redux";
import { setTitle } from "../../Redux/feature/ForwardSlice";


export const TaskDetails = ({taskId}) => {
  const dispatch= useDispatch();

 
  return (
  <div className="text-center">
    
    
   
     
            <button className="text-link hover:text-link-hover font-medium underline underline-offset-4 transition-colors cursor-pointer" onClick={()=>dispatch(setTitle(`view-${taskId}`))}>
              View Details
            </button>
       
        
          
              
             
       {/* <TaskDetailsPage/> */}
             
         
       
      
    
    </div>
  );
};


