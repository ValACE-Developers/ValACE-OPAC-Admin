import { AlertCircle } from "lucide-react";

export const ErrorAlert = ({ error, title, description }) => {
    return (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <div>
                <h3 className="text-red-800 font-medium text-2xl">{title}</h3>
                <p className="text-red-600 text-lg">{description || error?.message || 'An error occurred'}</p>
            </div>
        </div>
    );
};