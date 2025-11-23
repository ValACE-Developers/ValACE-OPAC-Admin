import { X, ExternalLink, Book, User, Hash, MapPin, Calendar, Globe } from "lucide-react";
import { useEffect } from "react";
import { DEFAULT_COVER } from "../../utils/defaultImageCover";

export const BookDetailsModal = ({ book, isOpen, onClose }) => {

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !book) return null;

    // Extract book data with fallbacks - using new API response fields
    const bookTitle = book.title || "Untitled";
    const bookAuthor = book.authors || "Unknown Author";
    const bookThumbnail = book.thumbnail || DEFAULT_COVER;
    const bookDescription = book.description || "No description available.";
    const bookUrl = book.book_link || book.url || book.link || "";
    const bookCallNumber = book.call_number || "";

    const bookIsbn = book.isbn || "";
    const bookIssn = book.issn || "";
    const bookSource = book.api_resource?.resource?.name || "Unknown Source";
    const bookLastFetch = book.last_fetch_at ? new Date(book.last_fetch_at).toLocaleDateString() : "";

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-300">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900">Book Details</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/80 rounded-full transition-colors"
                    >
                        <X className="w-10 h-10 text-black" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Book Cover */}
                        <div className="flex-shrink-0 flex justify-center lg:justify-start">
                            <div className="relative group">
                                <img
                                    src={bookThumbnail}
                                    alt={bookTitle}
                                    className="w-64 h-80 object-cover rounded-xl shadow-lg transition-transform group-hover:scale-105 mb-5"
                                    onError={(e) => {
                                        e.target.src = DEFAULT_COVER;
                                    }}
                                />
                                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" /> */}
                                {bookSource && (
                                    <div className="flex items-start gap-3 rounded-lg">
                                        <div>
                                            <span className="text-gray-700 text-sm"><strong>Source:</strong> {bookSource}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Right Column - Book Information */}
                        <div className="flex-1 space-y-6">
                            {/* Title and Author */}
                            <div className="space-y-3">
                                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{bookTitle}</h1>
                                <div className="flex items-center gap-2 text-lg text-gray-600">
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">{bookAuthor}</span>
                                </div>
                            </div>

                            {/* Description */}
                            {(bookDescription && bookDescription !== "No description available.") ? (
                                <div className="bg-gray-50 p-5 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Book className="w-4 h-4" />
                                        Description
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed text-sm">{bookDescription}</p>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-5 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">

                                        Description
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed text-sm">No description available.</p>
                                </div>
                            )}

                            {/* Book Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {bookCallNumber && (
                                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                                        <div>
                                            <span className="font-semibold text-gray-900 block">Call Number</span>
                                            <span className="text-gray-700 font-mono text-sm">{bookCallNumber}</span>
                                        </div>
                                    </div>
                                )}

                                {bookLastFetch && (
                                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-gray-900 block">Last Updated</span>
                                            <span className="text-gray-700 text-sm">{bookLastFetch}</span>
                                        </div>
                                    </div>
                                )}

                                {/* ISBN/ISSN */}
                                {(bookIsbn || bookIssn) && (
                                    <div className="bg-red-100 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-3">Identifiers</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {bookIsbn && (
                                                <div className="flex items-center gap-2 rounded-lg">
                                                    <Hash className="w-4 h-4 text-gray-500" />
                                                    <span className="font-medium text-gray-900">ISBN:</span>
                                                    <span className="text-gray-700 font-mono text-sm">{bookIsbn}</span>
                                                </div>
                                            )}
                                            {bookIssn && (
                                                <div className="flex items-center gap-2 rounded-lg">
                                                    <Hash className="w-4 h-4 text-gray-500" />
                                                    <span className="font-medium text-gray-900">ISSN:</span>
                                                    <span className="text-gray-700 font-mono text-sm">{bookIssn}sample</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer with Action Button */}
                {bookUrl && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <div className="flex justify-center">
                            <button
                                onClick={() => window.open(bookUrl, '_blank')}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Read Book
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetailsModal;
