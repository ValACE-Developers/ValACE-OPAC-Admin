import { LOGO_IMAGE } from "@/constants/asset";

export const ErrorState = ({ title, message }) => {
    return (
        <div className="h-[40vh] sm:h-[60vh] flex flex-col items-center justify-center gap-4">
            <img src={LOGO_IMAGE} alt="Logo" className="h-20 sm:h-28" />
            <h1 className="text-xl sm:text-2xl font-bold text-red-600">
                {title || "There was an error occurred."}
            </h1>
            <p className="text-sm sm:text-lg text-gray-500 text-center">
                {message || "An unexpected error occurred. Please try again later."}
            </p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[var(--main-color)] text-white rounded-md">Reload</button>
        </div>
    );
};