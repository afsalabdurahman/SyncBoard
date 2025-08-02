"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "../../components/ui/button"
import { toast, ToastContainer } from "react-toastify";
import { Card, CardContent } from "../../components/ui/card"
import {Dialog,DialogClose,DialogContent,DialogFooter,DialogHeader} from"../../components/ui/dialog"
import { X, Upload as UploadIcon, File, FileText, ImageIcon } from "lucide-react"

interface UploadedFile {
  file: File
  id: string
  preview?: string
}

export  function Upload({isOpen,onClose,onSubmit}:any) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedTypes = {
    "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    files.forEach((file) => {
      const id = Math.random().toString(36).substr(2, 9)
      const uploadedFile: UploadedFile = {
        file,
        id,
      }

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedFiles((prev) => prev.map((f) => (f.id === id ? { ...f, preview: e.target?.result as string } : f)))
        }
        reader.readAsDataURL(file)
      }

      setUploadedFiles((prev) => [...prev, uploadedFile])
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    } else if (fileType === "application/pdf") {
      return <FileText className="h-8 w-8 text-red-500" />
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <File className="h-8 w-8 text-blue-600" />
    }
    return <File className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
const handleSubmit = () =>{
    console.log("111working subl=mit burtton")
    if(uploadedFiles.length>5){
         toast.error("Limit exceed");
        return false
    }
    onSubmit(uploadedFiles)
    onClose()
}
let openChange = () =>{
onSubmit(uploadedFiles)
onClose()
}
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
         
  <DialogContent>
     <ToastContainer position='top-center' autoClose={5000} />
<div className="w-full max-w-2xl mx-auto p-6 space-y-6 sc overflow-y-auto max-h-[70vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">File Upload</h2>
        <p className="text-gray-600 mb-4">Upload images, PDF, and DOC files</p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <UploadIcon className="mr-2 h-5 w-5" />
          Choose Files
        </Button>

        <p className="text-sm text-gray-500 mt-2">Supported formats: Images (JPG, PNG, GIF, etc.), PDF, DOC, DOCX</p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Files ({uploadedFiles.length})</h3>

          <div className="grid gap-4">
            {uploadedFiles.map((uploadedFile) => (
              <Card key={uploadedFile.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* File preview or icon */}
                    <div className="flex-shrink-0">
                      {uploadedFile.preview ? (
                        <img
                          src={uploadedFile.preview || "/placeholder.svg"}
                          alt={uploadedFile.file.name}
                          className="h-16 w-16 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-lg border">
                          {getFileIcon(uploadedFile.file.type)}
                        </div>
                      )}
                    </div>

                    {/* File details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.file.size)}</p>
                      <p className="text-xs text-gray-400 capitalize">
                        {uploadedFile.file.type.split("/")[1] || "Unknown"}
                      </p>
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(uploadedFile.id)}
                      className="flex-shrink-0 h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-gray-600">
              Total: {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}
            </span>
            <Button
              variant="outline"
              onClick={() => setUploadedFiles([])}
              className="text-red-600 hover:bg-red-50 hover:border-red-200"
            >
              Clear All
            </Button>
            <Button onClick={handleSubmit}>
                submit
            </Button>
          </div>
        </div>
      )}
    </div>
    </DialogContent>
        </Dialog>
  )
}
