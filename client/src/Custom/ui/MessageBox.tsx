import { useState, useRef, useEffect } from "react";
import { Send, X, MessageSquare, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  type: "sent" | "received";
}

interface Comment {
  id: number;
  name: string;
  text: string;
  timestamp: Date;
}

interface MessageBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessageBox = ({ isOpen, onClose }: MessageBoxProps) => {
  const [activeTab, setActiveTab] = useState<"messages" | "comments">("messages");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      timestamp: new Date(),
      type: "received",
    },
  ]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (activeTab === "messages") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, comments, activeTab]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputValue.trim(),
      timestamp: new Date(),
      type: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    setTimeout(() => {
      const responseMessage: Message = {
        id: Date.now() + 1,
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date(),
        type: "received",
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  const handleCommentSubmit = () => {
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      name: commentName.trim(),
      text: commentText.trim(),
      timestamp: new Date(),
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] animate-slide-up">
      <div className="bg-card rounded-2xl message-box-shadow overflow-hidden border border-border/50">
        {/* Header */}
        <div className="bg-primary px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">💬</span>
            </div>
            <div>
              <h3 className="text-primary-foreground font-semibold text-base">Chat & Comments</h3>
              <p className="text-primary-foreground/70 text-xs">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
            aria-label="Close message box"
          >
            <X className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-secondary/30">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === "messages"
                ? "text-primary border-b-2 border-primary bg-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Send className="w-4 h-4" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === "comments"
                ? "text-primary border-b-2 border-primary bg-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Comments
          </button>
        </div>

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <>
            <div className="h-[280px] overflow-y-auto p-4 space-y-3 bg-background/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"} animate-message-in`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                      message.type === "sent"
                        ? "message-bubble-sent rounded-br-md"
                        : "message-bubble-received rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        message.type === "sent"
                          ? "text-primary-foreground/60"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-card border-t border-border/50">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-secondary rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="w-11 h-11 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5 text-primary-foreground" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <>
            <div className="h-[280px] overflow-y-auto p-4 space-y-3 bg-background/50">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground text-sm">No comments yet</p>
                  <p className="text-muted-foreground/70 text-xs">Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="animate-message-in">
                    <div className="bg-secondary/50 rounded-xl p-3 border border-border/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{comment.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {formatTime(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed pl-9">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

            <div className="p-4 bg-card border-t border-border/50 space-y-2">
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2.5 bg-secondary rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleCommentKeyDown}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-3 bg-secondary rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!commentName.trim() || !commentText.trim()}
                  className="w-11 h-11 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  aria-label="Post comment"
                >
                  <MessageSquare className="w-5 h-5 text-accent-foreground" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
