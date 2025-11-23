import { Info } from "lucide-react";

export const NoDataFound = ({ hasSearchCriteria }) => (
    <div className="h-[40vh] sm:h-[60vh] flex flex-col items-center justify-center gap-4 p-2">
        <Info className="h-10 w-10" />
        <h1 className="text-2xl font-bold">No Data Found</h1>
        <p className="text-sm text-gray-500 text-center">
            {hasSearchCriteria
                ? "We couldn't find any results for your search. Please try again with different keywords or filters."
                : "No books are currently available. Please check back later."}
        </p>
    </div>
);
