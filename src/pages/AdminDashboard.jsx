import { useDashboardStats, useGetVisitorCount } from "@/hooks/dashboard";
import { useMemo, useState } from "react";
import { DashboardHeader, ErrorAlert, FeaturedBookSection, StatsGrid, PerCategoryDemographic, PerLocationDemographic, DemographicCard, UsageOverTimeDemographic } from "@/components/page_components/admin_page/dashboard";
import { UserIcon, Users, Calendar } from "lucide-react";

export const AdminDashboard = () => {
    // State for visitor count filters
    const [location, setLocation] = useState('outside');
    const [timeFrame, setTimeFrame] = useState('today');

    // Fetch dashboard stats
    const {
        data: dashboardStats,
        isLoading: isLoadingDashboardStats,
        error: dashboardStatsError,
    } = useDashboardStats();

    const {
        data: visitorCountData,
        isLoading: isLoadingVisitorCount,
        error: visitorCountError
    } = useGetVisitorCount({ location, time_frame: timeFrame });

    // Calculate resource metrics from dashboard stats or fallback to resources data
    const resourceMetrics = useMemo(() => {
        if (dashboardStats?.data) {
            return {
                total: dashboardStats?.data?.metrics_data?.resources || 0,
                active: dashboardStats?.data?.metrics_data?.active_resources || 0,
                inactive: dashboardStats?.data?.metrics_data?.inactive_resources || 0,
                apis: dashboardStats?.data?.metrics_data?.api_resources || 0,
                redirects: dashboardStats?.data?.metrics_data?.redirect_resources || 0,
                cache_books: dashboardStats?.data?.metrics_data?.cache_books || 0,
                total_featured_books: dashboardStats?.data?.featured_books_data?.total_featured_books || 0,
                featured_books: dashboardStats?.data?.featured_books_data?.featured_books || [],
            };
        }
        return {
            total: 0,
            active: 0,
            inactive: 0,
            apis: 0,
            redirects: 0,
            cache_books: 0,
            total_featured_books: 0,
            featured_books: [],
        };
    }, [dashboardStats]);

    const visitorCounts = useMemo(() => {
        if (visitorCountData?.data) {
            return {
                total_visitors: visitorCountData?.data?.total_visitors || 0,
                male_visitors: visitorCountData?.data?.male_visitors || 0,
                female_visitors: visitorCountData?.data?.female_visitors || 0,
                resource_visits: {
                    vcl_resource: visitorCountData?.data?.resource_visits?.vcl_resource || 0,
                    featured_books: visitorCountData?.data?.resource_visits?.featured_books || 0,
                    nlp_resource: visitorCountData?.data?.resource_visits?.nlp_resource || 0,
                    dost_resource: visitorCountData?.data?.resource_visits?.dost_resource || 0,
                    lets_read_resource: visitorCountData?.data?.resource_visits?.lets_read_resource || 0,
                },
            };
        }
        return {
            total_visitors: 0,
            male_visitors: 0,
            female_visitors: 0,
            resource_visits: {
                vcl_resource: 0,
                featured_books: 0,
                nlp_resource: 0,
                dost_resource: 0,
                lets_read_resource: 0,
            },
        };
    }, [visitorCountData]);

    // Handler functions for filter changes
    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const handleTimeFrameChange = (e) => {
        setTimeFrame(e.target.value);
    };

    return (
        <div className="p-4 lg:p-6">
            {/* Header Section */}
            <DashboardHeader />

            {/* Error States */}
            {dashboardStatsError && (
                <ErrorAlert
                    error={dashboardStatsError}
                    title="Failed to load dashboard data"
                    description={(dashboardStatsError?.message) || 'An error occurred while fetching dashboard statistics'}
                />
            )}

            {visitorCountError && (
                <ErrorAlert
                    error={visitorCountError}
                    title="Failed to load visitor count data"
                    description={(visitorCountError?.message) || 'An error occurred while fetching visitor count data'}
                />
            )}

            {/* Stats Grid */}
            <section className="mt-8">
                <h2 className="text-3xl font-bold font-khula text-[#00104A] mb-6">Resources</h2>
                <StatsGrid
                    resourceMetrics={resourceMetrics}
                    isLoadingResources={isLoadingDashboardStats}
                />
            </section>

            {/* Demographic Data Section */}
            <section className="mt-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold font-khula text-[#00104A] mb-6">Demographics - No. of Visitors</h2>
                    <div className="ml-auto w-fit flex items-center gap-3 mb-4">
                        <div className="relative">
                            <select
                                className="px-1 py-3 border-2 border-gray-300 rounded-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
                                value={location}
                                onChange={handleLocationChange}
                            >
                                <option value="outside">Internet Access</option>
                                <option value="1st_floor">1st Floor</option>
                                <option value="2nd_floor">2nd Floor</option>
                                <option value="3rd_floor">3rd Floor</option>
                                <option value="all_locations">All Locations</option>
                            </select>
                        </div>
                        <div className="relative">
                            <Calendar className="w-8 h-8 text-[#00104A] absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                                className="pl-10 py-3 border-2 border-gray-300 rounded-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
                                value={timeFrame}
                                onChange={handleTimeFrameChange}
                            >
                                <option value="today">Today</option>
                                <option value="this_week">This Week</option>
                                <option value="this_month">This Month</option>
                                <option value="this_year">This Year</option>
                                <option value="all_time">All Time</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <DemographicCard
                            title="Total Visitors"
                            value={visitorCounts.total_visitors}
                            Icon={Users}
                            bgColor="bg-[#00104A]"
                            borderColor="border-[#00104A]"
                            textColor="text-white"
                            iconColor="text-[#8088A4]"
                            isLoading={isLoadingVisitorCount}
                        />
                        <DemographicCard
                            title="Male Visitors"
                            value={visitorCounts.male_visitors}
                            Icon={UserIcon}
                            bgColor="bg-[#3b82f6]"
                            borderColor="border-[#3b82f6]"
                            textColor="text-white"
                            iconColor="text-[#1A78B3]"
                            isLoading={isLoadingVisitorCount}
                        />
                        <DemographicCard
                            title="Female Visitors"
                            value={visitorCounts.female_visitors}
                            Icon={UserIcon}
                            bgColor="bg-[#ef4444]"
                            borderColor="border-[#ef4444]"
                            textColor="text-white"
                            iconColor="text-[#D04949]"
                            isLoading={isLoadingVisitorCount}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <DemographicCard
                            title="Valenzuela City Library Resources"
                            value={visitorCounts.resource_visits.vcl_resource}
                            borderColor="border-gray-200"
                            textColor="text-gray-900"
                            iconColor="text-[#8088A4]"
                            isLoading={isLoadingVisitorCount}
                        />
                        <DemographicCard
                            title="Featured Books"
                            value={visitorCounts.resource_visits.featured_books}
                            borderColor="border-gray-200"
                            textColor="text-gray-900"
                            iconColor="text-[#8088A4]"
                            isLoading={isLoadingVisitorCount}
                        />
                        <DemographicCard
                            title="NLP Resources"
                            value={visitorCounts.resource_visits.nlp_resource}
                            borderColor="border-gray-200"
                            textColor="text-gray-900"
                            iconColor="text-[#8088A4]"
                            isLoading={isLoadingVisitorCount}
                        />
                        <DemographicCard
                            title="DOST - STARBOOKS Resources"
                            value={visitorCounts.resource_visits.dost_resource}
                            borderColor="border-gray-200"
                            textColor="text-gray-900"
                            iconColor="text-[#8088A4]"
                            isLoading={isLoadingVisitorCount}
                        />
                        <DemographicCard
                            title="Let's Read Resources"
                            value={visitorCounts.resource_visits.lets_read_resource}
                            borderColor="border-gray-200"
                            textColor="text-gray-900"
                            iconColor="text-[#8088A4]"
                            isLoading={isLoadingVisitorCount}
                        />
                    </div>
                </div>
            </section>

            <section className="mt-8">
                <UsageOverTimeDemographic />
            </section>

            <section className="mt-8">
                <PerCategoryDemographic />
            </section>

            <section className="mt-8">
                <PerLocationDemographic />
            </section>

            {/* Featured Books Section */}
            <section className="mt-8">
                <FeaturedBookSection
                    featuredBooks={resourceMetrics.featured_books}
                    isLoadingFeaturedBooks={isLoadingDashboardStats}
                    featuredBooksError={dashboardStatsError}
                />
            </section>
        </div>
    );
};

export default AdminDashboard;
