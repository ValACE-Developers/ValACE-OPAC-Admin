import { Header } from "../components/layout";
import { useFeaturedSelection } from "@/hooks/books/useFeaturedSelection";
import { useCuratedFeaturedBooks } from "@/hooks/books/useCuratedFeaturedBooks";
import { useStoreCuratedFeaturedBooks } from "@/hooks/books/useStoreCuratedFeaturedBooks";
import { useDeleteFeaturedBook } from "@/hooks/books/useDeleteFeaturedBook";
import { useState, useMemo, useRef } from "react";
import {
    Loader2,
    Star,
    X,
    Edit,
} from "lucide-react";

import {
    useNotification,
    NotificationContainer,
} from "../hooks/useNotification";
import { FeaturedBookCard } from "@/components/page_components/dashboard/FeaturedBookCard";
import { Pagination, EntriesDropdown } from "@/components/ui";

export const FeaturedBooksPage = () => {
    // Server-driven pagination state for Book Selection
    const [selectionPage, setSelectionPage] = useState(1);
    const [selectionPerPage, setSelectionPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [selectedBooks, setSelectedBooks] = useState(new Set());
    const [deletingBookId, setDeletingBookId] = useState(null);
    const [isManageMode, setIsManageMode] = useState(false);
    const {
        data: featuredBooksSelectionData,
        isLoading: isSelectionLoading,
    } = useFeaturedSelection(
        {
            page: selectionPage,
            per_page: selectionPerPage,
            api_resource_id: 1,
            search: searchQuery,
            debug: false,
        },
        { enabled: true }
    );

    const {
        data: storedBooksData,
        isLoading: isLoadingStored,
        refetch: refetchStored,
    } = useCuratedFeaturedBooks({
        page: 1,
        per_page: 10,
    });

    // Store curated featured books mutation
    const {
        mutate: storeFeaturedBooks,
        isLoading: isStoring,
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

        const featuredBooksData = {
            book_cache_ids: validatedIds,
        };

        storeFeaturedBooks(featuredBooksData);
    };

    // Handle deleting a single featured book
    const handleDeleteSingleFeaturedBook = async (featuredBookId) => {
        setDeletingBookId(featuredBookId);

        deleteFeaturedBook(featuredBookId, {
            onSuccess: () => {
                showSuccess("Featured book removed successfully!");
                setDeletingBookId(null);
            },
            onError: (error) => {
                showError("Failed to delete featured book. Please try again.");
                setDeletingBookId(null);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* Notification Container */}
            <NotificationContainer
                notifications={notifications}
                removeNotification={removeNotification}
            />

            <Header
                title="Manage Featured Books"
                description="Manage the books that are currently featured on the home page"
            />

            <hr className="my-14 border border-gray-200" />

            {/* Featured Books Section (Top Box) */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-[var(--main-color)]">
                            Featured Books
                        </h2>
                        <p className="text-base text-gray-500">
                            Currently featured books on the home page
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isManageMode ? (
                            <button
                                onClick={() => setIsManageMode(false)}
                                className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                <span>Done</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsManageMode(true)}
                                disabled={featuredBooks.length === 0}
                                className="px-3 py-2 text-sm bg-[var(--main-color)] text-white rounded-md hover:bg-[var(--main-color)]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Manage Featured Books</span>
                            </button>
                        )}
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
                            return (
                                <div key={item?.featured_book_id} className="relative">
                                    {/* X Delete button - only show in manage mode */}
                                    {isManageMode && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSingleFeaturedBook(item?.featured_book_id);
                                            }}
                                            disabled={deletingBookId === item?.featured_book_id}
                                            className="absolute top-[-10px] right-6 z-20 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={deletingBookId === item?.featured_book_id ? "Removing..." : "Click to delete this book"}
                                        >
                                            {deletingBookId === item?.featured_book_id ? (
                                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                                            ) : (
                                                <X className="w-5 h-5 text-white" />
                                            )}
                                        </button>
                                    )}
                                    <FeaturedBookCard
                                        item={item}
                                        showFeaturedBadge={true}
                                        isSelected={false}
                                        onClick={undefined}
                                        className=""
                                    />
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

            <hr className="border my-14 border-gray-200" />

            {/* Book Selection Section (Bottom Box) */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-[var(--main-color)]">
                            Book Selection
                        </h2>
                        <p className="text-base text-gray-500">
                            Browse available books to feature (excluding already
                            featured books)
                        </p>
                    </div>
                </div>

                {/* Search Bar and Feature Button */}
                <div className="mb-4 flex items-center gap-2">
                    <div className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setSearchQuery(searchInput);
                                        setSelectionPage(1);
                                    }
                                }}
                                placeholder="Search books by title, author, or ISBN..."
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                            />
                            {searchInput && (
                                <button
                                    onClick={() => {
                                        setSearchInput("");
                                        setSearchQuery("");
                                        setSelectionPage(1);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Clear search"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setSearchQuery(searchInput);
                                setSelectionPage(1);
                            }}
                            className="px-4 py-2 bg-[var(--main-color)] text-white rounded-md hover:bg-[var(--main-color)]/90 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                    {/* Feature this Book/s Button */}
                    <button
                        onClick={handleFeatureBooks}
                        disabled={selectedBooks.size === 0 || isStoring}
                        className={`px-3 py-2 text-md rounded-md transition-colors ${selectedBooks.size === 0 || isStoring
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
                    searchQuery={searchQuery}
                />
            </section>
        </div>
    );
};

// Book Selection controls bound to server pagination
const BookSelectionControls = ({
    books,
    totalResults,
    page,
    setPage,
    perPage,
    setPerPage,
    isLoading,
    showError,
    selectedBooks,
    setSelectedBooks,
    searchQuery,
}) => {
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

    // Server already paginates, so just show current page results
    const displayBooks = useMemo(() => books || [], [books]);

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
            <div className="h-64 border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center text-gray-400 gap-2">
                {totalResults === 0 ? (
                    searchQuery ? (
                        <>
                            <p className="text-lg font-medium">No books found for "{searchQuery}"</p>
                            <p className="text-sm">Try adjusting your search terms or browse all available books</p>
                        </>
                    ) : (
                        <p>No books available to feature</p>
                    )
                ) : (
                    <p>No books available to feature on this page</p>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Entries Dropdown */}
            <div className="flex items-center">
                <EntriesDropdown
                    entriesPerPage={perPage}
                    setEntriesPerPage={setPerPage}
                    setPage={setPage}
                />
            </div>

            {/* Books list */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {displayBooks.map((book) => (
                    <FeaturedBookCard
                        key={book?.id || book?.book_cache_id}
                        item={book}
                        showFeaturedBadge={false}
                        isSelected={selectedBooks.has(
                            book?.id || book?.book_cache_id
                        )}
                        onClick={() =>
                            handleBookClick(book?.id || book?.book_cache_id)
                        }
                    />
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                page={page}
                setPage={setPage}
                total={totalResults}
                entriesPerPage={perPage}
            />
        </div>
    );
};
