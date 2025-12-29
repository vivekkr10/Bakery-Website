import React, { useEffect, useState } from "react";
import StatsCards from "./StatsCards";
import SalesChart from "./SalesChart";
import OrdersPieChart from "./OrdersPieChart";
import RecentOrder from "./RecentOrder";
import Topbar from "./Topbar";

const Dashboard = () => {
  // 🔥 RESPONSIVE STATE
  const [isCompact, setIsCompact] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fff9f4] lg:ml-64 overflow-x-hidden">
      {/* TOP NAV */}
      <Topbar />

      {/* PAGE CONTENT */}
      <div className="px-3 sm:px-6 lg:px-8 pt-4 sm:pt-20 lg:pt-6 pb-6 w-full">
        {/* STATS */}
        <StatsCards />

        {/* CHARTS */}
        {isCompact ? (
          /* 📱 MOBILE / TABLET / NEST HUB */
          <div className="flex flex-col gap-4 mt-4">
            <div className="w-full">
              <SalesChart />
            </div>

            <div className="w-full flex justify-center">
              <div className="w-full max-w-[360px]">
                <OrdersPieChart />
              </div>
            </div>
          </div>
        ) : (
          /* 💻 DESKTOP (UNCHANGED GRID) */
          <div className="grid grid-cols-2 gap-6 mt-6">
            <SalesChart />
            <OrdersPieChart />
          </div>
        )}

        {/* RECENT ORDERS */}
        <div className="mt-4 sm:mt-6">
          {isCompact ? (
            /* 📱 scroll only on compact */
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <RecentOrder />
              </div>
            </div>
          ) : (
            /* 💻 normal */
            <RecentOrder />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
