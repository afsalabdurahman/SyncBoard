import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Hash,
  MoreVertical,
  Smile,
  Paperclip,
  ChevronLeft,
  Menu,
  Bell,
  Mic,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  File,
} from "lucide-react";
import { useSelector } from "react-redux";
import { socket } from "../../Services/socket";
import EmojiPicker from "emoji-picker-react"; // npm install emoji-picker-react
import { useUser, useWorkspaceid } from "../hooks/workspacehooks";
import { audioUpload, uploadAttachment, uploadVideo } from "../../Services/Cloudinary";
import { toast } from "react-toastify";
import { channelAttachement } from "../../Utility/attachmentValidation";
import { RootState } from "../../Redux/store";
import {Attachment,Message} from "../types/workspaceTypes"
import { chatHistory, chatOnline } from "../apis/workspaceapis";


export default function GroupChannel() {
  const userData = useUser()
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const user = useSelector((state: RootState) => state.user.user?.name);
  const userId = useSelector((state: RootState) => state.user.user?._id);
const workspaceid=useWorkspaceid() as string
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  interface IncomingMessage {
  sender: string;
  content?: string;
  attachments?: string[];
}

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
 async function fetchData(){
       await chatOnline(workspaceid).then((res) => {
      const users = res.data
        .map((u) => u.name)
        .filter((name: string) => name && name !== user);
      setOnlineUsers(users);
    });
 await chatHistory(workspaceid).then((resp) => {
      const formatted: Message[] = resp.data.map((msg) => ({
        id: msg._id || Date.now().toString(),
        sender: msg.senderName === user ? "You" : msg.senderName,
        content: msg.content || "",
        timestamp: new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: msg.senderName === user,
        attachments: msg.attachments || [],
        reactions: msg.reactions || [],
      }));
      setMessages(formatted);
    });
    }
    // Fetch online users
  

    // Fetch chat history
   
    fetchData()
    socket.emit("join-workspace", {
  workspaceId: workspaceid,
  userId: userId
});
    socket.emit("UserId", userId);

    const handleReceiveMessage = (msg: IncomingMessage) => {
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: msg.sender === user ? "You" : msg.sender,
        content: msg.content || "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: msg.sender === user,
        attachments: msg.attachments || [],
        reactions: [],
      };
      setMessages((prev) => [...prev, newMsg]);
      setTypingUsers((prev) => prev.filter((u) => u !== msg.sender));
    };

    const handleTyping = (data: { user: string }) => {
      if (data.user !== user) {
        setTypingUsers((prev) => (prev.includes(data.user) ? prev : [...prev, data.user]));
      }
    };

    const handleStopTyping = (data: { user: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== data.user));
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [user, userId,workspaceid]);

  const getFileType = (file: File): Attachment["type"] => {
    const type = file.type;
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("video/")) return "video";
    if (type === "application/pdf") return "pdf";
    if (type.includes("word")) return "doc";
    if (type.startsWith("audio/")) return "audio";
    return "other";
  };

const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files.length === 0) return;

  const files = Array.from(e.target.files);
const isAllow=channelAttachement(files)
if(!isAllow) {toast.error("file not supported")
  return false
}

  try {
    // Upload all files in PARALLEL
    const uploadPromises = files.map(async (file) => {
      let url=""
      if(file.type == "video/mp4"){
        url= await uploadVideo(file)
      }else{
       url = await uploadAttachment(file);
      }
      try {
        
        
        return {
          name: file.name,
          url,
          blob: file, // optional: keep if you need preview before upload completes
          type: getFileType(file)
        } as Attachment;
      } catch  {
        // Return null or a placeholder for failed uploads
        return {
          name: file.name,
          url: '',
          blob: file,
          type: getFileType(file),
          error: true, // optional flag to show error in UI
        } as Attachment;
      }
    });

    const newAttachments = await Promise.all(uploadPromises);

    // Filter out completely failed ones if desired, or keep with error flag
    const successfulAttachments = newAttachments.filter(
      (att) => att.url !== ''
    );

    setAttachments((prev) => [...prev, ...successfulAttachments]);

    // Optional: notify user about failed uploads
    const failedCount = newAttachments.length - successfulAttachments.length;
    if (failedCount > 0) {
      toast.error(`${failedCount} file(s) failed to upload.`);
    }
  } catch {
    toast.error('Something went wrong while uploading files.');
  }
};
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async() => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = await audioUpload(audioBlob)
        setAttachments((prev) => [
          ...prev,
          {
            name: `Voice message ${new Date().toLocaleTimeString()}.webm`,
            url: audioUrl,
            blob: audioBlob,
            type: "audio",
          },
        ]);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch  {
      alert("Microphone access denied or not available.");
     
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { user });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { user });
    }, 1500);
  };

  const sendMessage = () => {
    if (!input.trim() && attachments.length === 0) return;

    const messageData = {
      sender: user,
      content: input.trim(),
      attachments: attachments.map((att) => ({
        name: att.name,
        url: att.url,
        type: att.type,
      })),
      userId:userData._id,
      workspaceId:workspaceid
    
    };

    socket.emit("send-message", messageData,workspaceid??userId);

    setInput("");
    setAttachments([]);
    setShowEmojiPicker(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit("stop-typing", { user });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else {
      handleTyping();
    }
  };

  const onEmojiClick = (emojiObject: unknown) => {
    setInput((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const addReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId
          ? {
              ...msg,
              reactions: msg.reactions
                ? msg.reactions.some((r) => r.emoji === emoji)
                  ? msg.reactions.map((r) =>
                      r.emoji === emoji
                        ? { ...r, count: r.count + 1, users: [...r.users, user] }
                        : r
                    )
                  : [...msg.reactions, { emoji, count: 1, users: [user] }]
                : [{ emoji, count: 1, users: [user] }],
            }
          : msg
      )
    );
    // In production: emit to server
  };

  const getAvatarColor = (sender: string) => {
    const colors: { [key: string]: string } = {
      You: "bg-indigo-500",
      "Alice Johnson": "bg-purple-500",
      Manu: "bg-blue-500",
      "Sarah Davis": "bg-green-500",
      "John Doe": "bg-orange-500",
      "Emma Wilson": "bg-pink-500",
    };
    return colors[sender] || "bg-gray-500";
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "audio":
        return <Mic className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const groupedMessages = messages.reduce((groups: Message[][], msg) => {
    if (groups.length === 0 || groups[groups.length - 1][0].sender !== msg.sender) {
      groups.push([msg]);
    } else {
      groups[groups.length - 1].push(msg);
    }
    return groups;
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 mt-[3em]">
      {/* Sidebar - Members List */}
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-80"
        } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}
      >
        {/* Channel Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900"># general</h2>
                  <p className="text-sm text-gray-500">{onlineUsers.length} online</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mx-auto">
                <Hash className="w-6 h-6 text-white" />
              </div>
            )}
            {!sidebarCollapsed && (
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Collapse Button */}
        <div className="px-4 py-2 border-b border-gray-200">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarCollapsed ? (
              <Menu className="w-5 h-5 text-gray-500" />
            ) : (
              <div className="flex items-center space-x-2">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">Collapse</span>
              </div>
            )}
          </button>
        </div>

        {/* Members List */}
        <div className="flex-1 p-4 overflow-y-auto">
          {!sidebarCollapsed ? (
            <>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Members — {onlineUsers.length}
              </h3>
              <div className="space-y-3">
                {onlineUsers.map((userName, i) => (
                  <div key={i} className="flex items-center space-x-3 group">
                    <div className="relative">
                      <div
                        className={`w-9 h-9 ${getAvatarColor(userName)} rounded-full flex items-center justify-center`}
                      >
                        <span className="text-sm font-medium text-white">
                          {getInitials(userName)}
                        </span>
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">{userName}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {onlineUsers.map((userName, i) => (
                <div key={i} className="flex justify-center">
                  <div className="relative">
                    <div
                      className={`w-9 h-9 ${getAvatarColor(userName)} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-sm font-medium text-white">
                        {getInitials(userName)}
                      </span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-2 hover:bg-gray-100 rounded-full lg:hidden"
                >
                  <Menu className="w-5 h-5 text-gray-500" />
                </button>
              )}
              <div className="flex items-center space-x-3">
                <Hash className="w-6 h-6 text-gray-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">general</h1>
                  <p className="text-sm text-gray-500">
                    {onlineUsers.length} members online • Group chat
                  </p>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {groupedMessages.map((group, groupIndex) => {
              const firstMsg = group[0];
              const isOwn = firstMsg.isOwn;

              return (
                <div
                  key={groupIndex}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex max-w-lg ${isOwn ? "flex-row-reverse" : "flex-row"} gap-3`}>
                    {!isOwn && (
                      <div
                        className={`w-10 h-10 ${getAvatarColor(
                          firstMsg.sender
                        )} rounded-full flex items-center justify-center flex-shrink-0 mt-6`}
                      >
                        <span className="text-sm font-medium text-white">
                          {getInitials(firstMsg.sender)}
                        </span>
                      </div>
                    )}

                    <div className={`${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                      {!isOwn && (
                        <span className="text-sm font-medium text-gray-700 mb-1 px-2">
                          {firstMsg.sender}
                        </span>
                      )}

                      <div className="space-y-1">
                        {group.map((msg) => (
                          <div key={msg.id} className="flex flex-col">
                            {msg.content && (
                              <div
                                className={`px-4 py-2 rounded-2xl inline-block max-w-md ${
                                  isOwn
                                    ? "bg-indigo-600 text-white rounded-br-none"
                                    : "bg-white text-gray-900 border border-gray-200 rounded-tl-none"
                                }`}
                              >
                                <p className="text-sm break-words whitespace-pre-wrap">
                                  {msg.content}
                                </p>
                              </div>
                            )}

                            {/* Attachments Display */}
                            {msg.attachments?.map((att, i) => (
                              <div key={i} className="mt-2 max-w-sm">
                                {att.type === "image" && (
                                  <img
                                    src={att.url}
                                    alt={att.name}
                                    className="rounded-lg max-w-full"
                                  />
                                )}
                                {att.type === "video" && (
                                  <video controls className="rounded-lg max-w-full">
                                    <source src={att.url} />
                                    Your browser does not support video.
                                  </video>
                                )}
                                {att.type === "audio" && (
                                  <audio controls  className="w-full h-12 mt-2">
                                    <source src={att.url} />
                                  </audio>
                                )}
                                {["pdf", "doc", "other"].includes(att.type) && (
                                  <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                  >
                                    {getFileIcon(att.type)}
                                    <div>
                                      <p className="text-sm font-medium truncate max-w-xs">
                                        {att.name}
                                      </p>
                                      <p className="text-xs text-gray-500 uppercase">{att.type}</p>
                                    </div>
                                  </a>
                                )}
                              </div>
                            ))}

                            {/* Reactions */}
                            {msg.reactions && msg.reactions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {msg.reactions.map((r, i) => (
                                  <button
                                    key={i}
                                    onClick={() => addReaction(msg.id, r.emoji)}
                                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition"
                                  >
                                    <span>{r.emoji}</span>
                                    <span className="text-xs">{r.count}</span>
                                  </button>
                                ))}
                                <button
                                  onClick={() => setShowEmojiPicker(true)}
                                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                                >
                                  <Smile className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <span
                        className={`text-xs text-gray-500 mt-1 px-2 ${
                          isOwn ? "text-right" : ""
                        }`}
                      >
                        {firstMsg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500 italic py-2">
                <div className="flex">
                  <span className="animate-bounce inline-block w-1 h-1 bg-gray-500 rounded-full"></span>
                  <span className="animate-bounce inline-block w-1 h-1 bg-gray-500 rounded-full delay-100"></span>
                  <span className="animate-bounce inline-block w-1 h-1 bg-gray-500 rounded-full delay-200"></span>
                </div>
                {typingUsers.length === 1
                  ? `${typingUsers[0]} is typing`
                  : `${typingUsers.slice(0, 3).join(", ")} are typing`}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Attachment Previews */}
            {attachments.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-3">
                {attachments.map((att, index) => (
                  <div
                    key={index}
                    className="relative group bg-gray-100 rounded-lg p-3 flex items-center gap-3 max-w-xs"
                  >
                    {getFileIcon(att.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{att.name}</p>
                      <p className="text-xs text-gray-500">
                        {(att.blob.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {/* Mini preview for image/video */}
                    {att.type === "image" && (
                      <img src={att.url} alt="" className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-20" />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end space-x-3">
              {/* File Attachment */}
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*,video/*,application/pdf,.doc,.docx,audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>

              {/* Voice Recording */}
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording} // Stop if mouse leaves
                className={`p-2 rounded-full transition ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : "hover:bg-gray-100"
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <div className="flex-1 relative" ref={emojiPickerRef}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message #general"
                  rows={1}
                  className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition max-h-32"
                  style={{ minHeight: "48px" }}
                />

                {/* Emoji Button */}
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 bottom-3 p-2 hover:bg-gray-200 rounded-full transition"
                >
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 right-0 z-50 shadow-2xl">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim() && attachments.length === 0}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}