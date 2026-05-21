
import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  
  Paperclip,
  Image as ImageIcon,
  FileText,
  File,
  X as XIcon,
} from "lucide-react";
import { uploadAttachment } from "../../Services/Cloudinary";
import { getFileTypeFromUrl } from "../../Utility/extesionFinder";
import { fetchComments, sendComment } from "../../Member/apis/authApi";
import { toast } from "react-toastify";
import { formatTime } from "../../Utility/dateformate";
import { useUser } from "../../Worksapce/hooks/workspacehooks";
import { channelAttachement } from "../../Utility/attachmentValidation";
import { socket } from "../../Services/socket";

interface Attachment {
  id: string;
  file: File;
  type: "image" | "pdf" | "doc" | "other";
  preview?: string;
}

interface Comment {
  id: number;
  name: string;
  text: string;
  timestamp: Date;
  attachments: Attachment[];
  urls:string[]
}

interface CommentBoxProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}
// const data=[{
//   name:"you",
//   text:"NotWorking",
//   timestamp:new Date(),
//   urls:["https://res.cloudinary.com/ddoxcgkv2/image/upload/v1766558345/azyixv1xegdofgzqns98.webp"],
//   attachments: []
// },
// {
//    name:"you",
//   text:"PDF UPDATED",
//   timestamp:new Date(),
//   urls:["https://res.cloudinary.com/ddoxcgkv2/image/upload/v1766562993/mfk246dabqiosilihuwv.pdf"],
//   attachments: [] 
// }
// ]


const CommentBox = ({ isOpen, onClose, taskId }: CommentBoxProps) => {
 useEffect(() => {
  fetchComments(taskId).then((data) => {
    setComments(data);
  });
}, [taskId]);

 

   const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (comments.length > 0) scrollToBottom();
  }, [comments]);
const user = useUser()

  const getFileType = (file: File): Attachment["type"] => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type === "application/pdf") return "pdf";
    if (file.type.includes("word") || file.type.includes("document") || 
        file.name.endsWith(".doc") || file.name.endsWith(".docx")) return "doc";
    return "other";
  };

const handleFileSelect = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const files = e.target.files;
  if (!files) return;

  const isAllow = channelAttachement(Array.from(files));

  if (!isAllow) {
    toast.error("File not supported");
    return;
  }

  const newAttachments: Attachment[] = Array.from(files).map(
    (file) => {
      const type = getFileType(file);

      return {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 11)}`,
        file,
        type,
        preview:
          type === "image" || type === "pdf"
            ? URL.createObjectURL(file)
            : undefined,
      };
    }
  );

  setAttachments((prev) => [...prev, ...newAttachments]);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};;

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };
useEffect(() => {
  socket.emit("join-comment", taskId);

  socket.on("receive-comment", (newComment) => {
    setComments((prev) => [...prev, newComment]);
  });

  return () => {
    socket.off("receive-comment");
  };
}, [taskId]);
const handleCommentSubmit = async () => {
  if (!commentText.trim() && attachments.length === 0) return;

  const titleName = `${user?.name}-${user?.role}`;
  const tempId = Date.now();

  const newComment: Comment = {
    id: tempId,
    name: titleName,
    text: commentText.trim(),
    timestamp: new Date(),
    attachments: [...attachments],
    urls: [],
  };

  // optimistic UI update
  setComments((prev) => [...prev, newComment]);

  setCommentText("");
  setAttachments([]);

  try {
    const uploadPromises = attachments.map((file) =>
      uploadAttachment(file.file)
    );

    const uploadedUrls = await Promise.all(uploadPromises);

    const isUpdated = await sendComment(
      taskId,
      newComment.name,
      newComment.text,
      uploadedUrls
    );

    if (!isUpdated) {
      toast.error("Comment not added");
      return;
    }

    // update preview after upload
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === tempId
          ? {
              ...comment,
              urls: uploadedUrls,
              attachments: comment.attachments.map(
                (file, index) => ({
                  ...file,
                  preview: uploadedUrls[index],
                })
              ),
            }
          : comment
      )
    );

    socket.emit("add-comment", {
      taskId,
      commentName: newComment.name,
      commentText: newComment.text,
      uploadedUrls,
    });
  } catch  {
    

    toast.error("Upload failed");

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === tempId
          ? { ...comment, urls: [] }
          : comment
      )
    );
  }
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };



  const getFileIcon = (type: Attachment["type"]) => {
    switch (type) {
      case "image": return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case "pdf":   return <FileText className="w-4 h-4 text-red-500" />;
      case "doc":   return <FileText className="w-4 h-4 text-blue-600" />;
      default:      return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-[420px] sm:w-[420px] animate-in fade-in slide-in-from-bottom-8 duration-300">
      <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Comments</h3>
              <p className="text-white/70 text-xs mt-0.5">
                {comments.length} {comments.length === 1 ? "comment" : "comments"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white rounded-full p-1.5 hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="max-h-[380px] overflow-y-auto p-4 space-y-4 bg-background/60">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 opacity-30 mb-3" />
              <p className="text-sm">No comments yet</p>
              <p className="text-xs mt-1 opacity-70">Start the conversation</p>
            </div>
          ) : (
            comments.map((comment,index) => (
              <div key={index} className="animate-in fade-in duration-200">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full  flex items-center justify-center">
                    <img src={user?.imageUrl} className="w-4 h-4 text-primary w-8 h-8 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.name}</span>
                      <span className="text-[10px] text-muted-foreground">
{formatTime(comment.timestamp)
}
                      </span>
                    </div>
                    {comment.text && (
                      <p className="text-sm leading-relaxed text-foreground/90 mb-2">
                        {comment.text}
                      </p>
                    )}

{comment.urls.length > 0 && (
  <div className="space-y-2 mt-2">
    {comment.urls.map((url, index) => {
      const fileType = getFileTypeFromUrl(url);

      return (
        <div key={index}>
          {/* Image Preview */}
          {fileType === "image" && (
            <img
              src={url}
              alt="attachment"
              className="max-w-full rounded-lg border object-contain"
            />
          )}

          {/* PDF Preview */}
          {fileType === "pdf" && (
            <iframe
              src={url}
              title="PDF Preview"
              className="w-full h-64 rounded-lg border"
            />
          )}

          {/* Other files */}
          {(fileType === "doc" ||
            fileType === "other") && (
            <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
              {getFileIcon(fileType)}

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Open File
              </a>
            </div>
          )}
        </div>
      );
    })}
  </div>
)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-card">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border/50 bg-muted/40"
                >
                 {att.type === "image" && att.preview ? (
  <img
    src={att.preview}
    alt="preview"
    className="w-full h-full object-cover"
  />
) : att.type === "pdf" && att.preview ? (
  <iframe
    src={att.preview}
    title="PDF Preview"
    className="w-full h-full"
  />
) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(att.type)}
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <XIcon className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>

            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-3 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />

            <button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim() && attachments.length === 0}
              className="p-3 rounded-xl bg-primary text-white disabled:opacity-50 disabled:pointer-events-none hover:bg-primary/90 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentBox;