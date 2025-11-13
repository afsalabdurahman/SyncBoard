import React from 'react'
import { X } from 'lucide-react'
export function CloseIcon({onClose}) {
  return (
    <div>
       <button
        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
onClick={()=>onClose()}
>
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}


