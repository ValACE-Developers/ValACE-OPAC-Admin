/**
 * Author: Jerry Castrudes
 * Date: September 19, 2025
 * Description: Sortable table header component for resource page
 * Version: 1.0.0
 * Last Updated: September 19, 2025
 */

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const SortableTh = ({
    title,
    sortKey,
    currentSort,
    onSort,
    children,
    className = "",
}) => {
    const isSorted = currentSort.key === sortKey;
    const sortOrder = isSorted ? currentSort.order : null;

    const getSortIcon = () => {
        if (!isSorted) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
        if (sortOrder === "asc")
            return <ArrowUp className="w-4 h-4 text-blue-600" />;
        if (sortOrder === "desc")
            return <ArrowDown className="w-4 h-4 text-blue-600" />;
        return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    };

    const handleSort = () => {
        if (!sortKey) return;

        let newOrder = "asc";
        if (isSorted && currentSort.order === "asc") {
            newOrder = "desc";
        }
        onSort(sortKey, newOrder);
    };

    return (
        <th
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
            onClick={handleSort}
        >
            <div className="flex items-center gap-2">
                {children || title}
                {sortKey && getSortIcon()}
            </div>
        </th>
    );
};

export default SortableTh;
