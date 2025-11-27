import { useState, useMemo } from "react";
import { StackedBarChartGenderComponent } from "@/components/ui";
import { useGetUsageOverTime } from "@/hooks/dashboard";
import { Calendar } from "lucide-react";

export const UsageOverTimeDemographic = () => {
    const [location, setLocation] = useState("outside");
    const [timeFrame, setTimeFrame] = useState("daily");

    const { data: apiResponse, isLoading, error } = useGetUsageOverTime({
        location: location,
        time_frame: timeFrame
    });

    // Pass raw data directly to the component - it will handle gender separation
    const chartData = useMemo(() => {
        if (!apiResponse?.data) return null;
        return apiResponse.data;
    }, [apiResponse]);

    return (
        <>
            <div>
                <h2 className="text-3xl font-bold font-khula text-[#00104A] mb-6">Demographics - Usage Over Time</h2>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <p className="text-3xl font-kulim-park text-gray-600 mt-1">Age</p>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">Location</span>
                            <select
                                className="px-2 py-3 border-2 border-gray-300 rounded-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                <option value="outside">Internet Access</option>
                                <option value="1st_floor">1st floor</option>
                                <option value="2nd_floor">2nd floor</option>
                                <option value="3rd_floor">3rd floor</option>
                                <option value="all_locations">All Locations</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">Time Frame</span>
                            <div className="relative">
                                <Calendar className="w-6 h-6 text-[#00104A] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <select
                                    className="pl-10 py-3 border-2 border-gray-300 rounded-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
                                    value={timeFrame}
                                    onChange={(e) => setTimeFrame(e.target.value)}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-auto mt-3">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-xl">Loading...</p>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-red-500 text-xl">{error?.message || "Something went wrong"}</p>
                    </div>
                ) : !chartData || chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-xl">No data available</p>
                    </div>
                ) : (
                    <StackedBarChartGenderComponent data={chartData} height={500} timeFrame={timeFrame} />
                )}
            </div>
        </>
    );
};
