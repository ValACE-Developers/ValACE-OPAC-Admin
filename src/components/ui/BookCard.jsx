import { useState, useEffect } from "react";
import { DEFAULT_COVER, getBookCoverUrl } from "@/utils";

export const BookCard = ({ book }) => {
    const [coverUrl, setCoverUrl] = useState(book?.thumbnail || DEFAULT_COVER);

    useEffect(() => {
        const loadCover = async () => {
            const url = await getBookCoverUrl(book);
            setCoverUrl(url);
        };
        loadCover();
    }, [book]);

    return (
        <>
            <div className="w-[250px] h-[300px] bg-white flex items-center justify-center">
                <img
                    src={coverUrl}
                    alt={book?.title || "Book cover"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        e.target.src = DEFAULT_COVER;
                    }}
                />
            </div>
            <div className="p-1 w-full text-center max-w-[200px]">
                <div className="text-xl font-medium text-gray-900 line-clamp-1">
                    {book?.title || "Untitled"}
                </div>
                <div className="text-base text-gray-600 mt-1 line-clamp-1">
                    {book?.authors || book?.author || "Unknown author"}
                </div>
            </div>
        </>
    );
};
