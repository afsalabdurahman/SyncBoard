

import { X } from "lucide-react";

interface CloseIconProps {
  onClose: () => void;
}

export function CloseIcon({ onClose }: CloseIconProps) {
  return (
    <button
      onClick={onClose}
      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
    >
      <X className="w-4 h-4" />
    </button>
  );
}