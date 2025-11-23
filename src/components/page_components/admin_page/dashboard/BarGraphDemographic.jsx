import { useState, useMemo } from "react";
import { StackedBarChartCategoryComponent } from "@/components/ui";
import { useGetPerCategoryUsage } from "@/hooks/dashboard";

export const BarGraphDemographic = () => {

    // Get today's date in local timezone (YYYY-MM-DD)
    const getTodayLocal = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [date, setDate] = useState(getTodayLocal()); // Default to today in local timezone
    const [location, setLocation] = useState("outside");

    const { data: apiResponse, isLoading, error } = useGetPerCategoryUsage({
        date: date,
        location: location
    }, {
        enabled: !!date // Only fetch when date is selected
    });

    // Transform API response to chart data format
    const chartData = useMemo(() => {
        if (!apiResponse?.data) return null;

        // Transform to stacked bar chart format with age groups
        // Expected format: [{ category, age_group, count }]
        return apiResponse.data;
    }, [apiResponse]);

    return (
        <>
            <div>
                <h2 className="text-3xl font-bold font-khula text-[#00104A] mb-6">Demographics - Per Category</h2>
                <div className="flex items-center justify-between gap-4">
                    <p className="text-3xl font-kulim-park text-gray-600 mt-1">Category</p>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                className="px-1 py-3 border-2 border-gray-300 rounded-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
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
                        <div className="relative">
                            <input
                                type="date"
                                value={date || ""}
                                onChange={(e) => setDate(e.target.value)}
                                className="py-2 border-2 border-gray-300 rounded-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-96 mt-3">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-xl">Loading...</p>
                    </div>
                ) : error ? (
					<div className="flex items-center justify-center h-full">
						<p className="text-red-500 text-xl">{error?.message || "Something went wrong"}</p>
					</div>
				): !date ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-xl">Please select a date to view data</p>
                    </div>
                ) : (
                    <StackedBarChartCategoryComponent data={chartData} height={320} />
                )}
            </div>
        </>
    );
};