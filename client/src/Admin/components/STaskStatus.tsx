
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";



export const TaskDistribution = (distribution) => {
 const [pieData, setPieData] = useState([
  { name: "To Do", value: 0, color: "#3b82f6" },
  { name: "In Progress", value: 0, color: "#f59e0b" },
  { name: "Completed", value: 0, color: "#10b981" },
]);

useEffect(() => {
  if (distribution) {
    setPieData([
      {
        name: "To Do",
        value: distribution?.taskDistribution?.todo || 0,
        color: "#3b82f6",
      },
      {
        name: "In Progress",
        value: distribution?.taskDistribution?.inprogress || 0,
        color: "#f59e0b",
      },
      {
        name: "Completed",
        value: distribution?.taskDistribution?.completed || 0,
        color: "#10b981",
      },
    ]);
  }
}, [distribution]);

  return (
   <>
    <div className="border border-slate-700/50 rounded-2xl p-5 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-200">
          Task Distribution
        </span>

        <span className="text-xs text-slate-400">
          {distribution?.taskDistribution?.completed+distribution?.taskDistribution?.inprogress+distribution?.taskDistribution?.todo} Tasks
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={130}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "#f3f4f6",
              border: "1px solid #334155",
              borderRadius: 8,
              fontSize: 11,
              color: "#fff",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-col gap-2 mt-2">
        {pieData.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: item.color }}
            />

            <span className="text-xs text-slate-400 flex-1">
              {item.name}
            </span>

            <span className="text-xs font-medium text-slate-300">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
   </>
  );
};

