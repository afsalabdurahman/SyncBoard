import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Badge } from "../../ui/badge";
import { Bell, X, User, MessageSquare, Heart, Settings } from "lucide-react";

interface Notification {
  id?: string;
  title?: string;
  message: string;
  time?: string;
  type?: "message" | "like" | "follow" | "system";
  read?: boolean;
}

export default function NotificationBell(props: any) {
  console.log(props.messages, "props++++");
  console.log(props, "props");
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button className='relative  h-12 w-12 hover:bg-dark-100 bg-transparent cursor-pointer'>
            <Bell className='w-5 h-5' />
            {unreadCount > 0 && (
              <Badge
                variant='destructive'
                className='absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs'
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
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
                  {notifications.map((notification) => (
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
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm font-medium text-gray-900 truncate'>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2' />
                            )}
                          </div>
                          <p className='text-sm text-gray-600 mt-1 line-clamp-2'>
                            {notification.message}
                          </p>
                          <p className='text-xs text-gray-400 mt-2'>
                            {notification.time}
                          </p>
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
