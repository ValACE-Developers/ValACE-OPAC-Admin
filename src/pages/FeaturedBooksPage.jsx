import { Header } from "../components/layout";
import { useFeaturedSelection } from "../hooks/books/useFeaturedSelection";
import { useCuratedFeaturedBooks } from "../hooks/books/useCuratedFeaturedBooks";
import { useStoreCuratedFeaturedBooks } from "../hooks/books/useStoreCuratedFeaturedBooks";
import { useDeleteFeaturedBook } from "../hooks/books/useDeleteFeaturedBook";
import { useState, useMemo, useRef } from "react";
import {
    LayoutGrid,
    List,
    Star,
    RefreshCcw,
    Trash2,
    Loader2,
} from "lucide-react";

import {
    useNotification,
    NotificationContainer,
} from "../hooks/useNotification";
import { DEFAULT_COVER } from "@/utils";

export const FeaturedBooksPage = () => {
    // Server-driven pagination state for Book Selection
    const [selectionPage, setSelectionPage] = useState(1);
    const [selectionPerPage, setSelectionPerPage] = useState(20);
    const [selectedBooks, setSelectedBooks] = useState(new Set());
    const [selectedFeaturedBooks, setSelectedFeaturedBooks] = useState(
        new Set()
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const {
        data: featuredBooksSelectionData,
        isLoading: isSelectionLoading,
        isFetching: isFetchingSelection,
        refetch: refetchSelection,
    } = useFeaturedSelection(
        {
            page: selectionPage,
            per_page: selectionPerPage,
            api_resource_id: 1,
            debug: false,
        },
        { enabled: true }
    );

    const {
        data: storedBooksData,
        isLoading: isLoadingStored,
        isFetching: isFetchingStored,
        refetch: refetchStored,
    } = useCuratedFeaturedBooks({
        page: 1,
        per_page: 20,
    });

    // Store curated featured books mutation
    const {
        mutate: storeFeaturedBooks,
        isLoading: isStoring,
        error: storeError,
    } = useStoreCuratedFeaturedBooks({
        onSuccess: (data) => {
            // Clear selection after successful storage
            setSelectedBooks(new Set());
            // Refetch stored books to show the newly added ones
            refetchStored();
            // Show success notification
            showSuccess("Books featured successfully!");
        },
        onError: (error) => {
            // Only show error if it's not a validation error (which shows in the form)
            if (error?.response?.status !== 422) {
                showError(
                    "Failed to feature books. Please try again. " +
                        error.message
                );
            }
        },
    });

    // Delete featured books mutation
    const {
        mutate: deleteFeaturedBook,
        isFetching: isFetchingDelete,
        error: deleteError,
    } = useDeleteFeaturedBook({
        onSuccess: (data) => {
            // Refetch stored books to update the list
            refetchStored();
        },
        onError: (error) => {
            // Only show error if it's not a validation error
            if (error?.response?.status !== 422) {
                showError(
                    "Failed to delete featured book. Please try again. " +
                        error.message
                );
            }
        },
    });

    const booksSelection = featuredBooksSelectionData?.data?.results || [];
    const booksSelectionTotal =
        featuredBooksSelectionData?.data?.total_results || 0;

    const featuredBooks = storedBooksData?.data?.results || [];

    // Get stored book IDs to filter out from selection
    const storedBookIds = useMemo(() => {
        return new Set(
            featuredBooks.map(
                (book) => book?.cache_book?.id || book?.book_cache_id
            )
        );
    }, [featuredBooks]);

    // Filter out already featured books from selection
    const availableBooks = useMemo(() => {
        return booksSelection.filter((book) => {
            const bookId = book?.id || book?.book_cache_id;
            return !storedBookIds.has(bookId);
        });
    }, [booksSelection, storedBookIds]);

    // Notification hook
    const {
        error: showError,
        success: showSuccess,
        notifications,
        removeNotification,
    } = useNotification();

    // Handle featuring books
    const handleFeatureBooks = () => {
        const selectedIdsArray = Array.from(selectedBooks);
        if (selectedIdsArray.length === 0) return;

        // Ensure all IDs are numbers and validate them
        const validatedIds = selectedIdsArray
            .map((id) => {
                const numId = Number(id);
                if (isNaN(numId)) {
                    console.error("Invalid book ID:", id);
                    return null;
                }
                return numId;
            })
            .filter((id) => id !== null);

        if (validatedIds.length === 0) {
            showError(
                "No valid book IDs found. Please try selecting books again."
            );
            return;
        }

        // Log the data being sent for debugging
        console.log("Selected books for featuring:", validatedIds);

        const featuredBooksData = {
            book_cache_ids: validatedIds,
        };

        console.log("Data being sent to API:", featuredBooksData);

        storeFeaturedBooks(featuredBooksData);
    };

    // Handle deleting featured books
    const handleDeleteFeaturedBooks = async () => {
        setIsDeleting(true);
        const selectedFeaturedIdsArray = Array.from(selectedFeaturedBooks);
        if (selectedFeaturedIdsArray.length === 0) return;

        // Ensure all IDs are numbers and validate them
        const validatedIds = selectedFeaturedIdsArray
            .map((id) => {
                const numId = Number(id);
                if (isNaN(numId)) {
                    console.error("Invalid featured book ID:", id);
                    return null;
                }
                return numId;
            })
            .filter((id) => id !== null);

        if (validatedIds.length === 0) {
            showError(
                "No valid featured book IDs found. Please try selecting books again."
            );
            return;
        }

        try {
            // Delete featured books one by one
            for (const featuredBookId of validatedIds) {
                await new Promise((resolve, reject) => {
                    deleteFeaturedBook(featuredBookId, {
                        onSuccess: () => resolve(),
                        onError: (error) => reject(error),
                    });
                });
            }

            // Clear selection after successful deletion
            setSelectedFeaturedBooks(new Set());
            // Show success notification
            showSuccess(
                `${validatedIds.length} featured book(s) deleted successfully!`
            );
        } catch (error) {
            showError(
                "Some featured books failed to delete. Please try again."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle featured book selection
    const handleFeaturedBookClick = (featuredBookId) => {
        setSelectedFeaturedBooks((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(featuredBookId)) {
                newSet.delete(featuredBookId);
            } else {
                newSet.add(featuredBookId);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Header
                title="Manage Featured Books"
                description="Manage the books that are currently featured on the home page"
            />

            {/* Notification Container */}
            <NotificationContainer
                notifications={notifications}
                removeNotification={removeNotification}
            />

            {/* Featured Books Section (Top Box) */}
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mt-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Featured Books
                        </h2>
                        <p className="text-sm text-gray-500">
                            Currently featured books on the home page
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {selectedFeaturedBooks.size > 0 && (
                            <button
                                onClick={handleDeleteFeaturedBooks}
                                disabled={isDeleting || isFetchingDelete}
                                className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-2"
                            >
                                {isDeleting || isFetchingDelete ? (
                                    <>
                                        <RefreshCcw className="w-4 h-4 animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        <span>
                                            Delete ({selectedFeaturedBooks.size}
                                            )
                                        </span>
                                    </>
                                )}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                refetchStored();
                            }}
                            disabled={isLoadingStored}
                            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <span>Refresh Books</span>
                            {isFetchingStored ? (
                                <RefreshCcw className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {isLoadingStored ? (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={`loading-skeleton-${i}`}
                                className="rounded-md overflow-hidden bg-white flex flex-col items-center relative"
                            >
                                <div className="w-[200px] h-[250px] bg-gray-200 animate-pulse"></div>
                                <div className="p-3 w-full text-center">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2 mx-auto"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse mx-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : featuredBooks.length > 0 ? (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {featuredBooks.map((item) => {
                            const book = item?.cache_book || item;
                            const isSelected = selectedFeaturedBooks.has(
                                item?.featured_book_id
                            );
                            return (
                                <div
                                    key={item?.featured_book_id}
                                    className={`rounded-md overflow-hidden bg-white flex flex-col items-center relative group cursor-pointer transition-all duration-200 ${
                                        isSelected
                                            ? "ring-2 ring-red-500 ring-offset-2"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleFeaturedBookClick(
                                            item?.featured_book_id
                                        )
                                    }
                                >
                                    {/* Selection indicator */}
                                    {isSelected && (
                                        <div className="absolute top-2 left-2 z-10 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                            <span className="text-white text-xs font-bold">
                                                ✓
                                            </span>
                                        </div>
                                    )}

                                    {/* Featured indicator */}
                                    <div className="absolute top-2 right-2 z-10 w-10 h-10 p-1 rounded-full bg-yellow-500 flex items-center justify-center border-2 border-white">
                                        <Star className="w-10 h-10 text-white" />
                                    </div>

                                    <div className="w-[200px] h-[250px] bg-white flex items-center justify-center">
                                        <img
                                            src={DEFAULT_COVER}
                                            alt={book?.title || "Book cover"}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="p-3 w-full text-center">
                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                            {book?.title || "Untitled"}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1 line-clamp-1">
                                            {book?.authors ||
                                                book?.author ||
                                                "Unknown author"}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            ID: {item?.featured_book_id}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-48 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center text-gray-400">
                        No featured books yet. Select books from below to
                        feature them.
                    </div>
                )}
            </section>

            {/* Book Selection Section (Bottom Box) */}
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mt-8">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Book Selection
                        </h2>
                        <p className="text-sm text-gray-500">
                            Browse available books to feature (excluding already
                            featured books)
                        </p>
                        {isFetchingSelection && (
                            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                <RefreshCcw className="w-3 h-3 animate-spin" />
                                Loading page {selectionPage}...
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            // Refetch both selection data and stored books
                            // This will update the available books list
                            refetchSelection();
                        }}
                        disabled={isSelectionLoading}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <span>Refresh Books</span>
                        {isFetchingSelection ? (
                            <RefreshCcw className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCcw className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Controls: Entries per page, View switcher, and pagination (server-backed) */}
                <BookSelectionControls
                    books={availableBooks}
                    availableBooks={availableBooks}
                    totalResults={booksSelectionTotal}
                    page={selectionPage}
                    setPage={setSelectionPage}
                    perPage={selectionPerPage}
                    setPerPage={setSelectionPerPage}
                    isLoading={isSelectionLoading}
                    showError={showError}
                    selectedBooks={selectedBooks}
                    setSelectedBooks={setSelectedBooks}
                    onFeatureBooks={handleFeatureBooks}
                    isStoring={isStoring}
                />
            </section>
        </div>
    );
};

export default FeaturedBooksPage;

// Book Selection controls bound to server pagination
const BookSelectionControls = ({
    books,
    availableBooks,
    totalResults,
    page,
    setPage,
    perPage,
    setPerPage,
    isLoading,
    showError,
    selectedBooks,
    setSelectedBooks,
    onFeatureBooks,
    isStoring,
}) => {
    const [isGrid, setIsGrid] = useState(true);
    const lastErrorTime = useRef(0);

    const handleBookClick = (bookId) => {
        setSelectedBooks((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(bookId)) {
                // If already selected, remove it
                newSet.delete(bookId);
            } else {
                // Check if we're at the limit of 10 books
                if (prev.size >= 10) {
                    // Prevent rapid successive error notifications (debounce)
                    const now = Date.now();
                    if (now - lastErrorTime.current > 500) {
                        // 0.5 second debounce
                        showError("Maximum of 10 books can be selected");
                        lastErrorTime.current = now;
                    }
                    return prev; // Return previous state without changes
                }
                // Add the book if under limit
                newSet.add(bookId);
            }
            return newSet;
        });
    };

    const totalPages = Math.max(
        1,
        Math.ceil((totalResults || 0) / (perPage || 1))
    );
    const startItem = totalResults > 0 ? (page - 1) * perPage + 1 : 0;
    const endItem = Math.min(page * perPage, totalResults);

    // Server already paginates, so just show current page results
    const displayBooks = useMemo(() => books || [], [books]);

    const handleEntriesPerPageChange = (num) => {
        setPerPage(num);
        setPage(1); // Reset to first page when changing entries per page
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={`selection-loading-skeleton-${i}`}
                            className="border border-gray-200 rounded-md overflow-hidden bg-gray-50"
                        >
                            <div className="aspect-[3/4] bg-gray-200 animate-pulse"></div>
                            <div className="p-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!books || books.length === 0) {
        return (
            <div className="h-64 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center text-gray-400">
                {totalResults === 0
                    ? "No books available to feature"
                    : "No books available to feature on this page"}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                        Entries per page:
                    </span>
                    <div className="px-1 border border-gray-300 rounded-md focus-within:border-[var(--main-color)] focus-within:ring-1 focus-within:ring-[var(--main-color)]">
                        <select
                            value={perPage}
                            onChange={(e) =>
                                handleEntriesPerPageChange(
                                    Number(e.target.value)
                                )
                            }
                            className="bg-transparent border-none focus:outline-none"
                        >
                            {[5, 10, 20, 50, 100].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-1 border border-gray-300 rounded-md p-1 self-start">
                    <button
                        onClick={() => setIsGrid(true)}
                        className={`p-2 rounded transition-colors ${
                            isGrid
                                ? "bg-[var(--main-color)] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-label="Grid view"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-gray-300" />
                    <button
                        onClick={() => setIsGrid(false)}
                        className={`p-2 rounded transition-colors ${
                            !isGrid
                                ? "bg-[var(--main-color)] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-label="List view"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Results summary */}
                <div className="text-sm text-gray-600">
                    Showing {startItem} to {endItem} of {totalResults} total
                    books
                    {availableBooks.length !== totalResults && (
                        <span className="text-gray-500">
                            {" "}
                            ({availableBooks.length} available to feature)
                        </span>
                    )}
                </div>

                {/* Feature this Book/s Button */}
                <button
                    onClick={onFeatureBooks}
                    disabled={selectedBooks.size === 0 || isStoring}
                    className={`px-3 py-2 text-md rounded-md transition-colors ${
                        selectedBooks.size === 0 || isStoring
                            ? "text-gray-400 cursor-not-allowed bg-gray-200"
                            : "bg-[var(--main-color)] text-white hover:bg-opacity-90"
                    } flex items-center gap-2`}
                >
                    {isStoring ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Featuring Books...</span>
                        </>
                    ) : selectedBooks.size > 0 ? (
                        <>
                            <span>
                                Feature {selectedBooks.size} book
                                {selectedBooks.size > 1 ? "s" : ""}
                            </span>
                            <Star className="w-4 h-4 text-white" />
                        </>
                    ) : (
                        "Select Books to Feature"
                    )}
                </button>
            </div>

            {/* Books list */}
            {isGrid ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {displayBooks.map((book) => (
                        <div
                            key={book?.id || book?.book_cache_id}
                            className={`border-2 rounded-md overflow-hidden bg-white flex flex-col items-center relative cursor-pointer transition-all duration-200 ${
                                selectedBooks.has(
                                    book?.id || book?.book_cache_id
                                )
                                    ? "border-gray-200 shadow-lg"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() =>
                                handleBookClick(book?.id || book?.book_cache_id)
                            }
                        >
                            {/* Checkbox icon in top right - only show when selected */}
                            {selectedBooks.has(
                                book?.id || book?.book_cache_id
                            ) && (
                                <div className="absolute top-2 right-2 z-10 w-10 h-10 p-1 rounded-full bg-yellow-500 flex items-center justify-center border-2 border-white">
                                    <Star className="w-10 h-10 text-white" />
                                </div>
                            )}

                            <div className="w-[200px] h-[250px] bg-white flex items-center justify-center">
                                <img
                                    src={DEFAULT_COVER}
                                    alt={book?.title || "Book cover"}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-3 w-full text-center">
                                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {book?.title || "Untitled"}
                                </div>
                                <div className="text-xs text-gray-600 mt-1 line-clamp-1">
                                    {book?.authors ||
                                        book?.author ||
                                        "Unknown author"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden bg-white">
                    {displayBooks.map((book) => (
                        <div
                            key={book?.id || book?.book_cache_id}
                            className="flex gap-4 p-4 items-start"
                        >
                            <div className="w-[150px] h-[200px] bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                <img
                                    src={DEFAULT_COVER}
                                    alt={book?.title || "Book cover"}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                    {book?.title || "Untitled"}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                    {book?.authors ||
                                        book?.author ||
                                        "Unknown author"}
                                </div>
                                {book?.description && (
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                        {book.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination (centered, max 10 buttons) */}
            <div className="px-2 py-3 border-t border-gray-200 flex justify-center">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className={`px-3 py-1 text-sm rounded ${
                            page === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        Previous
                    </button>
                    {(() => {
                        const maxButtons = 10;
                        let start = Math.max(
                            1,
                            page - Math.floor(maxButtons / 2)
                        );
                        let end = start + maxButtons - 1;
                        if (end > totalPages) {
                            end = totalPages;
                            start = Math.max(1, end - maxButtons + 1);
                        }
                        const pagesToShow = [];
                        for (let p = start; p <= end; p++) pagesToShow.push(p);
                        return pagesToShow.map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-3 py-1 text-sm rounded ${
                                    page === p
                                        ? "bg-[var(--main-color)] text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {p}
                            </button>
                        ));
                    })()}
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className={`px-3 py-1 text-sm rounded ${
                            page === totalPages
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
