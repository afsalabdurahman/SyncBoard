import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { fetchUserGrowth } from "../apis/fetchApi";
import { useEffect, useState } from "react";

// ─── sample data – replace with your API response ────────────────────────────

// const DEFAULT_DATA = [
//   { month: "Oct", totalUsers: 120, newUsers: 32, churned: 8  },
//   { month: "Nov", totalUsers: 145, newUsers: 41, churned: 16 },
//   { month: "Dec", totalUsers: 162, newUsers: 29, churned: 12 },
//   { month: "Jan", totalUsers: 198, newUsers: 54, churned: 18 },
//   { month: "Feb", totalUsers: 231, newUsers: 48, churned: 15 },
//   { month: "Mar", totalUsers: 274, newUsers: 62, churned: 19 },
//   { month: "Apr", totalUsers: 310, newUsers: 55, churned: 19 },
// ];

// ─── custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const items = [
    { key: "totalUsers", label: "Total users",  color: "#7F77DD" },
    { key: "newUsers",   label: "New sign-ups", color: "#1D9E75" },
    { key: "churned",    label: "Churned",      color: "#D85A30" },
  ];
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs shadow-md min-w-[140px]">
      <p className="font-semibold text-zinc-700 dark:text-zinc-200 mb-2">{label}</p>
      {items.map(({ key, label: lbl, color }) => {
        const entry = payload.find((p) => p.dataKey === key);
        if (!entry) return null;
        return (
          <div key={key} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
            <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
              {lbl}
            </span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-100">{entry.value}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function UserGrowthTrend() {
const [data,setData]=useState([])
const [setError]=useState(false)

useEffect(()=>{
  async function fetchChart(){
await fetchUserGrowth().then((response)=>{
setData(response)
}).catch(()=>setError(true))

  }
;
fetchChart()
},[setError])

const peak = data?.length
  ? data.reduce((a, b) =>
      (a?.totalUsers ?? 0) > (b?.totalUsers ?? 0) ? a : b
    )
  : null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 w-full">

      {/* header */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          User growth trend
        </p>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {data?.length
  ? `${data[0]?.month} – ${data[data.length - 1]?.month}`
  : "No data"}
        </span>
      </div>

      {/* legend */}
      <div className="flex gap-5 mb-4">
        {[
          { label: "Total users",  color: "#7F77DD", dash: false },
          { label: "New sign-ups", color: "#1D9E75", dash: false },
          { label: "Churned",      color: "#D85A30", dash: true  },
        ].map(({ label, color, dash }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
            <svg width="20" height="10" viewBox="0 0 20 10">
              {dash
                ? <line x1="0" y1="5" x2="20" y2="5" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
                : <line x1="0" y1="5" x2="20" y2="5" stroke={color} strokeWidth="2" />
              }
            </svg>
            {label}
          </div>
        ))}
      </div>

      {/* chart */}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#7F77DD" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#7F77DD" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}    />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.05)" />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#a1a1aa" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#a1a1aa" }}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#7F77DD", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.35 }}
          />

          <ReferenceLine
            x={peak?.month}
            stroke="#7F77DD"
            strokeDasharray="4 2"
            strokeOpacity={0.35}
            label={{ value: "Peak", position: "insideTopRight", fontSize: 10, fill: "#7F77DD" }}
          />

          <Area
            type="monotone"
            dataKey="totalUsers"
            stroke="#7F77DD"
            strokeWidth={2.5}
            fill="url(#gradTotal)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0, fill: "#7F77DD" }}
          />
          <Area
            type="monotone"
            dataKey="newUsers"
            stroke="#1D9E75"
            strokeWidth={2}
            fill="url(#gradNew)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0, fill: "#1D9E75" }}
          />
          <Area
            type="monotone"
            dataKey="churned"
            stroke="#D85A30"
            strokeWidth={2}
            strokeDasharray="5 3"
            fill="none"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0, fill: "#D85A30" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}