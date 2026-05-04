import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";



const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-[#2f3f62] bg-[#1b2740] px-4 py-3 shadow-xl">
      <p className="text-[13px] text-[#c7d2fe]">{label}</p>
      <p className="mt-1 text-[13px] text-[#6d7cff] font-medium">
        remaining : {payload[0].value}
      </p>
    </div>
  );
};

export const BurndownChart = ({burndown}) => {
  return (
    <div >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[22px] font-semibold text-white">
          Burndown Chart
        </h2>

        <span className="text-[18px] text-[#c7d2fe]">May 2025</span>
      </div>

      {/* Chart */}
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={burndown}
            margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#374151"
              vertical={true}
            />

            <XAxis
              dataKey="day"
              tick={{ fill: "#6077a6", fontSize: 11 }}
              axisLine={{ stroke: "#5d6470" }}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#6077a6", fontSize: 11 }}
              axisLine={{ stroke: "#5d6470" }}
              tickLine={false}
              domain={[0, 40]}
              ticks={[0, 10, 20, 30, 40]}
            />

            <Tooltip
              cursor={{ stroke: "#ffffff30", strokeWidth: 1 }}
              content={<CustomTooltip />}
            />

            <Line
              type="linear"
              dataKey="value"
              stroke="#4d63ff"
              strokeWidth={2}
              dot={{ r: 4, fill: "#4d63ff", stroke: "#4d63ff" }}
              activeDot={{
                r: 4,
                fill: "#8f96a1",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

