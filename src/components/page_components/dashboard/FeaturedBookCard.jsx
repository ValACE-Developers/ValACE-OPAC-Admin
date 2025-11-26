import { Star } from "lucide-react";
import { BookCard } from "@/components/ui";

export const FeaturedBookCard = ({ 
    item, 
    showFeaturedBadge = true,
    isSelected = false,
    onClick,
    className = ""
}) => {
    const book = item?.cache_book || item;

    return (
        <div
            onClick={onClick}
            className={`rounded-md overflow-hidden bg-white flex flex-col items-center relative group transition-all duration-200 w-fit hover:shadow-lg p-0 ${
                onClick ? 'cursor-pointer' : ''
            } ${
                isSelected ? 'border-2 border-yellow-400 shadow-lg' : 'border-2 border-transparent'
            } ${className}`}
        >
            {/* Featured/Selected indicator */}
            {(showFeaturedBadge || isSelected) && (
                <div className="absolute top-2 right-2 z-10 w-12 h-12 p-2 rounded-full bg-yellow-500 flex gap-2 items-center justify-center border-2 border-white">
                    <Star className="w-6 h-6 text-white" />
                </div>
            )}
            <BookCard book={book} />
        </div>
    );
};