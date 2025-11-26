import { Star } from "lucide-react";
import { BookCard } from "@/components/ui";

export const FeaturedBookCard = ({ item }) => {
    const book = item?.cache_book || item;

    return (
        <div
            key={item?.featured_book_id}
            className="rounded-md overflow-hidden bg-white flex flex-col items-center relative group cursor-pointer transition-all duration-200 w-fit hover:shadow-lg p-0"
        >
            {/* Featured indicator */}
            <div className="absolute top-2 right-2 z-10 w-12 h-12 p-2 rounded-full bg-yellow-500 flex gap-2 items-center justify-center border-2 border-white">
				{/* <span className="text-white text-lg font-kulim-park">Featured</span> */}
                <Star className="w-6 h-6 text-white" />
            </div>
            <BookCard book={book} />
        </div>
    );
};