export interface FileItem {
  id: string;
  name: string;
  type: "image" | "pdf" | "doc" | "other";
  url: string;
  thumbnail?: string;
}
export interface AttachmentButtonProps {
  attachedUrl: string[];
  taskId: string;
  passURL: (url: string) => void;
}
export interface FileCardProps {
  file: string;
  onClick: () => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}