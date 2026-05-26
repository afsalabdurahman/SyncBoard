import { useState, useEffect } from "react";
import { Button } from "../../Custom/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Custom/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../../Custom/ui/popover";
import { Badge } from "../../Custom/ui/badge";
import { Bell, X, User, MessageSquare, Heart, Settings,Briefcase } from "lucide-react";
import { Notification } from "../types/workspaceTypes";
import { socket } from "../../Services/socket";
import { useUser, useWorkspaceSlug } from "../hooks/workspacehooks";
import { acceptInvitaion, rejectInvitaion } from "../apis/workspaceapis";
import { useDispatch } from "react-redux";
import { toggleForward } from "../../Redux/feature/ForwardSlice";


export default function NotificationBell(props) {
 const user= useUser()
const email = user?.email as string
  const [isOpen, setIsOpen] = useState(false);
  const [apiMgs , setApiMsg] =useState("");
  const slug = useWorkspaceSlug()
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // To add a new notification from props.message, use an effect or event handler like below:
  useEffect(() => {
    if (props.messages)
      setNotifications((prev) => [...prev, { message: props.messages }]);
  }, [props.messages]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className='w-4 h-4 text-blue-500' />;
      case "like":
        return <Heart className='w-4 h-4 text-red-500' />;
      case "follow":
        return <User className='w-4 h-4 text-green-500' />;
      case "system":
        return <Settings className='w-4 h-4 text-gray-500' />;
        case "workspace":
           return <Briefcase className='w-4 h-4 text-gray-500' />;
      default:
        return <Bell className='w-4 h-4' />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };
const dispatch = useDispatch()
// useEffect(()=>{
// socket.on( email,(data:Notification)=>{
//     setNotifications( [{ message: data.message,workspaceName:data.workspaceName,type:"workspace" }]);
// })
// socket.on(slug,(data:Notification)=>{
//    setNotifications( [{ message: data.message,type:"system" }]);
// })
// },[email,slug])
useEffect(() => {
  const workspaceHandler = (data: Notification) => {
    setNotifications((prev) => [
      ...prev,
      {
        message: data.message,
        workspaceName: data.workspaceName,
        type: "workspace",
      },
    ]);
  };

  const systemHandler = (data: Notification) => {
    setNotifications((prev) => [
      ...prev,
      {
        message: data.message,
        type: "system",
      },
    ]);
  };

  socket.on(email, workspaceHandler);
  socket.on(slug, systemHandler);

  return () => {
    socket.off(email, workspaceHandler);
    socket.off(slug, systemHandler);
  };
}, [email, slug,notifications]);





const acceptHandle = async(name:string)=>{
const slug =name.split("-")[1]
  const response=await acceptInvitaion(user?._id??"",slug);
console.log(name,notifications,"notifiactions")
 setNotifications((prev) =>
    prev.map((notification) =>
      notification.workspaceName === name
        ? { ...notification, type: "dea",message: response}
        : notification
    )
  );
 
  dispatch(toggleForward())
}

const rejectHandle=async(name:string)=>{
  const slug =name.split("-")[1]
   setNotifications((prev) =>
    prev.map((notification) =>
      notification.workspaceName === name
        ? { ...notification, type: "dea",message: "Invitation rejected 🚫. Thank you for your response to "+"slug"}
        : notification
    )
  );
await rejectInvitaion(slug,user?.email??"")

 
}
  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
    <PopoverTrigger asChild>
  <button 
    className="relative h-12 w-12 hover:bg-dark-100 bg-transparent cursor-pointer flex items-center justify-center"
  >
    <Bell className="w-5 h-5" />
    {unreadCount > 0 && (
      <Badge
        variant="destructive"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
      >
        {unreadCount > 9 ? "9+" : unreadCount}
      </Badge>
    )}
  </button>
</PopoverTrigger>
        <PopoverContent className='w-80 p-0' align='end'>
          <Card className='shadow-none border-0'>
            <CardHeader className='border-b bg-gray-50/50'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg'>Notifications</CardTitle>
                  <CardDescription>
                    {unreadCount > 0
                      ? `You have ${unreadCount} unread notifications`
                      : "All caught up!"}
                  </CardDescription>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setIsOpen(false)}
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
              {notifications.length > 0 && (
                <div className='flex gap-2 pt-2'>
                  {unreadCount > 0 && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={markAllAsRead}
                      className='text-xs bg-transparent'
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={clearAll}
                    className='text-xs bg-transparent'
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className='p-0'>
              {notifications.length === 0 ? (
                <div className='p-6 text-center text-gray-500'>
                  <Bell className='w-12 h-12 mx-auto mb-2 text-gray-300' />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className='max-h-96 overflow-y-auto'>
                  {notifications.map((notification:Notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className='flex items-start gap-3'>
                        <div className='flex-shrink-0 mt-1'>
                          {getIcon(notification.type)}
                        </div>
                       <div className="flex-1 min-w-0">
  {/* Header */}
  <div className="flex items-start justify-between gap-2">
    <p className="text-sm font-semibold text-gray-900 truncate">
      {notification.title}
    </p>

    {!notification.read && (
      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
    )}
  </div>

  {/* Message */}
 <p className="mt-1 text-sm leading-relaxed text-gray-600 line-clamp-2">
  {notification.message}

  {notification.workspaceName && (
    <>
      {" "}
      <span className="font-semibold text-blue-600">
        {notification.workspaceName}
      </span>
    </>
  )}
</p>

  {/* Time */}
  <p className="mt-2 text-xs font-medium text-gray-400">
    {notification.time}
  </p>

  {/* Action Buttons */}
  {notification.type === "workspace" && (
    <div className="flex items-center gap-2 mt-4">
      <button onClick={()=>acceptHandle(notification?.workspaceName??"")}
        className="px-3 py-1.5 text-sm font-medium text-white transition bg-green-600 rounded-lg hover:bg-green-700"
      >
        Accept
      </button>

      <button onClick={()=>rejectHandle(notification?.workspaceName??"")}
        className="px-3 py-1.5 text-sm font-medium text-red-600 transition border border-red-200 rounded-lg hover:bg-red-50"
      >
        Reject
      </button>
        {notification.apiMsg && (
  <p className="mt-2 text-sm font-medium text-gray-600">
    {notification.apiMsg}
  </p>
)}
    </div>
   
  )}
 
</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
