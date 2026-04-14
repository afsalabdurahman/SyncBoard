import { useState } from "react";
import { Paperclip, Image, FileText, File, Trash2 } from "lucide-react";
import { cn } from "../../Utility/cn";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../Custom/ui/dialog";
import { getFileTypeFromUrl } from "../../Utility/extesionFinder";
import { deleteAttachmentUrl, deleteProjectAttachment } from "../apis/taskApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { deleteAttachment } from "../../Redux/feature/task/taskSlice";
import { AppDispatch } from "../../Redux/store";
import { AttachmentButtonProps, FileCardProps, FileItem } from "../types/AttachmentTypes";





const FileIcon = ({ type }: { type: FileItem["type"] }) => {
  switch (type) {
    case "image":
      return <Image className="w-5 h-5 text-file-image" />;
    case "pdf":
      return <FileText className="w-5 h-5 text-file-pdf" />;
    case "doc":
      return <File className="w-5 h-5 text-file-doc" />;
    default:
      return <File className="w-5 h-5 text-muted-foreground" />;
  }
};



const FileCard = ({ file, onClick, onDelete }: FileCardProps) => {
  const fileType = getFileTypeFromUrl(file);

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center justify-center",
        "w-full aspect-square rounded-lg overflow-hidden",
        "bg-secondary/50 border border-border/50",
        "transition-all duration-200 ease-out",
        "hover:shadow-hover hover:border-primary/30 hover:scale-[1.02]"
      )}
    >
      <button
        onClick={onClick}
        className="flex flex-col items-center justify-center focus:outline-none w-full h-full"
      >
        {fileType === "image" ? (
          <img
            src={file}
            alt={file.slice(0, 5)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                fileType === "pdf" && "bg-file-pdf/10",
                fileType === "doc" && "bg-file-doc/10",
                fileType === "image" && "bg-file-image/10"
              )}
            >
              <FileIcon type={fileType} />
            </div>

            <span className="text-xs text-muted-foreground text-center truncate w-full px-2">
              {file.slice(0, 5)}
            </span>
          </div>
        )}
      </button>

      <button
        onClick={onDelete}
        className={cn(
          "absolute top-1 right-1 p-1.5 rounded-md",
          "bg-destructive/90 text-destructive-foreground",
          "opacity-0 group-hover:opacity-100",
          "transition-all duration-200",
          "hover:bg-destructive hover:scale-110",
          "focus:outline-none focus:opacity-100"
        )}
      >
        <Trash2 className="w-3 h-3" />
      </button>

      {fileType === "image" && (
        <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="text-primary-foreground text-sm font-medium">
            View
          </span>
        </div>
      )}
    </div>
  );
};

export const AttachmentButton = ({
  attachedUrl,
  taskId,
  passURL,
  isProject,
}: AttachmentButtonProps) => {

  
  const dispatch = useDispatch<AppDispatch>();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [files, setFiles] = useState<string[]>(attachedUrl);

  const handleFileClick = (url: string) => {
    setSelectedFile(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDeleteFile = async (
    e: React.MouseEvent<HTMLButtonElement>,
    url: string
  ) => {
    e.stopPropagation();
if(isProject){

 try {
  await deleteProjectAttachment(taskId,url)
  setFiles((prev) => prev.filter((f) => f !== url));
  toast.success("Deleted")
 } catch  {
  toast.error("Failed to delete")
 }
}else{


    dispatch(deleteAttachment({ taskId, url }));

    setFiles((prev) => prev.filter((f) => f !== url));

    if (selectedFile === url) {
      setSelectedFile("");
    }

    const msg = await deleteAttachmentUrl(taskId, url);
    toast.success(msg);

    passURL(url);
  }
};
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            className={cn(
              "relative flex items-center gap-2 px-3 py-1 rounded-xl",
              "bg-primary text-primary-foreground font-medium",
              "shadow-soft hover:shadow-hover",
              "transition-all duration-200 ease-out",
              "hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            <Paperclip className="w-5 h-5" />

            <span className="ml-1 px-2 py-0.5 text-xs bg-primary-foreground/20 rounded-full">
              {files.length}
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Files Gallery</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto max-h-70">
            {files.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {files.map((file, index) => (
                  <FileCard
                    key={index}
                    file={file}
                    onClick={() => handleFileClick(file)}
                    onDelete={(e) => handleDeleteFile(e, file)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <File className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">No files attached</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Click on a file to preview
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};