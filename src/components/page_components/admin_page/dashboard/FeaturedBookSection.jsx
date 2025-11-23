import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Star, ChevronRight, Plus } from "lucide-react";
import { ErrorAlert } from "./ErrorAlert";
import { FeaturedBookCard } from "./FeaturedBookCard";

export const FeaturedBookSection = ({
    featuredBooks,
    isLoadingFeaturedBooks,
    featuredBooksError,
}) => {
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);

    const displayedBooks = useMemo(() => {
        if (!Array.isArray(featuredBooks)) return [];
        return showAll ? featuredBooks : featuredBooks.slice(0, 6);
    }, [featuredBooks, showAll]);

    return (
        <section className="mt-8">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-khula font-semibold text-gray-900 flex items-center gap-2">
                            <Star className="w-7 h-7 text-yellow-500" />
                            <span>
                                Featured Books
                            </span>
                        </h2>
                        <p className="text-lg font-kulim-park text-gray-500 mt-1">
                            Currently featured books on the home page
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/admin/featured-books')}
                            className="p-3 text-sm bg-[#00104a48] text-[#00104A] rounded-full hover:bg-[#001a5e] hover:text-white transition-colors flex items-center gap-2"
                        >
                            <ChevronRight className="w-7 h-7" />
                        </button>
                    </div>
                </div>

                {/* Featured Books Error State */}
                {featuredBooksError && (
                    <ErrorAlert
                        error={featuredBooksError}
                        title="Failed to load featured books"
                        description={featuredBooksError.message || 'An error occurred while fetching featured books'}
                    />
                )}

                {/* Featured Books Loading State */}
                {isLoadingFeaturedBooks ? (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={`loading-skeleton-${i}`}
                                className="rounded-md overflow-hidden bg-white flex flex-col items-center relative"
                            >
                                <div className="w-[150px] h-[200px] bg-gray-200 animate-pulse"></div>
                                <div className="p-3 w-full text-center">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2 mx-auto"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse mx-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : displayedBooks.length > 0 ? (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {displayedBooks.map((item) => (
                            <FeaturedBookCard key={item?.featured_book_id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="h-64 border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center text-gray-400">
                        <Star className="w-15 h-15 mb-3 text-gray-300" />
                        <p className="text-2xl font-khula font-medium">No featured books yet</p>
                        <p className="text-xl font-kulim-park">Start featuring books to showcase them on your home page</p>
                        <button
                            onClick={() => navigate('/admin/featured-books')}
                            className="mt-4 px-4 py-2 text-lg font-khula bg-[#00104A] text-white rounded-md hover:bg-[#001a5e] transition-colors flex items-center gap-2"
                        >
                            <span>Add Featured Books</span>
                            <Plus className="w-7 h-7" />
                        </button>
                    </div>
                )}

                {/* Toggle View All / View Less */}
                {Array.isArray(featuredBooks) && featuredBooks.length > 6 && (
                    <div className="mt-10 text-center flex items-center justify-center">
                        <button
                            onClick={() => setShowAll((v) => !v)}
                            className="px-4 py-2 text-lg font-semibold bg-[#00104A] text-white rounded-md hover:bg-[#001a5e] transition-colors"
                        >
                            {showAll ? 'View less' : 'View all'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};