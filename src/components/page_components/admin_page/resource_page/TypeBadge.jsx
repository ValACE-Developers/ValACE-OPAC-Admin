import { Code, Share2 } from "lucide-react";

const TypeBadge = ({ type }) => {
    const isApi = type?.toUpperCase() === "API";
    return (
        <span
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                isApi
                    ? "bg-[var(--main-color)]/20 text-[var(--main-color)]"
                    : "bg-[var(--main-color)]/20 text-[var(--main-color)]"
            }`}
        >
            {isApi ? (
                <Code className="w-7 h-7" />
            ) : (
                <Share2 className="w-7 h-7" />
            )}
            {type}
        </span>
    );
};

export default TypeBadge;
