import React from 'react'

export const  SubtaskPage =({isOpensub,setOpensub,completed,total,taskId}) =>{
      const allDone = completed === total;
  return (
    <div>
         <button
          onClick={() => setOpensub(taskId)}
          className={`
            relative flex items-center justify-center w-11 h-11 rounded-xl
            border transition-all duration-200 shadow-lg
            ${isOpensub === taskId
              ? "bg-indigo-600 border-indigo-500 shadow-indigo-900/50"
              : "bg-[#1c1f2e] border-[#2e3248] hover:border-indigo-500/60 hover:bg-[#22263a]"
            }
          `}
          aria-label="Toggle subtasks"
        >
          {/* Checklist SVG Icon */}
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${isOpensub ? "text-white" : "text-indigo-400"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>

          {/* Badge */}
          <span
            className={`
              absolute -top-2.5 -right-2.5 flex items-center justify-center
              min-w-[22px] h-[22px] px-1.5 rounded-full text-[10px] font-bold
              border-2 border-[#0f1117] leading-none tracking-wide
              transition-colors duration-200
              ${allDone
                ? "bg-emerald-500 text-white"
                : "bg-indigo-500 text-white"
              }
            `}
          >
            {completed}/{total}
          </span>
        </button>
    </div>
  )
}

export default SubtaskPage
