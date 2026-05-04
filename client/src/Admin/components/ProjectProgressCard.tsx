import React from "react";


interface Props {
  totalTask: number;
  completedTask: number;
  projectProgress: number;
}
export const ProjectProgressCard = ({
  totalTask,
  completedTask,
  projectProgress,
}: Props) => {
 
  const radius = 52;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (projectProgress / 100) * circumference;

  return (
   <>
    <div className=" rounded-2xl border border-slate-700/50 border-gray-200 bg-[#f5f5f5] p-5 shadow-sm">
      <h3 className="mb-7 text-[15px] font-semibold text-[#111827">
        Project Progress
      </h3>

      <div className="relative mx-auto h-[140px] w-[140px]">
        <svg className="h-full w-full -rotate-90">
          {/* Background Ring */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="#ececec"
            strokeWidth={stroke}
            fill="none"
          />

          {/* Progress Ring */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="#3b82f6"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-[25px] font-bold leading-none text-gray-900">
            {Math.ceil(projectProgress??0)}%
          </h2>
          <p className="mt-1 text-sm text-gray-500">complete</p>
        </div>
      </div>

      <p className="mt-5 text-center text-[18px] text-gray-900">
        <span className="font-semibold">{completedTask}</span> of{" "}
        <span className="font-semibold">{totalTask}</span> tasks done
      </p>
    </div>
   </>
  );
};

