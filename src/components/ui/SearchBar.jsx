import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useResourcesList } from "@/hooks";
import { useTransition, animated } from '@react-spring/web';

const SEARCH_TYPES = [
    { code: "NONE", label: "All Fields" },
    { code: "SEARCH_BY_TITLE", label: "Title" },
    { code: "SEARCH_BY_AUTHOR", label: "Author" },
    { code: "SEARCH_BY_SUBJECT", label: "Subject" },
    { code: "SEARCH_BY_ISBN", label: "ISBN" },
    { code: "SEARCH_BY_ISSN", label: "ISSN" },
];

export const SearchBar = () => {
    const navigate = useNavigate();
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState("");
    const [filterType, setFilterType] = useState("NONE");

    const { data, isLoading } = useResourcesList({
        type: "API",
        status: "ACTIVE",
    });

    const toggleFilter = (resourceId) => {
        if (resourceId === "CLEAR_ALL") {
            setSelected(""); // Clear all selections to search all resources
            return;
        }

        setSelected((prev) => {
            const selectedArray = prev ? prev.split(",") : [];
            if (selectedArray.includes(resourceId.toString())) {
                return selectedArray
                    .filter((f) => f !== resourceId.toString())
                    .join(",");
            } else {
                return [...selectedArray, resourceId.toString()].join(",");
            }
        });
    };

    const createSearchParams = () => {
        const params = new URLSearchParams();
        
        if (filterType && filterType !== "NONE") {
            params.append("filter_type", filterType);
        }
        
        if (search) {
            params.append("keyword", search);
        }
        
        if (selected) {
            params.append("id", selected);
        }
        
        return params.toString();
    };

    const handleSearch = () => {
        const queryString = createSearchParams();
        navigate(`/search${queryString ? `?${queryString}` : ""}`);
    };

    return (
        <div className="p-2 sm:p-5 m-2 sm:m-4 flex flex-col items-center bg-white">
            <div className="flex w-full max-w-xl items-center gap-3 sm:max-w-[70%] relative">
                <div className="relative w-full">
                    <div
                        className="flex items-center gap-2 w-full bg-white border-2 border-[#00104A] rounded-lg shadow-md px-4 py-3"
                        style={{
                            boxShadow: "var(--shadow-custom)",
                        }}
                    >
                        <button onClick={handleSearch} className="focus:outline-none">
                            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--main-color)]" />
                        </button>
                        <input
                            type="text"
                            placeholder="Search a Book"
                            className="bg-transparent outline-none w-full text-[#00104A] placeholder-[#00104A] text-base sm:text-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="focus:outline-none">
                                <X className="h-5 w-5 sm:h-6 sm:w-6 text-[#00104A]" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <button
                        className="bg-[#00104A] rounded-lg p-3 shadow-lg flex items-center justify-center transition hover:bg-[#223366]"
                        style={{ boxShadow: "var(--shadow-custom)" }}
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                    >
                        <SlidersHorizontal className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </button>

                    {isDropdownOpen && (
                        <Dropdown
                            isLoading={isLoading}
                            filters={data?.data?.results || []}
                            selected={selected}
                            toggleFilter={toggleFilter}
                            filterType={filterType}
                            setFilterType={setFilterType}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const Dropdown = ({
    isLoading,
    filters,
    selected,
    toggleFilter,
    filterType,
    setFilterType,
}) => {
    const transition = useTransition(true, {
        from: { opacity: 0, transform: 'translateY(-10px) scale(0.95)' },
        enter: { opacity: 1, transform: 'translateY(0px) scale(1)' },
        leave: { opacity: 0, transform: 'translateY(-10px) scale(0.95)' },
        config: { tension: 1000, friction: 25 },
    });

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

    return transition((style, item) =>
        item ? (
            <animated.div 
                style={style}
                className="absolute top-full right-1/2 sm:right-0 mt-2 w-96 bg-white border border-[var(--main-color)] rounded-lg shadow-lg z-50"
            >
            <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                    Search Type
                </h3>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                    {SEARCH_TYPES.map(({ code, label }) => (
                        <option key={code} value={code}>
                            {label}
                        </option>
                    ))}
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
                            className={`cursor-pointer px-3 py-2 text-sm rounded transition ${isAllSelected
                                ? "bg-[#00104A] text-white"
                                : "hover:bg-gray-100 text-gray-700"
                                }`}
                            onClick={() => {
                                // Clear all selections to search all resources
                                toggleFilter("CLEAR_ALL");
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        Search All Resources
                                    </span>
                                    <span
                                        className={`text-xs ${isAllSelected
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
                                    className={`cursor-pointer px-3 py-2 text-sm rounded transition ${shouldHighlight
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
                                                className={`text-xs ${shouldHighlight
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
            </animated.div>
        ) : null
    );
};

