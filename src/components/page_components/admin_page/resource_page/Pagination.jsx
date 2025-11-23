/**
 * Author: Jerry Castrudes
 * Date: September 19, 2025
 * Description: Pagination component for resource page
 * Version: 1.0.0
 * Last Updated: September 19, 2025
 */

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    entriesPerPage,
    onEntriesPerPageChange,
    totalResults,
    startItem,
    endItem,
    isLoading,
}) => {
    const entriesOptions = [1, 5, 10, 20, 50];

    return (
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-col w-full sm:flex-row sm:justify-between gap-3 sm:items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                        Entries per page:
                    </span>
                    <div className="px-1 border border-gray-300 rounded-md focus-within:border-[var(--main-color)] focus-within:ring-2 focus-within:ring-[var(--main-color)]">
                        <select
                            value={entriesPerPage}
                            onChange={(e) =>
                                onEntriesPerPageChange(Number(e.target.value))
                            }
                            className="bg-transparent border-none focus:outline-none"
                        >
                            {entriesOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() =>
                            onPageChange(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className={`px-3 py-1 text-sm rounded ${currentPage === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </span>
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => onPageChange(i + 1)}
                            className={`px-3 py-1 text-sm rounded ${currentPage === i + 1
                                    ? "bg-[var(--main-color)] text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() =>
                            onPageChange(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 text-sm rounded ${currentPage === totalPages
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </button>
                </div>

                <div className="text-sm text-gray-600">
                    {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                            Loading…
                        </span>
                    ) : (
                        <span>
                            Showing {startItem} to {endItem} of {totalResults}{" "}
                            results
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pagination;
