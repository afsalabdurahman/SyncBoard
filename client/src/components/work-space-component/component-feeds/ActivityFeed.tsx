import { useRef, useEffect, use } from "react";
import { Clock, UserPlus, Mail } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { socket } from "../../../services/socket";
import { setLog } from "../../../Redux/features/LogSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { fetchLogs } from "../../../Redux/features/LogSlices"
import type { AppDispatch } from "../../../Redux/store";

export default function ActivityFeed() {

 let navigate = useNavigate()
  const dispatch: AppDispatch = useDispatch();
  
  const logs= useSelector((state: RootState) => state.logsliceThunk.logArray.Logs || []);



  let isBlock=useSelector((state)=>{
    console.log(state?.user?.user?.isBlock,"block state")
 return state?.user?.user.isBlock
  })
 if(isBlock==true){
  navigate('/login')
}


  const getActivityIcon = (type: string) => {
    switch (type) {
      case "workspace":
        return <UserPlus className='text-blue-500' size={16} />;
      case "invite":
        return <Mail className='text-green-500' size={16} />;
      default:
        return <Clock className='text-gray-500' size={16} />;
    }
  };

  const getActivityText = (event: any) => {
    switch (event.target.type) {
      case "workspace":
        return (
          <p className='text-sm'>
             
           created this <span className="text-sm font-bold">{event.metadata.name}</span>
          </p>
        );
      case "invitation":
        return (
          <p className='text-sm'>
            <span className="text-sm font-bold">@{event.actor.name}</span>
            <span >_{event.action}</span>
            
          </p>
        );
      default:
        return <p className='text-sm'>{event.action}</p>;
    }
  };

  const formatDate = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // You can customize this format
  };
useSelector((state)=>{
  console.log(state,"state+++++")
})
 
  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch])

  return (


    <div className='mt-8 w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden max-w-[1000px] mx-auto'>
      <div className='px-6 py-4 bg-gray-50 border-b border-gray-100'>
        <h2 className='text-lg font-medium text-gray-800'>Activities</h2>
      </div>

      <div className='divide-y divide-gray-100'>
       {logs
  .slice() // create a copy to avoid mutating the original array
  .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  .map((event: any, index: number) => (
    <div key={index} className='px-6 py-4 flex items-start'>
      

      <div className='flex-1'>
        <div className='flex items-center space-x-2 mb-1'>
          <p className='text-sm text-gray-400'>
         
            {formatDate(event.timestamp || new Date())}
          </p>
          <span className='flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full'>
            {getActivityIcon(event.target?.type)}
          </span>
        </div>
        {getActivityText(event)}
      </div>
    </div>
))}

      </div>

      {logs.length === 0 && (
        <div className='px-6 py-8 text-center'>
          <p className='text-gray-500'>No recent activities</p>
        </div>
      )}
    </div>
  );
}
