import React, { useRef, useState } from "react";
import { Button } from "../../Custom/ui/button";
import { Card, CardContent } from "../../Custom/ui/card";
import {
  Dialog,
  DialogContent
} from "../../Custom/ui/dialog";

import { toast } from "react-toastify";
import { X, Upload as UploadIcon, File, FileText, ImageIcon } from "lucide-react";

/* ---------------- TYPES ---------------- */

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

interface UploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (files: UploadedFile[]) => void;
}

/* ---------------- COMPONENT ---------------- */

export function Upload({ isOpen, onClose, onSubmit }: UploadProps) {

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = [
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp",
    ".pdf", ".doc", ".docx"
  ];

  /* ---------------- FILE SELECT ---------------- */

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {

    const files = Array.from(event.target.files ?? []);

    files.forEach((file) => {

      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

      if (!acceptedTypes.includes(ext)) {
        toast.error(`${ext} file type not supported`);
        return;
      }

      const id = Math.random().toString(36).slice(2, 9);

      const uploadedFile: UploadedFile = {
        file,
        id,
      };

      if (file.type.startsWith("image/")) {

        const reader = new FileReader();

        reader.onload = (e) => {
          setUploadedFiles((prev) => [
            ...prev,
            { ...uploadedFile, preview: e.target?.result as string }
          ]);
        };

        reader.readAsDataURL(file);

      } else {
        setUploadedFiles((prev) => [...prev, uploadedFile]);
      }

    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------------- REMOVE FILE ---------------- */

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  /* ---------------- FILE ICON ---------------- */

  const getFileIcon = (fileType: string) => {

    if (fileType.startsWith("image/"))
      return <ImageIcon className="h-8 w-8 text-blue-500" />;

    if (fileType === "application/pdf")
      return <FileText className="h-8 w-8 text-red-500" />;

    if (fileType.includes("word") || fileType.includes("document"))
      return <File className="h-8 w-8 text-blue-600" />;

    return <File className="h-8 w-8 text-gray-500" />;
  };

  /* ---------------- FORMAT SIZE ---------------- */

  const formatFileSize = (bytes: number) => {

    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = () => {

    if (uploadedFiles.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }

    onSubmit(uploadedFiles);
    onClose();
  };

  /* ---------------- UI ---------------- */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>

        <div className="w-full max-w-2xl mx-auto p-6 space-y-6 overflow-y-auto max-h-[70vh]">

          {/* HEADER */}

          <div className="text-center">

            <h2 className="text-2xl font-bold mb-2">File Upload</h2>

            <p className="text-gray-600 mb-4">
              Upload images, PDF, DOC files
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <UploadIcon className="mr-2 h-5 w-5" />
              Choose Files
            </Button>

            <p className="text-sm text-gray-500 mt-2">
              Supported formats: Images, PDF, DOC, DOCX
            </p>

          </div>

          {/* FILE LIST */}

          {uploadedFiles.length > 0 && (

            <div className="space-y-4">

              <h3 className="text-lg font-semibold">
                Uploaded Files ({uploadedFiles.length})
              </h3>

              <div className="grid gap-4">

                {uploadedFiles.map((uploadedFile) => (

                  <Card key={uploadedFile.id}>

                    <CardContent className="p-4">

                      <div className="flex items-start space-x-4">

                        <div>

                          {uploadedFile.preview ? (
                            <img
                              src={uploadedFile.preview}
                              alt={uploadedFile.file.name}
                              className="h-16 w-16 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-lg border">
                              {getFileIcon(uploadedFile.file.type)}
                            </div>
                          )}

                        </div>

                        <div className="flex-1 min-w-0">

                          <p className="text-sm font-medium truncate">
                            {uploadedFile.file.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {formatFileSize(uploadedFile.file.size)}
                          </p>

                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(uploadedFile.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>

                      </div>

                    </CardContent>

                  </Card>

                ))}

              </div>

              {/* FOOTER */}

              <div className="flex justify-between items-center pt-4 border-t">

                <span className="text-sm text-gray-600">
                  Total: {uploadedFiles.length} file
                  {uploadedFiles.length !== 1 && "s"}
                </span>

                <div className="flex gap-3">

                  <Button
                    variant="outline"
                    onClick={() => setUploadedFiles([])}
                  >
                    Clear
                  </Button>

                  <Button onClick={handleSubmit}>
                    Submit
                  </Button>

                </div>

              </div>

            </div>

          )}

        </div>

      </DialogContent>
    </Dialog>
  );
}