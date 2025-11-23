import { Loader2 } from "lucide-react";
import { useMemo } from "react";

export const Dropdown = ({
    isLoading,
    filters,
    selected,
    toggleFilter,
    filterType,
    setFilterType,
}) => {
    const resourceNames = filters?.map((resource) => resource.name) || [];
    
    // Get all available resource IDs
    const allResourceIds = useMemo(() => {
        return filters?.map((resource) => resource.api_resources?.[0]?.api_resource_id?.toString()).filter(Boolean) || [];
    }, [filters]);
    
    // Check if all individual resources are selected
    const areAllIndividualResourcesSelected = useMemo(() => {
        if (allResourceIds.length === 0) return false;
        const selectedArray = selected ? selected.split(",") : [];
        return allResourceIds.every(id => selectedArray.includes(id));
    }, [selected, allResourceIds]);
    
    // Determine if "Search All" should be highlighted
    const isAllSelected = selected === "" || selected === null || selected === undefined || areAllIndividualResourcesSelected;

    return (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-[var(--main-color)] rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                    Search Type
                </h3>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                    <option value="NONE">All Fields</option>
                    <option value="SEARCH_BY_TITLE">Title</option>
                    <option value="SEARCH_BY_AUTHOR">Author</option>
                    <option value="SEARCH_BY_SUBJECT">Subject</option>
                    <option value="SEARCH_BY_ISBN">ISBN</option>
                    <option value="SEARCH_BY_ISSN">ISSN</option>
                </select>
            </div>
            <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                    Resources
                </h3>
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <span>Loading...</span>
                        <Loader2 className="animate-spin h-5 w-5" />
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {/* Search All Option */}
                        <li
                            className={`cursor-pointer px-3 py-2 text-sm rounded transition ${
                                isAllSelected
                                    ? "bg-[#00104A] text-white"
                                    : "hover:bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => {
                                // Clear all selections to search all resources
                                const event = { target: { value: "" } };
                                toggleFilter("CLEAR_ALL");
                            }}
                        >
                            <div className="flex items-center gap-2">
                                {/* <input
                                    type="checkbox"
                                    className="w-4 h-4"
                                    checked={isAllSelected}
                                    readOnly
                                /> */}
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        Search All Resources
                                    </span>
                                    <span
                                        className={`text-xs ${
                                            isAllSelected
                                                ? "text-gray-200"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        Search across all available resources
                                    </span>
                                </div>
                            </div>
                        </li>
                        
                        {/* Individual Resources */}
                        {resourceNames.length > 0 && filters.map((resource) => {
                            const apiResource = resource.api_resources?.[0];
                            const apiResourceId = apiResource?.api_resource_id;
                            const isResourceSelected = selected?.includes(apiResourceId?.toString());
                            const shouldHighlight = isAllSelected || isResourceSelected;

                            return (
                                <li
                                    key={apiResourceId}
                                    className={`cursor-pointer px-3 py-2 text-sm rounded transition ${
                                        shouldHighlight
                                            ? "bg-[#00104A] text-white"
                                            : "hover:bg-gray-100 text-gray-700"
                                    }`}
                                    onClick={() => toggleFilter(apiResourceId)}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {resource.name}
                                            </span>
                                            <span
                                                className={`text-xs ${
                                                    shouldHighlight
                                                        ? "text-gray-200"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {/* ID: {apiResourceId} */}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};
