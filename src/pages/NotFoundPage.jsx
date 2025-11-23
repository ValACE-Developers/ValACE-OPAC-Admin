import { LOGO_IMAGE } from "@/constants/asset";

export const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <img src={LOGO_IMAGE} alt="Logo" className="h-32 mb-4" />
            <h1 className="text-4xl font-bold text-[var(--main-color)]">Page Not Found</h1>
            <p className="mt-4 text-lg text-gray-700">The page you're looking for doesn't exist or you don't have access to it.</p>
            <a href="/" className="mt-6 text-blue-500 hover:underline">
                Go back to Home
            </a>
        </div>
    );
};