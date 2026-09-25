/**
 * Analytics Charts Widget
 * 
 * Architectural Intent:
 * A reusable visualization module utilizing `recharts` to render interactive data representations.
 * 
 * Components:
 * - `TransactionVolumeChart`: Renders a smooth AreaChart representing transaction flow over time.
 * - `RevenueChart`: Renders a BarChart illustrating platform fee accumulation.
 * 
 * Both components internally memoize data transformations (`useMemo`) to format dates efficiently 
 * without re-calculating on every render cycle.
 */
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { format } from "date-fns";

export function TransactionVolumeChart({ data }) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      formattedDate: format(new Date(item.date), "MMM dd"),
    }));
  }, [data]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl w-full h-[400px]">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Transaction Volume
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="formattedDate" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" tickFormatter={(value) => `৳${value}`} />
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(17, 24, 39, 0.8)", borderRadius: "8px", border: "none", color: "#fff" }}
            itemStyle={{ color: "#fff" }}
            formatter={(value) => [`৳${value}`, "Volume"]}
          />
          <Area type="monotone" dataKey="totalVolume" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVolume)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueChart({ data }) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      formattedDate: format(new Date(item.date), "MMM dd"),
    }));
  }, [data]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl w-full h-[400px]">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Platform Revenue
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="formattedDate" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" tickFormatter={(value) => `৳${value}`} />
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(17, 24, 39, 0.8)", borderRadius: "8px", border: "none", color: "#fff" }}
            cursor={{ fill: "rgba(255,255,255,0.1)" }}
            formatter={(value) => [`৳${value}`, "Revenue"]}
          />
          <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
