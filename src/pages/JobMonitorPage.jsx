import { useState } from "react";
import { RefreshCw } from "lucide-react";

export const JobMonitorPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="w-full h-screen relative">
      <div className="fixed bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium shadow-md">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
        <span>Embedded Page</span>
      </div>
      <button
        onClick={handleRefresh}
        className="fixed bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-[#00104A] text-white rounded-lg hover:bg-[#00104A]/90 transition-colors shadow-lg"
        title="Refresh"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Refresh</span>
      </button>
      <iframe
        key={refreshKey}
        src={import.meta.env.VITE_JOB_MONITORING_URL}
        className="w-full h-full border-0"
        title="Job Monitor"
      />
    </div>
  );
};
