import { ChevronDown, ChevronRight, ChevronUp, Edit, Eye, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteExternalResource } from '../api/ApiService';
import { ADMIN_ROUTES } from '../../config/adminRoutes';
import { useAllExternalResources } from '../../hooks/useDashboardData';
import { NotificationContainer, useNotification } from '../hooks/useNotification';

const ExternalResourcePage = () => {
    const navigate = useNavigate();
    const { data: resourcesData, isLoading, refetch, isFetching } = useAllExternalResources();
    const { notifications, success, error, removeNotification } = useNotification();
    
    // State for table management
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, api, redirect
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [deletingId, setDeletingId] = useState(null);

    // Get resources from the API response
    const resources = resourcesData?.data?.data || [];

    // Filter and sort resources
    const filteredAndSortedResources = useMemo(() => {
        let filtered = resources.filter(resource => {
            const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesType = filterType === 'all' || resource.type === filterType;
            const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;
            
            return matchesSearch && matchesType && matchesStatus;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle nested values
                if (sortConfig.key === 'endpoints_count') {
                    aValue = a.endpoints ? a.endpoints.length : 0;
                    bValue = b.endpoints ? b.endpoints.length : 0;
                } else if (sortConfig.key === 'base_url') {
                    aValue = a.api_resource?.base_url || '';
                    bValue = b.api_resource?.base_url || '';
                } else if (sortConfig.key === 'redirect_url') {
                    aValue = a.redirect_link?.redirect_url || '';
                    bValue = b.redirect_link?.redirect_url || '';
                }

                // Handle different data types
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [resources, searchTerm, filterType, filterStatus, sortConfig]);

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Handle row expansion
    const toggleRowExpansion = (resourceId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(resourceId)) {
            newExpanded.delete(resourceId);
        } else {
            newExpanded.add(resourceId);
        }
        setExpandedRows(newExpanded);
    };

    // Handle delete
    const handleDelete = async (resourceId) => {
        if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
            return;
        }

        setDeletingId(resourceId);
        try {
            const authConfig = {
                username: import.meta.env.VITE_USERNAME,
                password: import.meta.env.VITE_PASSWORD,
            };

            await deleteExternalResource(resourceId, authConfig);
            success('Resource deleted successfully');
            refetch(); // Refresh the data
        } catch (err) {
            error(`Error deleting resource: ${err.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    // Handle view/edit actions
    const handleView = (resource) => {
        if (resource.type === 'redirect' && resource.redirect_link?.redirect_url) {
            window.open(resource.redirect_link.redirect_url, '_blank');
        } else {
            // For API resources, you might want to navigate to a detail page
            console.log('View resource:', resource);
        }
    };

    const handleEdit = (resource) => {
        // Navigate to appropriate edit page based on resource type
        if (resource.type === 'api') {
            navigate(ADMIN_ROUTES.CREATE_API, { state: { editResource: resource } });
        } else if (resource.type === 'redirect') {
            navigate(ADMIN_ROUTES.CREATE_REDIRECT, { state: { editResource: resource } });
        }
    };

    // Utility functions
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status) => {
        const classes = status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800';
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
                {status}
            </span>
        );
    };

    const getTypeBadge = (resource) => {
        if (resource.type === 'redirect') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Redirect Link
                </span>
            );
        }
        
        const apiType = resource.api_resource?.api_type || 'list';
        const classes = apiType === 'search' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-indigo-100 text-indigo-800';
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
                API - {apiType}
            </span>
        );
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronDown className="w-4 h-4 opacity-40" />;
        }
        return sortConfig.direction === 'asc' 
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />;
    };

    const truncateUrl = (url, maxLength = 50) => {
        if (!url || url.length <= maxLength) return url || '';
        return url.substring(0, maxLength) + '...';
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center gap-2 mt-8 text-lg text-[#00104A]">
                    <RefreshCw className="animate-spin h-8 w-8" />
                    <span>Loading external resources...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <NotificationContainer 
                notifications={notifications} 
                removeNotification={removeNotification} 
            />

            {/* Header */}
            <header className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">External Resources</h1>
                        <p className="text-gray-600">Manage API endpoints and redirect links for external access.</p>
                        {isFetching && !isLoading && (
                            <div className="flex items-center gap-2 mt-3 text-sm text-[#00104A]">
                                <RefreshCw className="animate-spin w-4 h-4" />
                                <span>Refreshing data...</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 items-center">
                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className={`flex items-center justify-center p-2.5 text-white rounded-lg transition-colors duration-200 ${
                                isFetching ? "bg-gray-400 cursor-not-allowed" : "bg-[#00104A] hover:bg-[#001a5e]"
                            }`}
                            title="Refresh resources"
                        >
                            <RefreshCw className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`} />
                        </button>
                        <button 
                            onClick={() => navigate(ADMIN_ROUTES.CHOOSE_RESOURCE)}
                            className="flex items-center gap-2 bg-[#00104A] text-white px-4 py-2.5 rounded-lg hover:bg-[#001a5e] transition-colors duration-200"
                        >
                            <Plus className="w-5 h-5" />
                            Add Resource
                        </button>
                    </div>
                </div>
            </header>

            {/* Filters and Search */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
                {/* Search */}
                <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg px-4 py-2 min-w-[300px]">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400 text-sm"
                    />
                </div>

                {/* Type Filter */}
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00104A]"
                >
                    <option value="all">All Types</option>
                    <option value="api">API Resources</option>
                    <option value="redirect">Redirect Links</option>
                </select>

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00104A]"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                {/* Results count */}
                <div className="text-sm text-gray-600">
                    Showing {filteredAndSortedResources.length} of {resources.length} resources
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <span className="sr-only">Expand</span>
                                </th>
                                <th 
                                    onClick={() => handleSort('name')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-1">
                                        Resource Name
                                        {getSortIcon('name')}
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort('type')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-1">
                                        Type
                                        {getSortIcon('type')}
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort('status')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-1">
                                        Status
                                        {getSortIcon('status')}
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort('endpoints_count')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-1">
                                        Endpoints/URL
                                        {getSortIcon('endpoints_count')}
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort('created_at')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-1">
                                        Created
                                        {getSortIcon('created_at')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedResources.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <Search className="w-12 h-12 text-gray-300 mb-4" />
                                            <h3 className="text-lg font-medium mb-2">No resources found</h3>
                                            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAndSortedResources.map((resource) => (
                                    <>
                                        {/* Main row */}
                                        <tr key={resource.resource_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleRowExpansion(resource.resource_id)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {expandedRows.has(resource.resource_id) ? (
                                                        <ChevronDown className="w-5 h-5" />
                                                    ) : (
                                                        <ChevronRight className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {resource.name}
                                                    </div>
                                                    {resource.description && (
                                                        <div className="text-sm text-gray-500 max-w-xs truncate">
                                                            {resource.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getTypeBadge(resource)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(resource.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {resource.type === 'api' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {resource.endpoints ? resource.endpoints.length : 0} endpoints
                                                    </span>
                                                ) : (
                                                    <div className="text-sm text-blue-600 max-w-sm truncate" title={resource.redirect_link?.redirect_url}>
                                                        <a 
                                                            href={resource.redirect_link?.redirect_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="hover:underline"
                                                        >
                                                            {truncateUrl(resource.redirect_link?.redirect_url)}
                                                        </a>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(resource.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleView(resource)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                                        title="View resource"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(resource)}
                                                        className="text-purple-600 hover:text-purple-900 transition-colors"
                                                        title="Edit resource"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(resource.resource_id)}
                                                        disabled={deletingId === resource.resource_id}
                                                        className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete resource"
                                                    >
                                                        {deletingId === resource.resource_id ? (
                                                            <RefreshCw className="animate-spin w-4 h-4" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded details row */}
                                        {expandedRows.has(resource.resource_id) && (
                                            <tr className="bg-blue-50 border-l-4 border-blue-200">
                                                <td colSpan="7" className="px-6 py-4">
                                                    <div className="space-y-4">
                                                        {/* Resource details */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <div>
                                                                <h4 className="font-medium text-gray-800 mb-2">Resource ID</h4>
                                                                <p className="text-gray-600 text-sm">{resource.resource_id}</p>
                                                            </div>
                                                            {resource.api_resource && (
                                                                <>
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-800 mb-2">Base URL</h4>
                                                                        <p className="text-gray-600 text-sm break-all">{resource.api_resource.base_url}</p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-800 mb-2">Auth Type</h4>
                                                                        <p className="text-gray-600 text-sm">{resource.api_resource.auth_type || 'NONE'}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {resource.redirect_link && (
                                                                <>
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-800 mb-2">Redirect URL</h4>
                                                                        <p className="text-gray-600 text-sm break-all">{resource.redirect_link.redirect_url}</p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-800 mb-2">Opens in New Tab</h4>
                                                                        <p className="text-gray-600 text-sm">{resource.redirect_link.opens_in_new_tab ? 'Yes' : 'No'}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div>
                                                                <h4 className="font-medium text-gray-800 mb-2">Last Updated</h4>
                                                                <p className="text-gray-600 text-sm">{formatDate(resource.updated_at)}</p>
                                                            </div>
                                                        </div>

                                                        {/* Endpoints details for API resources */}
                                                        {resource.type === 'api' && resource.endpoints && resource.endpoints.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium text-gray-800 mb-3">Endpoints ({resource.endpoints.length})</h4>
                                                                <div className="space-y-2">
                                                                    {resource.endpoints.map((endpoint, index) => (
                                                                        <div key={endpoint.api_endpoint_id || index} className="bg-white rounded-lg border border-gray-200 p-3">
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex items-center gap-3">
                                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                                                    }`}>
                                                                                        {endpoint.method || 'GET'}
                                                                                    </span>
                                                                                    <span className="font-medium text-gray-900">{endpoint.label}</span>
                                                                                </div>
                                                                                <span className="text-gray-500 text-sm">{endpoint.endpoint_type || 'list'}</span>
                                                                            </div>
                                                                            <div className="mt-2 text-sm text-gray-600">
                                                                                <span className="font-medium">Path:</span> {endpoint.endpoint_path}
                                                                            </div>
                                                                            {endpoint.collection_name && (
                                                                                <div className="mt-1 text-sm text-gray-600">
                                                                                    <span className="font-medium">Collection:</span> {endpoint.collection_name}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExternalResourcePage;