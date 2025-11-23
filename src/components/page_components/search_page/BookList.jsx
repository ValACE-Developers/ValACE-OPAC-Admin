import { useEffect, useMemo, useState } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { DEFAULT_COVER } from "../../../utils/defaultImageCover";

// Helpers to compute stacked deck springs
const to = (i) => ({ x: 0, y: i * -6, scale: 1, rot: -10 + Math.random() * 20, opacity: 1, delay: i * 60 });
const from = (_i) => ({ x: 0, y: -200, scale: 1.15, rot: 0, opacity: 0 });
const trans = (r, s) => `perspective(1200px) rotateX(10deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

export const BookList = ({ books, isGrid, className = "", onBookClick }) => {
    const normalizedBooks = useMemo(() => books || [], [books]);
    const [gridView, setGridView] = useState("grid");

    const [springs, api] = useSprings(normalizedBooks.length, (i) => ({
        ...to(i),
        from: from(i),
    }));

    // No gestures: pure entrance animation only

    // Re-run the entrance animation whenever the list changes length
    useEffect(() => {
        api.start((i) => ({ ...to(i), from: from(i) }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [normalizedBooks.length]);

    if (!isGrid) {
        return (
            <div className={`flex flex-col gap-4 ${className}`}>
                {normalizedBooks.map((book, idx) => {
                    const bookTitle = book.title || book.book_title || "";
                    const bookAuthor = book.authors || book.author || "";
                    const bookSource = book.source || book.api_resource?.base_url || "";
                    const bookThumbnail = book.thumbnail || DEFAULT_COVER;
                    const bookSubject = book.subject || "";
                    const bookIsbn = book.isbn || "";
                    const bookIssn = book.issn || "";

                    return (
                        <div
                            key={idx}
                            className="flex items-center bg-white rounded-lg shadow p-3 gap-4 border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                            style={{ minHeight: 100 }}
                            onClick={() => onBookClick && onBookClick(book)}
                        >
                            <img
                                src={bookThumbnail}
                                alt={bookTitle}
                                className="w-[80px] sm:w-[120px] h-[120px] sm:h-[160px] object-cover rounded"
                                onError={(e) => {
                                    e.target.src = DEFAULT_COVER;
                                }}
                            />
                            <div className="flex flex-col justify-center flex-1">
                                <h2 className="text-[18px] font-semibold truncate max-w-xs" title={bookTitle}>
                                    {bookTitle}
                                </h2>
                                <p className="text-sm text-gray-500 truncate max-w-xs">{bookAuthor}</p>
                                <p className="text-sm text-gray-500 truncate max-w-xs">{bookSource}</p>
                                {bookSubject && (
                                    <p className="text-xs text-gray-400 truncate max-w-xs">{bookSubject}</p>
                                )}
                                {(bookIsbn || bookIssn) && (
                                    <p className="text-xs text-gray-400 truncate max-w-xs">
                                        {bookIsbn && `ISBN: ${bookIsbn}`}
                                        {bookIsbn && bookIssn && " | "}
                                        {bookIssn && `ISSN: ${bookIssn}`}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Grid mode with toggle between deck and normal grid
    return (
        <div className={`${className}`}>
            <div className="flex justify-end mb-3 opacity-0">
                <div className="inline-flex items-center rounded-lg bg-white shadow px-1 py-1 gap-1">
                    <button
                        onClick={() => setGridView("deck")}
                        className={`px-3 py-1 rounded-md text-sm ${gridView === "deck" ? "bg-[var(--main-color)] text-white" : "text-[var(--main-color)]"}`}
                    >
                        Deck
                    </button>
                    <button
                        onClick={() => setGridView("grid")}
                        className={`px-3 py-1 rounded-md text-sm ${gridView === "grid" ? "bg-[var(--main-color)] text-white" : "text-[var(--main-color)]"}`}
                    >
                        Grid
                    </button>
                </div>
            </div>

            {gridView === "deck" ? (
                <div className={`relative flex items-center justify-center`} style={{ minHeight: 360 }}>
                    {springs.map(({ x, y, rot, scale, opacity }, i) => {
                        const book = normalizedBooks[i] || {};
                        const bookTitle = book.title || book.book_title || "";
                        const bookThumbnail = book.thumbnail || DEFAULT_COVER;

                        return (
                            <animated.div
                                key={`deck-${i}`}
                                className="absolute will-change-transform"
                                style={{
                                    x,
                                    y,
                                    left: "50%",
                                    top: "50%",
                                    transform: interpolate([rot, scale], (r, s) => `translate(-50%, -50%) ${trans(r, s)}`),
                                    opacity,
                                }}
                            >
                                <div
                                    className="rounded-lg shadow-xl bg-white p-2 select-none cursor-pointer hover:shadow-2xl transition-shadow"
                                    style={{ width: 210, height: 250 }}
                                    title={bookTitle}
                                    onClick={() => onBookClick && onBookClick(book)}
                                >
                                    <div
                                        className="w-full h-full rounded-md bg-center bg-cover"
                                        style={{ backgroundImage: `url(${bookThumbnail})` }}
                                    />
                                </div>
                            </animated.div>
                        );
                    })}
                </div>
            ) : (
                <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3`}>
                    {normalizedBooks.map((book, idx) => {
                        const bookTitle = book.title || book.book_title || "";
                        const bookAuthor = book.authors || book.author || "";
                        const bookSource = book.source || book.api_resource?.base_url || "";
                        const bookThumbnail = book.thumbnail || DEFAULT_COVER;
                        const bookSubject = book.subject || "";
                        const bookIsbn = book.isbn || "";
                        const bookIssn = book.issn || "";

                        return (
                            <div
                                key={idx}
                                className="bg-white flex flex-col items-center p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                                style={{ minWidth: 180 }}
                                onClick={() => onBookClick && onBookClick(book)}
                            >
                                <img
                                    src={bookThumbnail}
                                    alt={bookTitle}
                                    className="w-[140px] sm:w-[210px] h-[180px] sm:h-[250px] object-cover rounded mb-2"
                                    onError={(e) => {
                                        e.target.src = DEFAULT_COVER;
                                    }}
                                />
                                <h2 className="text-[18px] font-semibold text-center truncate w-full" title={bookTitle}>
                                    {bookTitle}
                                </h2>
                                <p className="text-sm text-gray-500 text-center w-full truncate">{bookAuthor}</p>
                                <p className="text-sm text-gray-500 text-center w-full truncate">{bookSource}</p>
                                {bookSubject && (
                                    <p className="text-xs text-gray-400 text-center w-full truncate">{bookSubject}</p>
                                )}
                                {(bookIsbn || bookIssn) && (
                                    <p className="text-xs text-gray-400 text-center w-full truncate">
                                        {bookIsbn && `ISBN: ${bookIsbn}`}
                                        {bookIsbn && bookIssn && " | "}
                                        {bookIssn && `ISSN: ${bookIssn}`}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
