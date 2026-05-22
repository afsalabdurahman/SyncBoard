import { Paperclip, Image, FileText, File, Trash2 } from "lucide-react";
import { FileItem } from "../Admin/types/AttachmentTypes";

export const FileIcon = ({ type }: { type: FileItem["type"] }) => {
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