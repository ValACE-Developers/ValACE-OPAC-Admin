/**
 * Author: Jerry Castrudes
 * Date: September 19, 2025
 * Description: Search and filters component for resource page
 * Version: 1.0.0
 * Last Updated: September 19, 2025
 */

import React from "react";
import { Search, X } from "lucide-react";

const SearchAndFilters = ({
    search,
    onSearchChange,
    typeFilter,
    onTypeFilterChange,
    statusFilter,
    onStatusFilterChange,
    sort,
    onResetFilters,
}) => {
    const hasActiveFilters = search.trim() || typeFilter !== "ALL" || sort.key;

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="flex-col w-1/2">
                <label className="text-sm text-gray-500">
                    Search Resources
                </label>
                <div className="relative flex">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Search resources..."
                        className="w-full pl-10 pr-10 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
                    />
                    {search && (
                        <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                            onClick={() => onSearchChange({ target: { value: "" } })}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-2 ml-auto">
                <div className="flex-col">
                    <label className="text-sm text-gray-500">
                        Filter by Type
                    </label>
                    <div className="md:w-56 w-full px-2 border border-gray-300 rounded-md focus-within:border-[var(--main-color)] focus-within:ring-2 focus-within:ring-[var(--main-color)]">
                        <select
                            className="w-full bg-transparent border-none px-3 py-2 focus:outline-none"
                            value={typeFilter}
                            onChange={onTypeFilterChange}
                        >
                            <option value="ALL">All Types</option>
                            <option value="API">API</option>
                            <option value="REDIRECT">REDIRECT</option>
                        </select>
                    </div>
                </div>
                <div className="flex-col w-1/3">
                    <label className="text-sm text-gray-500">
                        Filter by Status
                    </label>
                    <div className="md:w-56 w-full px-2 border border-gray-300 rounded-md focus-within:border-[var(--main-color)] focus-within:ring-2 focus-within:ring-[var(--main-color)]">
                        <select
                            className="w-full bg-transparent border-none px-3 py-2 focus:outline-none"
                            value={statusFilter}
                            onChange={onStatusFilterChange}
                        >
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex">
                {hasActiveFilters && (
                    <button
                        onClick={onResetFilters}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <span className="flex items-center gap-2">
                            <span>Reset Filters</span>
                            <X className="w-4 h-4" />
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchAndFilters;
