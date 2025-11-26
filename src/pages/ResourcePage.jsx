import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    RefreshCw,
    Server,
    CheckCircle,
    Boxes,
    ChevronDown,
    ChevronUp,
    Code,
    Share2,
    XCircle,
} from "lucide-react";
import { useResourcesList } from "../hooks/resources/useResourcesList";
import { useSyncResourceMutation } from "../hooks/resources/useSyncResourceMutation";
import { useSyncEndpointMutation } from "../hooks/resources/useSyncEndpointMutation";
import { useEndpointStatusQuery, useResourceStatusQuery } from "../hooks/resources/useEndpointStatusQuery";
import { useResourceSyncStatus } from "../hooks/resources/useResourceSyncStatus";
import { useNotification, NotificationContainer } from "../hooks/useNotification";
import Breadcrumb from "../components/ui/Breadcrumb";
import {
    StatusBadge,
    TypeBadge,
    MetricCard,
    Th,
    SafeImage,
    SyncStatusBadge,
    SyncStatusIndicator,
    SortableTh,
    Pagination,
    DeleteConfirmationModal,
    SearchAndFilters,
} from "../components/page_components/resource_page/index";
import { Header } from "../components/layout";
import { useForceDeleteResource } from "../hooks/resources/useForceDeleteResource";


export const ResourcePage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [sort, setSort] = useState({ key: null, order: "asc" });
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [openEndpointsId, setOpenEndpointsId] = useState(null);
    const [syncingEndpoints, setSyncingEndpoints] = useState(new Set());
    const [resourceSyncStatuses, setResourceSyncStatuses] = useState({});
    // API call with pagination and sorting parameters
    const { data, isLoading, refetch, isFetching, error } = useResourcesList(
        {
            type: typeFilter !== "ALL" ? typeFilter : undefined,
            status: statusFilter !== "ALL" ? statusFilter : undefined,
            per_page: pageSize,
            page,
            sort_by: sort.key,
            sort_order: sort.order,
        },
        {
            keepPreviousData: true, // Keep previous data while fetching new page
        }
    );

    // Delete (force) resource hook
    const { mutateAsync: forceDeleteResource, isPending: isDeleting } =
        useForceDeleteResource({
            onSuccess: () => {
                // Refresh list after delete
                refetch();
            },
        });

    // Sync hooks and notifications
    const notification = useNotification();
    
    const { mutateAsync: syncResource, isPending: isSyncingResource } = useSyncResourceMutation({
        onSuccess: (data, resourceId) => {
            notification.success(`Started syncing resource with ${data.data?.jobs_dispatched || 0} endpoints`);
            // Force refresh to get updated sync status
            refetch();
        },
        onError: (error) => {
            notification.error(`Failed to sync resource: ${error.message}`);
        },
    });

    const { mutateAsync: syncEndpoint } = useSyncEndpointMutation({
        onSuccess: (data, endpointId) => {
            setSyncingEndpoints(prev => {
                const newSet = new Set(prev);
                newSet.delete(endpointId);
                return newSet;
            });
            notification.success(`Started syncing endpoint: ${data.data?.endpoint_label || 'Unknown'}`);
            // Force refresh to get updated sync status from backend
            refetch();
        },
        onError: (error, endpointId) => {
            setSyncingEndpoints(prev => {
                const newSet = new Set(prev);
                newSet.delete(endpointId);
                return newSet;
            });
            notification.error(`Failed to sync endpoint: ${error.message}`);
        },
    });

    // Delete modal state
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null); // { id, name }

    const openDeleteModal = (id, name) => {
        setPendingDelete({ id, name });
        setIsDeleteOpen(true);
    };

    const closeDeleteModal = () => {
        if (isDeleting) return; // prevent close while deleting
        setIsDeleteOpen(false);
        setPendingDelete(null);
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        try {
            await forceDeleteResource(pendingDelete.id);
            closeDeleteModal();
        } catch (e) {
            // Error handling is done by the mutation's onError callback
        }
    };

    // Handle individual endpoint sync
    const handleSyncEndpoint = async (endpointId) => {
        setSyncingEndpoints(prev => new Set(prev).add(endpointId));
        try {
            await syncEndpoint(endpointId);
            // Success is handled by the mutation's onSuccess callback
        } catch (error) {
            // Remove from syncing state on error
            setSyncingEndpoints(prev => {
                const newSet = new Set(prev);
                newSet.delete(endpointId);
                return newSet;
            });
        }
    };

    // Extract data from API response
    const resources = data?.data?.results || [];
    const totalResults = data?.data?.total_results || 0;
    const totalPages = data?.data?.last_page || 1;
    const currentPage = data?.data?.current_page || 1;

    // Get sync status for each API resource
    const apiResourceIds = resources
        .filter(r => r.type === 'API' && r.api_resources?.[0]?.api_resource_id)
        .map(r => r.api_resources[0].api_resource_id);

    // Track sync status for all API resources
    const [syncStatusMap, setSyncStatusMap] = useState({});

    // Use the sync status hook for the first API resource (for demo purposes)
    // In a real app, you might want to track all resources or use a different approach
    const firstApiResourceId = apiResourceIds[0];
    const { data: syncStatusData } = useResourceSyncStatus(firstApiResourceId, {
        enabled: !!firstApiResourceId
    });

    // Update sync status map when data changes
    useEffect(() => {
        if (syncStatusData?.data) {
            setSyncStatusMap(prev => ({
                ...prev,
                [syncStatusData.data.api_resource_id]: syncStatusData.data
            }));
        }
    }, [syncStatusData]);

    // Update local page state when API returns different page
    useEffect(() => {
        if (currentPage !== page) {
            setPage(currentPage);
        }
    }, [currentPage, page]);

    const metrics = useMemo(() => {
        const total = totalResults; // Use total from API instead of current page results
        const active = resources.filter((r) => r.status === "ACTIVE").length;
        const apis = resources.filter((r) => r.type === "API").length;
        const redirects = resources.filter((r) => r.type === "REDIRECT").length;
        return { total, active, apis, redirects };
    }, [resources, totalResults]);

    const filtered = useMemo(() => {
        let list = resources;

        // If sorting is applied, use resources directly from API (server-side sorting)
        if (sort.key) {
            return list;
        }

        // Apply client-side filtering only when no sorting is active
        if (typeFilter !== "ALL") {
            list = list.filter((r) => r.type === typeFilter);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((r) => r.name.toLowerCase().includes(q));
        }
        return list;
    }, [resources, search, typeFilter, sort.key]);

    // Calculate display values based on API response
    const startItem = totalResults > 0 ? (page - 1) * pageSize + 1 : 0;
    const endItem =
        totalResults > 0 ? Math.min(startItem + pageSize - 1, totalResults) : 0;

    // Handle entries per page change
    const handleEntriesPerPageChange = (newPageSize) => {
        setPageSize(newPageSize);
        setPage(1); // Reset to first page when changing page size
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle sorting
    const handleSort = (sortKey, sortOrder) => {
        setSort({ key: sortKey, order: sortOrder });
        setPage(1); // Reset to first page when sorting
    };

    // Reset filters and sorting
    const handleResetFilters = () => {
        setSearch("");
        setTypeFilter("ALL");
        setSort({ key: null, order: "asc" });
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto space-y-6">
                {/* Breadcrumb */}
                <Breadcrumb items={[{ label: "Resource", isCurrent: true }]} />

                {/* Header */}
                <Header title="Resource Management" />

                {/* Search and filters */}
                <SearchAndFilters
                    search={search}
                    onSearchChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                        // Reset sorting when searching to avoid conflicts
                        if (e.target.value.trim()) {
                            setSort({ key: null, order: "asc" });
                        }
                    }}
                    typeFilter={typeFilter}
                    onTypeFilterChange={(e) => {
                        setTypeFilter(e.target.value);
                        setPage(1);
                        // Reset sorting when filtering to avoid conflicts
                        if (e.target.value !== "ALL") {
                            setSort({
                                key: null,
                                order: "asc",
                            });
                        }
                    }}
                    statusFilter={statusFilter}
                    onStatusFilterChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                        // Reset sorting when filtering to avoid conflicts
                        if (e.target.value !== "ALL") {
                            setSort({
                                key: null,
                                order: "asc",
                            });
                        }
                    }}
                    sort={sort}
                    onResetFilters={handleResetFilters}
                />

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {isLoading ? (
                        <>
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-lg shadow p-4 animate-pulse"
                                >
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    <div className="h-8 bg-gray-200 rounded w-1/4 mt-3" />
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <MetricCard
                                title="Total Resources"
                                value={metrics.total}
                                color="main"
                                Icon={Boxes}
                            />
                            <MetricCard
                                title="APIs"
                                value={metrics.apis}
                                color="main"
                                Icon={Code}
                            />
                            <MetricCard
                                title="Redirects"
                                value={metrics.redirects}
                                color="main"
                                Icon={Share2}
                            />
                            <MetricCard
                                title="Active"
                                value={metrics.active}
                                color="green"
                                Icon={CheckCircle}
                            />
                            <MetricCard
                                title="Inactive"
                                value={totalResults - metrics.active}
                                color="red"
                                Icon={XCircle}
                            />
                        </>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[var(--main-color)]">
                        <h2 className="text-lg font-semibold text-white">
                            Resources
                        </h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => refetch()}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-[var(--main-color)] rounded-md hover:bg-white/90"
                            >
                                {isFetching ? (
                                    <>
                                        <span>Fetching...</span>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        <span>Refresh</span>
                                        <RefreshCw className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() =>
                                    navigate("/admin/resources/choose")
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-white text-[var(--main-color)] rounded-md hover:bg-white/90"
                            >
                                <span>Add Resource</span>
                                <Plus className="w-4 h-4 text-[var(--main-color)]" />
                            </button>
                        </div>
                    </div>

                    {/* Sort indicator */}
                    {sort.key && (
                        <div className="px-6 py-2 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                            <span className="flex items-center gap-2">
                                <span>Sorted by:</span>
                                <span className="font-medium capitalize">
                                    {sort.key}
                                </span>
                                <span className="text-gray-400">
                                    (
                                    {sort.order === "asc"
                                        ? "Ascending"
                                        : "Descending"}
                                    )
                                </span>
                            </span>
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <SortableTh
                                        title="Resource"
                                        sortKey="name"
                                        currentSort={sort}
                                        onSort={handleSort}
                                    >
                                        Resource
                                    </SortableTh>
                                    <SortableTh
                                        title="Type"
                                        sortKey="type"
                                        currentSort={sort}
                                        onSort={handleSort}
                                    >
                                        Type
                                    </SortableTh>
                                    <Th title="Endpoints" />
                                    <Th title="Configuration" />
                                    <Th title="Last Sync" />
                                    <Th title="Sync Status" />
                                    <SortableTh
                                        title="Status"
                                        sortKey="status"
                                        currentSort={sort}
                                        onSort={handleSort}
                                    >
                                        Status
                                    </SortableTh>
                                    <Th title="Actions" />
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    [...Array(pageSize)].map((_, idx) => (
                                        <tr key={idx} className="animate-pulse">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-[150px] h-[200px] bg-gray-200 rounded" />
                                                    <div>
                                                        <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
                                                        <div className="h-3 bg-gray-200 rounded w-24" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 bg-gray-200 rounded w-16" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 bg-gray-200 rounded w-12" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 bg-gray-200 rounded w-20" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 bg-gray-200 rounded w-24" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-6 bg-gray-200 rounded w-20" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 bg-gray-200 rounded w-20 ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-8 text-center text-sm text-gray-500"
                                        >
                                            No resources found
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((r) => {
                                        const isApi = r.type === "API";
                                        const api = isApi
                                            ? r.api_resources?.[0]
                                            : null;
                                        const endpoints = isApi
                                            ? api?.endpoints?.length || 0
                                            : 0;
                                        const lastSync = api?.last_sync_at
                                            ? new Date(
                                                api.last_sync_at
                                            ).toLocaleString()
                                            : "Not synced";
                                        // Use the API resource sync status for the main resource
                                        const syncStatus = api?.sync_status || 'IDLE';
                                        
                                        // Get real-time sync status for endpoints if available
                                        const getEndpointSyncStatus = (endpointId) => {
                                            // First check if we have real-time data for this resource
                                            const resourceSyncData = syncStatusMap[api.api_resource_id];
                                            if (resourceSyncData?.endpoints) {
                                                const realtimeEndpoint = resourceSyncData.endpoints.find(ep => ep.api_endpoint_id === endpointId);
                                                return realtimeEndpoint?.sync_status || 'IDLE';
                                            }
                                            // Fallback to the endpoint's stored sync_status
                                            const endpoint = api?.endpoints?.find(ep => ep.api_endpoint_id === endpointId);
                                            return endpoint?.sync_status || 'IDLE';
                                        };
                                        return (
                                            <React.Fragment key={r.resource_id}>
                                                <tr
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-[100px] h-[150px] rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                                                <SafeImage
                                                                    src={
                                                                        r.image_cover_url
                                                                    }
                                                                    alt={r.name}
                                                                    className="w-full h-auto object-cover"
                                                                    fallback={
                                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                                            <Server className="w-5 h-5 text-gray-500" />
                                                                            <span>
                                                                                No
                                                                                Image
                                                                            </span>
                                                                        </div>
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="text-lg font-medium text-gray-900">
                                                                    {r.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    Resource ID:{" "}
                                                                    {r.resource_id}
                                                                </div>
                                                                {r.description && (
                                                                    <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                                                        {r.description}
                                                                    </div>
                                                                )}
                                                                <div className="text-xs text-gray-400 mt-1">
                                                                    Created: {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-2 w-fit">
                                                            <TypeBadge
                                                                type={r.type}
                                                            />
                                                        </div>
                                                        {r.type === "REDIRECT" && (
                                                            <div className="text-xs text-gray-500 space-y-1">
                                                                <div>
                                                                    {r.redirect_links?.[0]?.redirect_url}
                                                                </div>
                                                                {r.redirect_links?.[0]?.opens_in_new_tab && (
                                                                    <div className="text-blue-600">
                                                                        Opens in new tab
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {isApi ? (
                                                            <div className="flex items-center gap-3">
                                                                <span>{endpoints}</span>
                                                                <button
                                                                    className="text-gray-700 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded-md inline-flex items-center gap-1"
                                                                    onClick={() =>
                                                                        setOpenEndpointsId(
                                                                            openEndpointsId === r.resource_id
                                                                                ? null
                                                                                : r.resource_id
                                                                        )
                                                                    }
                                                                    aria-expanded={openEndpointsId === r.resource_id}
                                                                    aria-controls={`endpoints-panel-${r.resource_id}`}
                                                                >
                                                                    <span>Endpoints</span>
                                                                    {openEndpointsId === r.resource_id ? (
                                                                        <ChevronUp className="w-4 h-4" />
                                                                    ) : (
                                                                        <ChevronDown className="w-4 h-4" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500 italic">
                                                                N/A
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {isApi ? (
                                                            <div className="space-y-1">
                                                                <div className="text-xs">
                                                                    <span className="font-medium">Auth:</span> {api?.auth_type || 'N/A'}
                                                                </div>
                                                                {api?.timeout && (
                                                                    <div className="text-xs">
                                                                        <span className="font-medium">Timeout:</span> {api.timeout}s
                                                                    </div>
                                                                )}
                                                                {api?.retry_attempts && (
                                                                    <div className="text-xs">
                                                                        <span className="font-medium">Retries:</span> {api.retry_attempts}
                                                                    </div>
                                                                )}
                                                                {api?.rate_limit && (
                                                                    <div className="text-xs space-y-1">
                                                                        <div>
                                                                            <span className="font-medium">Rate:</span> {
                                                                                typeof api.rate_limit === 'object'
                                                                                    ? `${api.rate_limit.requests_per_minute || api.rate_limit.requests_per_day || 0}/min`
                                                                                    : `${api.rate_limit}/min`
                                                                            }
                                                                        </div>
                                                                        {typeof api.rate_limit === 'object' && api.rate_limit.burst_limit && (
                                                                            <div>
                                                                                <span className="font-medium">Burst:</span> {api.rate_limit.burst_limit}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500 italic">
                                                                N/A
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {isApi ? (
                                                            lastSync
                                                        ) : (
                                                            <span className="text-gray-500 italic">
                                                                N/A
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {isApi ? (
                                                            <SyncStatusIndicator 
                                                                syncStatus={syncStatus} 
                                                                isRealtime={!!syncStatusMap[api.api_resource_id]}
                                                            />
                                                        ) : (
                                                            <span className="text-gray-500 italic">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <StatusBadge
                                                            status={r.status}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-3 relative">
                                                            {isApi && (
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        className="text-[#00104A] hover:text-[#001a5e] flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        title="Sync all endpoints for this resource"
                                                                        disabled={isSyncingResource || syncStatus === 'SYNCING'}
                                                                        onClick={async () => {
                                                                            try {
                                                                                await syncResource(api.api_resource_id);
                                                                            } catch (error) {
                                                                                // Error handling is done by the mutation's onError callback
                                                                            }
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            {isSyncingResource ? 'Starting...' : 'Sync All'}
                                                                        </span>
                                                                        <RefreshCw className={`w-4 h-4 ${(isSyncingResource || syncStatus === 'SYNCING') ? 'animate-spin' : ''}`} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {r.type ===
                                                                "REDIRECT" &&
                                                                r
                                                                    .redirect_links?.[0]
                                                                    ?.redirect_url && (
                                                                    <a
                                                                        href={
                                                                            r
                                                                                .redirect_links[0]
                                                                                .redirect_url
                                                                        }
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                                                        title="Open link"
                                                                    >
                                                                        <ExternalLink className="w-4 h-4" />
                                                                        <span>
                                                                            Visit
                                                                            Link
                                                                        </span>
                                                                    </a>
                                                                )}
                                                            <button
                                                                className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
                                                                title="Edit"
                                                                onClick={() => 
                                                                   {
                                                                    const editPath = r.type === "REDIRECT" 
                                                                        ? `/admin/resources/${r.resource_id}/edit/redirect` 
                                                                        : `/admin/resources/${r.resource_id}/edit/api`;
                                                                    navigate(editPath, { state: { resource: r } })
                                                                   }
                                                                }
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                                <span>Edit</span>
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-700 flex items-center gap-2 disabled:opacity-60"
                                                                title="Delete"
                                                                disabled={isDeleting}
                                                                onClick={() => openDeleteModal(r.resource_id, r.name)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                <span>{
                                                                    isDeleting
                                                                        ? "Deleting..."
                                                                        : "Delete"
                                                                }</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {isApi && openEndpointsId === r.resource_id && (
                                                    <tr id={`endpoints-panel-${r.resource_id}`} className="bg-gray-50">
                                                        <td colSpan={8} className="px-6 py-4">
                                                            <div className="border border-gray-200 rounded-md bg-white">
                                                                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                                                    <div className="text-sm font-medium text-gray-900">Endpoints</div>
                                                                    <button
                                                                        className="text-gray-500 hover:text-gray-700 text-xs"
                                                                        onClick={() => setOpenEndpointsId(null)}
                                                                    >
                                                                        Close
                                                                    </button>
                                                                </div>
                                                                <div className="max-h-80 overflow-auto">
                                                                    {api?.endpoints?.length ? (
                                                                        <ul className="divide-y divide-gray-100">
                                                                            {api.endpoints.map((ep) => (
                                                                                
                                                                                <li key={ep.api_endpoint_id} className="flex items-center justify-between gap-3 px-4 py-3">
                                                                               
                                                                                    <div className="min-w-0 flex-1">
                                                                                        <div className="text-sm font-medium text-gray-900 truncate">{ep.label}</div>
                                                                                        <div className="text-xs text-gray-500 truncate">{ep.method} • {ep.endpoint_path}</div>
                                                                                        {ep.description && (
                                                                                            <div className="text-xs text-gray-400 mt-1 truncate">{ep.description}</div>
                                                                                        )}
                                                                                        {ep.collection_name && (
                                                                                            <div className="text-xs text-blue-600 mt-1">Collection: {ep.collection_name}</div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-3">
                                                                                        <span className={`text-xs px-2 py-1 rounded-full ${ep.status === 'ACTIVE'
                                                                                                ? 'bg-green-100 text-green-700'
                                                                                                : 'bg-gray-100 text-gray-700'
                                                                                            }`}>
                                                                                            {ep.status || 'INACTIVE'}
                                                                                        </span>
                                                                                        <SyncStatusIndicator 
                                                                                            syncStatus={getEndpointSyncStatus(ep.api_endpoint_id)} 
                                                                                            isRealtime={!!syncStatusMap[api.api_resource_id]}
                                                                                            className="text-xs"
                                                                                        />
                                                                                        <button 
                                                                                            className="text-[var(--main-color)] hover:text-[var(--main-color)]/80 text-xs px-2 py-1 border border-blue-200 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                                                                                            title={`Sync endpoint ${ep.api_endpoint_id} - ${ep.label}`}
                                                                                            disabled={syncingEndpoints.has(ep.api_endpoint_id) || getEndpointSyncStatus(ep.api_endpoint_id) === 'SYNCING' || ep.status !== 'ACTIVE'}
                                                                                            onClick={() => {
                                                                                                handleSyncEndpoint(ep.api_endpoint_id);
                                                                                            }}
                                                                                        >
                                                                                            <span>
                                                                                                {(syncingEndpoints.has(ep.api_endpoint_id) || getEndpointSyncStatus(ep.api_endpoint_id) === 'SYNCING') ? 'Syncing...' : 'Sync'}
                                                                                            </span>
                                                                                            <RefreshCw className={`w-4 h-4 ${(syncingEndpoints.has(ep.api_endpoint_id) || getEndpointSyncStatus(ep.api_endpoint_id) === 'SYNCING') ? 'animate-spin' : ''}`} />
                                                                                        </button>
                                                                                    </div>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    ) : (
                                                                        <div className="text-xs text-gray-500 px-4 py-4">No endpoints configured for this resource.</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Component */}
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        entriesPerPage={pageSize}
                        onEntriesPerPageChange={handleEntriesPerPageChange}
                        totalResults={totalResults}
                        startItem={startItem}
                        endItem={endItem}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
                resourceName={pendingDelete?.name}
            />

            {/* Notification Container */}
            <NotificationContainer
                notifications={notification.notifications}
                removeNotification={notification.removeNotification}
            />
        </div>
    );
};
