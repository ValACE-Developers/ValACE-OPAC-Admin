const MetricCard = ({ title, value, color = "gray", Icon }) => {
    const colorMap = {
        gray: {
            iconBg: "bg-gray-100",
            iconText: "text-gray-600",
            valueText: "text-gray-700",
        },
        main: {
            iconBg: "bg-[var(--main-color)]/20",
            iconText: "text-[var(--main-color)]",
            valueText: "text-[var(--main-color)]",
        },
        green: {
            iconBg: "bg-green-100",
            iconText: "text-green-600",
            valueText: "text-green-700",
        },
        red: {
            iconBg: "bg-red-100",
            iconText: "text-red-600",
            valueText: "text-red-700",
        },
    };
    const c = colorMap[color] || colorMap.gray;
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-gray-500">{title}</div>
                    <div className={`mt-1 text-2xl font-bold ${c.valueText}`}>
                        {value}
                    </div>
                </div>
                {Icon ? (
                    <div className={`p-3 rounded-full ${c.iconBg}`}>
                        <Icon className={`w-6 h-6 ${c.iconText}`} />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default MetricCard;
