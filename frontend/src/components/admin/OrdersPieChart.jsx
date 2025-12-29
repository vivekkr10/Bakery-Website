import React, { useEffect, useRef, useState } from "react";
import { Cell, Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";

const OrdersPieChart = () => {
  const containerRef = useRef(null);
  const [isCompact, setIsCompact] = useState(false);

  const colors = ["#ffb07c", "#d69e64", "#ed598a"];

  const data = [
    { name: "Pending", value: 2 },
    { name: "Completed", value: 2 },
    { name: "Cancelled", value: 1 },
  ];

  // 🔥 REAL RESPONSIVENESS (container based)
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setIsCompact(width < 360); // 👈 real breakpoint
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-[#fff9f4] p-4 rounded-xl shadow w-full"
    >
      <h3 className="text-sm sm:text-lg font-semibold mb-2 text-[#6f482a] text-center sm:text-left">
        Daily Order Status
      </h3>

      {/* CHART */}
      <div className="w-full flex justify-center">
        <div
          className={`${
            isCompact ? "w-[260px] h-[220px]" : "w-full h-[240px]"
          }`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={isCompact ? "65%" : "75%"}
                innerRadius={isCompact ? "40%" : "45%"}
                paddingAngle={3}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LEGEND */}
      <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs">
        {data.map((item, i) => (
          <div className="flex items-center gap-1" key={i}>
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors[i] }}
            />
            <span className="text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPieChart;
