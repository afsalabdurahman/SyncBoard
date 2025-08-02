import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { toast, ToastContainer } from "react-toastify";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { X ,Trash2,XCircle } from "lucide-react"
import { ConfirmDialog } from "./DeleteAlertButton"
import { useEffect, useState } from "react"
import MinimalConfirmDialog from "./MinimalDelete"
import apiService from "../../services/api"
import {} from "../../Redux/workspace/admin/ProjectSlice"

export function Popup({isOpen,onClose,Url,type,projectId,deletdAUrl}:any) {
 
     const [urls,setUrls]=useState<string[]>(Url)
     const [deletedUrl,setDeletedUrl]=useState<string>("")

   const handleConfirmDelete = async() =>{
       try {
        const encodedUrl = encodeURIComponent(deletedUrl);
       const response= await apiService.delete(`project/remove/attachment/${projectId}/${encodedUrl}`)
        toast.success("Url is deleted")
       setUrls(prevUrls=>prevUrls.filter(url=>url!==deletedUrl))
        deletdAUrl(deletedUrl)
      setIsDialogOpen(false)
  
       } catch (error) {
        console.log(error,"response")
       }

  
   }
   let [isDialogOpen,setIsDialogOpen]=useState(false)
//  useEffect(()=>{

//  },[deleteUrl])

   
  return (
    <div>
       <ToastContainer position='top-center' autoClose={5000} />
        {isDialogOpen?<MinimalConfirmDialog open={isDialogOpen}
                onClose={() => {setIsDialogOpen(false)}}
                
                onConfirm={handleConfirmDelete}
                 />:
    <Popover open={isOpen} >
      <PopoverTrigger asChild>
                <div /> 
      </PopoverTrigger>
      
      <PopoverContent className="w-80">
        
        <div className="grid gap-4">
          <div className="space-y-2 flex items-center justify-between">
            <h4 className="leading-none font-medium">Attachments</h4>
            <XCircle onClick={()=>onClose()} className="text-red-500 cursor-pointer" />
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            {urls.length?null:<p> No attachments</p>}
              {urls.map((url: string,index:Number) => (
                <>
                  <a href={url} className="h-8 text-black truncate cursor-pointer">
                    https://res.cloudinary.com/{index+1}
                  </a>
                  <Trash2 onClick={() => {setIsDialogOpen(true),setDeletedUrl(url)}} className="text-red-500 cursor-pointer  w-4 h-4" />
                </>
              ))}
         
              
            
            </div>
           
          </div>
        </div>
           
      </PopoverContent>
    </Popover>
}
    </div>
  )
}
