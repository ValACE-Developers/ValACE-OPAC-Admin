import { Loader2 } from "lucide-react";

export const DemographicCard = ({
    title,
    value,
    isLoading,
    bgColor = "bg-white",
    borderColor = "border-[#00104A]",
    textColor = "text-[#00104A]",
    Icon = null,
	iconColor = "text-[#00104A]",
}) => {
    return (
        <div className={`border-4 ${borderColor} rounded-lg p-6 shadow-md ${bgColor} flex flex-col justify-center h-40 relative overflow-hidden`}>
            {Icon && (
                <div className="absolute -top-4 -right-4 w-48 h-48 flex items-center justify-center">
                    <Icon className={`w-48 h-48 ${iconColor}`} />
                </div>
            )}
            <p className={`text-5xl font-bold ${textColor} text-start relative z-10`}>
                {isLoading ? (
                    <Loader2 className={`w-8 h-8 animate-spin ${textColor}`} />
                ) : (
                    value
                )}
            </p>
            <div className="flex justify-between items-center gap-2 mb-2 relative z-10">
                <h2 className={`text-2xl font-semibold ${textColor}`}>
                    {title}
                </h2>
            </div>
        </div>
    );
};