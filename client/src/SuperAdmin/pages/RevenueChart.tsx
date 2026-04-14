import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

// ─── colors ─────────────────────────────────────────────

const PLAN_COLORS = {
  pro: "#1D9E75",
  enterprise: "#7F77DD",
  basic:"#8f215d",
};

// ─── sample data ────────────────────────────────────────

const DEFAULT_DATA = [
  { plan: "pro", amount: 20 },
  { plan: "enterprise", amount: 50 },
  { plan: "enterprise", amount: 50 },
  { plan: "pro", amount: 20 },
];

// ─── helper ─────────────────────────────────────────────
import { useEffect, useState } from "react";
import { fetchRevenue } from "../apis/fetchApi";
function capitalize(str) {
 
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── tooltip ────────────────────────────────────────────

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const { planName, totalRevenue } = payload[0].payload;

  return (
    <div className="bg-white border rounded px-2 py-1 text-xs shadow">
      <p>{capitalize(planName)}</p>
      <p>${totalRevenue} / month</p>
    </div>
  );
}

// ─── center label (FIXED) ───────────────────────────────

function DonutCenterLabel({ viewBox, total }) {
  if (!viewBox) return null;

  const { cx, cy } = viewBox;

  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} dy="-0.4em" fontSize={20} fontWeight={600}>
        ${total}
      </tspan>
      <tspan x={cx} dy="1.6em" fontSize={10}>
        per month
      </tspan>
    </text>
  );
}

// ─── main component ─────────────────────────────────────

export const RevenueChart = () => {
  // group data
const [data,setData]=useState([])
const [error,setError]=useState(false)
useEffect(()=>{
  async function fetchChart(){
await fetchRevenue().then((response)=>{
setData(response)
}).catch(()=>setError(true))

  }
;
fetchChart()
},[])

  // const grouped = Object.entries(
  //   data.reduce((acc, { plan, amount }) => {
  //     acc[plan] = (acc[plan] || 0) + amount;
  //     return acc;
  //   }, {})
  // ).map(([name, value]) => ({ name, value }));

  const total = data.reduce((s, g) => s + g.totalRevenue, 0);
if(error){
  return(<></>)
}
  return (
    <div className="p-4 border rounded  ">
      <h3 className="text-sm font-semibold mb-2">
        Revenue Distribution
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            dataKey="totalRevenue"
          >
            {/* ✅ FIXED LABEL */}
            <Label
              position="center"
              content={<DonutCenterLabel total={total} />}
            />

            {data.map((g) => (
              <Cell key={g.planName} fill={PLAN_COLORS[g.planName]} />
            ))}
          </Pie>

          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}