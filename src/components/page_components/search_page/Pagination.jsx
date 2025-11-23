import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { useMobile } from "@/utils";

export const Pagination = ({
    page,
    setPage,
    total,
    entriesPerPage,
    scrollToRef,
    isSearch = false,
    paginationData = null,
}) => {
    // Use backend pagination data if available, otherwise fallback to frontend calculation
    const currentPage = paginationData?.currentPage || page;
    const totalPages = paginationData?.lastPage || Math.ceil(total / entriesPerPage);
    const start = paginationData?.from || ((page - 1) * entriesPerPage + 1);
    const end = paginationData?.to || Math.min(page * entriesPerPage, total);
    const totalResults = paginationData?.total || total; // Add this line
    
    if (totalPages <= 1) return null;

    const isMobile = useMobile();
    const pageButtonCount = isMobile ? 3 : 5;

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= pageButtonCount) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let startPage = Math.max(1, currentPage - Math.floor(pageButtonCount / 2));
            let endPage = startPage + pageButtonCount - 1;
            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = endPage - pageButtonCount + 1;
            }
            for (let i = startPage; i <= endPage; i++) pages.push(i);
        }
        return pages;
    };
    const pageNumbers = getPageNumbers();

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setTimeout(() => {
            if (scrollToRef && scrollToRef.current) {
                scrollToRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 0);
    };

    return (
        <>
            <span className="text-xs text-gray-500 sm:ml-2 mb-2 sm:mb-0">
                Showing {start} to {end} of {totalResults} entries
            </span>
            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 mt-6 select-none">
                <div className="flex justify-center items-center gap-2">
                    <button
                        className="w-9 h-9 rounded flex items-center justify-center text-lg bg-gray-800 text-gray-300 hover:bg-[var(--main-color)] hover:text-white transition disabled:opacity-50"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        aria-label="First"
                    >
                        <ChevronsLeft />
                    </button>
                    <button
                        className="w-9 h-9 rounded flex items-center justify-center text-lg bg-gray-800 text-gray-300 hover:bg-[var(--main-color)] hover:text-white transition disabled:opacity-50"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous"
                    >
                        <ChevronLeft />
                    </button>
                    {pageNumbers.map((num, idx) => (
                        <button
                            key={idx}
                            className={`w-9 h-9 rounded flex items-center justify-center text-lg transition ${
                                currentPage === num
                                    ? "bg-gray-800 text-white hover:bg-[var(--main-color)] hover:text-white font-bold"
                                    : "border border-gray-300 text-[var(--main-color)] hover:bg-gray-800 hover:text-white  "
                            }`}
                            onClick={() => handlePageChange(num)}
                            disabled={currentPage === num}
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        className="w-9 h-9 rounded flex items-center justify-center text-lg bg-gray-800 text-gray-300 hover:bg-[var(--main-color)] hover:text-white transition disabled:opacity-50"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next"
                    >
                        <ChevronRight />
                    </button>
                    <button
                        className="w-9 h-9 rounded flex items-center justify-center text-lg bg-gray-800 text-gray-300 hover:bg-[var(--main-color)] hover:text-white transition disabled:opacity-50"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        aria-label="Last"
                    >
                        <ChevronsRight />
                    </button>
                </div>
            </div>
        </>
    );
};
