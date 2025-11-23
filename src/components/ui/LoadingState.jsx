import { LOGO_IMAGE } from "@/constants/asset";
import { Loader2 } from "lucide-react";

export const LoadingState = ({ title, message }) => {
    return (
        <div className="h-[40vh] sm:h-[60vh] flex flex-col items-center justify-center gap-4">
            <img src={LOGO_IMAGE} alt="Logo" className="h-28" />
            <Loader2 className="animate-spin rounded-full h-10 w-10" />
            <h1 className="text-2xl font-bold text-[var(--main-color)]">
                {title || "Loading Search Results..."}
            </h1>
            <p className="text-sm text-gray-500 text-center">
                {message || "Please wait while we fetch the latest data."}
            </p>
        </div>
    );
};