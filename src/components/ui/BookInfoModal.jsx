import { DEFAULT_COVER } from "@/constants/asset";
import { X, User, ExternalLink } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";
import { useTransition, animated } from '@react-spring/web';

export const BookInfoModal = ({ isOpen, onClose, book }) => {

    const transition = useTransition(isOpen, {
        from: { opacity: 0, transform: 'scale(0.95)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.95)' },
        config: { tension: 300, friction: 30 },
    });

    const bookCover = book?.thumbnail || DEFAULT_COVER;
    const bookTitle = book?.title || "Book Title";
    const bookAuthor = book?.authors || "Book Author";
    const bookDescription = book?.description || "No description available.";
    const bookCallNumber = book?.call_number || "N/A";
    const bookLastUpdated = book?.updated_at || "N/A";
    const bookISBN = book?.isbn || "N/A";
    const bookISSN = book?.issn || "N/A";
    const bookUrl = book?.book_link || "#";

    return transition((style, item) =>
        item ? (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-1">
                {/* Backdrop */}
                <animated.div
                    style={{ opacity: style.opacity }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => onClose()}
                />

                {/* Modal */}
                <animated.div 
                    style={style}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                >
                {/* Header */}
                <header className="flex items-center justify-between p-4 shadow-md bg-gray-300/50">
                    <div className="flex items-center gap-3 px-2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--main-color)]">Book Details</h2>
                    </div>
                    <button
                        onClick={() => onClose()}
                        className="p-2 hover:bg-white/80 rounded-full transition-colors"
                    >
                        <X className="w-10 h-10 text-black" />
                    </button>
                </header>

                {/* Content */}
                <main className="py-20 px-16 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Book Cover */}
                        <div className="flex-shrink-0 flex justify-center lg:justify-start">
                            <div className="relative group">
                                <img
                                    src={bookCover}
                                    alt={"ALT Text"}
                                    className="w-64 h-80 object-cover rounded-xl shadow-lg transition-transform group-hover:scale-105 mb-5"
                                    onError={(e) => {
                                        e.target.src = DEFAULT_COVER;
                                    }}
                                />
                                <div>
                                    {/* Gonna add resource source later, response from API does not have it yet */}
                                    <span className="text-[var(--main-color)] text-base sm:text-lg"><strong>Source:</strong> {"N/A"}</span>
                                </div>
                                {bookUrl && bookUrl !== "#" && (
                                    <button
                                        onClick={() => window.open(bookUrl, '_blank')}
                                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-base sm:text-lg bg-[var(--main-color)] text-white font-medium rounded-lg hover:bg-[var(--main-color)]/80 transition-colors"
                                    >
                                        <span>Read Book</span>
                                        <ExternalLink className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                        </div>

                        {/* Right Column - Book Information */}
                        <div className="flex-1 space-y-6">
                            {/* Title and Author */}
                            <div className="space-y-3">
                                <h1 className="text-xl sm:text-2xl font-bold text-[var(--main-color)] leading-tight">{bookTitle}</h1>
                                <div className="flex items-center gap-2 text-sm sm:text-lg text-[var(--main-color)]">
                                    <User className="w-7 h-7" />
                                    <span>{bookAuthor}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-gray-100 p-5 rounded-xl">
                                <h3 className="font-semibold text-lg sm:text-xl text-[var(--main-color)] mb-3 flex items-center gap-2">
                                    Description
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{bookDescription}</p>
                            </div>

                            {/* Book Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                                    <div>
                                        <span className="font-semibold text-lg sm:text-xl text-[var(--main-color)] block">Call Number</span>
                                        <span className="text-gray-700 text-sm sm:text-base">{bookCallNumber}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                                    <div>
                                        <span className="font-semibold text-lg sm:text-xl text-[var(--main-color)] block">Last Updated</span>
                                        <span className="text-gray-700  text-sm sm:text-base">{formatDate(bookLastUpdated)}</span>
                                    </div>
                                </div>

                                {/* ISBN/ISSN */}
                                <div className="bg-red-100 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg sm:text-xl text-[var(--main-color)] mb-3">Identifiers</h3>
                                    <div className="space-y-2">
                                        <div className="rounded-lg">
                                            <span className="font-medium text-sm sm:text-base text-gray-900"># ISBN:</span>
                                            {" "}
                                            <span className="text-gray-700 text-sm">{bookISBN}</span>
                                        </div>
                                        {bookISSN !== "N/A" && (
                                            <div className="flex items-center gap-2 rounded-lg">
                                                <span className="font-medium text-sm sm:text-base text-gray-900"># ISSN:</span>
                                                {" "}
                                                <span className="text-gray-700 text-sm">{bookISSN}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="mt-10 text-gray-200 border-2 rounded-2xl" />
                </main>
                </animated.div>
            </div>
        ) : null
    );
};