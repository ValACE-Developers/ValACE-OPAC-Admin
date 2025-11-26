import { CheckCircle, XCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
    const isActive = status?.toUpperCase() === "ACTIVE";
    return (
        <span
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
            }`}
        >
            {isActive ? (
                <CheckCircle className="w-7 h-7" />
            ) : (
                <XCircle className="w-7 h-7" />
            )}
            {isActive ? "ACTIVE" : "INACTIVE"}
        </span>
    );
};

export default StatusBadge;
