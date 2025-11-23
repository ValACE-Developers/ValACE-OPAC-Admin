import { LOGO_IMAGE } from "@/constants/asset";

export const NoDataFoundState = ({ title, message }) => {
    return (
        <div className="h-[40vh] sm:h-[60vh] flex flex-col items-center justify-center gap-4">
            <img src={LOGO_IMAGE} alt="Logo" className="h-20 sm:h-28" />
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--main-color)]">
                {title || "No Data Found"}
            </h1>
            <p className="text-sm sm:text-lg text-gray-500 text-center">
                {message || "No data found."}
            </p>
        </div>
    );
};