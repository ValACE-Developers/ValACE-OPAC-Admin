import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { PieChartComponent } from "@/components/ui";
import { useGetPerLocationUsage } from "@/hooks/dashboard";

export const PerLocationDemographic = () => {
    // Get today's date in local timezone (YYYY-MM-DD)
    const getTodayLocal = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [fromDate, setFromDate] = useState(getTodayLocal());
    const [toDate, setToDate] = useState(getTodayLocal());

    const { data: apiResponse, isLoading, error } = useGetPerLocationUsage({
        from_date: fromDate,
        to_date: toDate
    }, {
        enabled: !!fromDate && !!toDate // Only fetch when both dates are selected
    });

    // Location color mapping
    const locationColors = {
        'outside': '#f59e0b',      // amber - Internet Access
        '1st_floor': '#1f2937',    // dark navy - First Floor
        '2nd_floor': '#3b82f6',    // blue - Second Floor
        '3rd_floor': '#10b981'     // green - Third Floor
    };

    // Location name mapping
    const locationNames = {
        'outside': 'Internet Access (IA)',
        '1st_floor': 'First Floor',
        '2nd_floor': 'Second Floor',
        '3rd_floor': 'Third Floor'
    };

    // Transform API response to chart data format
    const chartData = useMemo(() => {
        if (!apiResponse?.data?.per_location_usage) return null;

        return apiResponse.data.per_location_usage.map(item => ({
            name: locationNames[item.location] || item.location,
            value: item.total || 0,
            color: locationColors[item.location] || '#3b82f6',
            location: item.location
        }));
    }, [apiResponse]);

    return (
        <>
            <div className="">
                <h2 className="text-3xl font-bold font-khula text-[#00104A] mb-6">Demographics - Per Location</h2>
                <div className="mt-3">
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative flex-1">            
                            <input
                                type="date"
                                value={fromDate || ""}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="px-3 py-2 border-2 border-gray-300 rounded-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00104A]/30 w-full"
                            />
                        </div>
                        <span className="text-gray-500">-</span>
                        <div className="relative flex-1">
                            <input
                                type="date"
                                value={toDate || ""}
                                onChange={(e) => setToDate(e.target.value)}
                                className="px-3 py-2 border-2 border-gray-300 rounded-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00104A]/30 w-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-8">
                    <div className="mt-4 flex-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-gray-500 text-xl">Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-red-500 text-xl">{error?.message || "Something went wrong"}</p>
                        </div>
                    ) : !fromDate || !toDate ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-gray-500 text-xl">Please select date range to view data</p>
                        </div>
                    ) : (
                        <PieChartComponent data={chartData} />
                    )}
                </div>
                {/* <hr className="my-4 border-2 border-[#00104A]" /> */}
                <div className="grid grid-cols-1 gap-y-4 text-sm mt-4 flex-1">
                    <h1 className="text-xl font-bold text-[var(--main-color)]">Legends:</h1>
                    {chartData && chartData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="w-6 h-6 inline-block rounded-sm" style={{ backgroundColor: item.color }}></span>
                            <span className="font-semibold text-[#00104A] text-xl font-kulim-park">{item.value}</span>
                            <span className="text-gray-700 font-kulim-park text-lg">{item.name}</span>
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </>
    );
};