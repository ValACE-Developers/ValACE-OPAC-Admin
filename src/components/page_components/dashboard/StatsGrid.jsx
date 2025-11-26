import { StatCard } from "./StatCard";
import { CircleCheckBig, CircleX } from "lucide-react";

export const StatsGrid = ({ resourceMetrics, isLoadingResources }) => {
    return (
        <div className="space-y-6">
            {/* First Row - Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Total Resources Card */}
                <StatCard
                    title="Total Resources"
                    value={resourceMetrics.total}
                    isLoading={isLoadingResources}
                    bgColor="bg-[#00104A]"
                    borderColor="border-[#00104A]"
                    textColor="text-white"
                />

                <StatCard
                    title="APIs"
                    value={resourceMetrics.apis}
                    isLoading={isLoadingResources}
                    textColor="text-gray-900"
                />

                {/* Redirect Links Card */}
                <StatCard
                    title="Redirects"
                    value={resourceMetrics.redirects}
                    isLoading={isLoadingResources}
                    textColor="text-gray-900"
                />

                {/* Active Resources Card */}
                <StatCard
                    title="Active Resources"
                    value={resourceMetrics.active}
                    isLoading={isLoadingResources}
                    borderColor="border-green-500"
                    textColor="text-green-600"
                    Icon={CircleCheckBig}
                />

                {/* Inactive Resources Card */}
                <StatCard
                    title="Inactive Resources"
                    value={resourceMetrics.inactive}
                    isLoading={isLoadingResources}
                    borderColor="border-red-500"
                    textColor="text-red-600"
                    Icon={CircleX}
                />
            </div>
        </div>
    );
};