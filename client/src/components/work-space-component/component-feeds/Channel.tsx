import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Users,
  MoreVertical,
  Smile,
  Paperclip,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useSelector } from "react-redux";
import { socket } from "../../../services/socket";
import apiService from "../../../services/api";

export default function Channel() {
  const [messages, setMessages] = useState(["You"]);
  const user = useSelector((state: any) => state.user.user.name);
  const userId = useSelector((state: any) => state.user.user._id);

  const [input, setInput] = useState("");
  const [onlineUsers, setOnlineUser] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    apiService.get("chat/online").then((res) => {
      console.log(res, "response online status");
             const users=res.data.map((user)=>{
       if(user.name==user){
         return null
       }else{
        return user.name
       }

             })
      setOnlineUser([...onlineUsers,...users])
    });
    apiService
      .get("chat/history")
      .then((resp) => {
        let data = resp.data;
        setMessages(
          data.map((e: any, index: any) => {
            return {
              id: index,
              sender: e.senderName,
              content: e.content,
              isOwn: e.senderName == user ? true : false,
            };
          })
        );
      })
      .catch((error) => {
        console.log(error, "errror api");
      });

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });
    socket.emit("UserId", userId);

  //  socket.on("userStatus", Onlinestatus);

    const handleChatHistory = (msgs: any) => {
      setMessages(msgs);
    };

    const handleReceiveMessage = (msg: any) => {
      let update: any = { ...msg };
      if (msg.sender == user) {
        //  update.id= msg.sender.length + 1,
        update.isOwn = true;
        update.sender = "You";
        update.timestamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        update.avatar = "YU";
      } else {
        update.isOwn = false;
        update.timestamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      setMessages((prev): any => [...prev, update]);

      //  setInput(...input,msg)
    };
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      // socket.off("chat-history", handleChatHistory);
      socket.off("receive-message", handleReceiveMessage);
     // socket.off("UserStatus", Onlinestatus);
    };
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  console.log(onlineUsers, "onlines");
  console.log(messages, "msg++");
  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("send-message", { sender: user, content: input });
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        content: input.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "YU",
        isOwn: true,
      };
      // setMessages([...messages, newMessage]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getAvatarColor = (sender) => {
    const colors = {
      "Alice Johnson": "bg-purple-500",
      Manu: "bg-blue-500",
      "Sarah Davis": "bg-green-500",
      You: "bg-indigo-500",
    };
    return colors[sender] || "bg-gray-500";
  };

  return (
    <div className='flex h-screen bg-gray-50 mt-[3em]'>
      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-80"
        } transition-all duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col`}
      >
        {/* Header */}
        <div className='p-4 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            {!sidebarCollapsed ? (
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center'>
                  <Users className='w-5 h-5 text-white' />
                </div>
                <div>
                  <h2 className='font-semibold text-gray-900'>Project Team</h2>
                  <p className='text-sm text-gray-500'>
                    {onlineUsers.length} members
                  </p>
                </div>
              </div>
            ) : (
              <div className='w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mx-auto'>
                <Users className='w-5 h-5 text-white' />
              </div>
            )}
            {!sidebarCollapsed && (
              <button className='p-2 hover:bg-gray-100 rounded-full'>
                <MoreVertical className='w-5 h-5 text-gray-500' />
              </button>
            )}
          </div>
        </div>

        {/* Collapse Toggle Button */}
        <div className='px-4 py-2 border-b border-gray-200'>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className='w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            {sidebarCollapsed ? (
              <Menu className='w-5 h-5 text-gray-500' />
            ) : (
              <div className='flex items-center space-x-2'>
                <ChevronLeft className='w-5 h-5 text-gray-500' />
                <span className='text-sm text-gray-600'>Collapse</span>
              </div>
            )}
          </button>
        </div>

        {/* Online Users */}
        <div className='p-4 flex-1 '>
          {!sidebarCollapsed ? (
            <>
              <h3 className='text-sm font-medium text-gray-700 mb-3'>
                Online ({onlineUsers.length})
              </h3>
              <div className='space-y-3'>
                {onlineUsers.map((user, index) => (
                  <div key={index} className='flex items-center space-x-3'>
                    <div className='relative'>
                      <div
                        className={`w-8 h-8 ${getAvatarColor(
                          user
                        )} rounded-full flex items-center justify-center`}
                      >
                        <span className='text-xs font-medium text-white'>
                          {user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full'></div>
                    </div>
                    <span className='text-sm text-gray-700'>{user}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='space-y-4'>
              {onlineUsers.map((user, index) => (
                <div key={index} className='flex justify-center'>
                  <div className='relative'>
                    <div
                      className={`w-8 h-8 ${getAvatarColor(
                        user
                      )} rounded-full flex items-center justify-center`}
                    >
                      <span className='text-xs font-medium text-white'>
                        {user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full'></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Chat Header */}
        <div className='bg-white border-b border-gray-200 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className='p-2 hover:bg-gray-100 rounded-full lg:hidden'
                >
                  <Menu className='w-5 h-5 text-gray-500' />
                </button>
              )}
              <div>
                <h1 className='text-lg font-semibold text-gray-900'>
                  Project Team Chat
                </h1>
                <p className='text-sm text-gray-500'>
                  Last seen today at 10:37 AM
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <button className='p-2 hover:bg-gray-100 rounded-full'>
                <MoreVertical className='w-5 h-5 text-gray-500' />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className='flex-1  p-4 space-y-4 bg-gray-50'>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex ${
                  msg.isOwn ? "flex-row-reverse" : "flex-row"
                } items-end space-x-2 max-w-md`}
              >
                {!msg.isOwn && (
                  <div
                    className={`w-8 h-8 ${getAvatarColor(
                      msg.sender
                    )} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <span className='text-xs font-medium text-white'>
                      {msg.avatar}
                    </span>
                  </div>
                )}
                <div className={`${msg.isOwn ? "mr-2" : "ml-2"}`}>
                  {!msg.isOwn && (
                    <p className='text-xs text-gray-500 mb-1 ml-1'>
                      {msg.sender}
                    </p>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.isOwn
                        ? "bg-indigo-500 text-white rounded-br-md"
                        : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                    }`}
                  >
                    <p className='text-sm'>{msg.content}</p>
                  </div>
                  <p
                    className={`text-xs text-gray-400 mt-1 ${
                      msg.isOwn ? "text-right mr-1" : "ml-1"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className='bg-white border-t border-gray-200 p-4'>
          <div className='flex items-center space-x-3'>
            <button className='p-2 hover:bg-gray-100 rounded-full'>
              <Paperclip className='w-5 h-5 text-gray-500' />
            </button>
            <div className='flex-1 relative'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Type a message...'
                className='w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
              />
              <button className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full'>
                <Smile className='w-5 h-5 text-gray-500' />
              </button>
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className='p-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors'
            >
              <Send className='w-5 h-5 text-white' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
