import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AGE_GROUPS = ['0-12', '13-21', '22-35', '36-59', '60+'];

// Blue shades for male (from light to dark)
const MALE_COLORS = {
    '0-12': '#93c5fd',    // Light blue
    '13-21': '#60a5fa',   // Sky blue
    '22-35': '#3b82f6',   // Blue
    '36-59': '#2563eb',   // Dark blue
    '60+': '#1e40af',     // Darker blue
};

// Red shades for female (from light to dark)
const FEMALE_COLORS = {
    '0-12': '#fca5a5',    // Light red
    '13-21': '#f87171',   // Rose red
    '22-35': '#ef4444',   // Red
    '36-59': '#dc2626',   // Dark red
    '60+': '#b91c1c',     // Darker red
};

export const StackedBarChartCategoryGenderComponent = ({ data, height = 500 }) => {
    const transformData = (rawData) => {
        if (!rawData || rawData.length === 0) return [];

        // Group by category and separate male/female data
        const grouped = {};

        rawData.forEach(entry => {
            const categoryKey = entry.category;

            if (!grouped[categoryKey]) {
                grouped[categoryKey] = {
                    category: entry.category,
                    'Male 0-12': 0,
                    'Male 13-21': 0,
                    'Male 22-35': 0,
                    'Male 36-59': 0,
                    'Male 60+': 0,
                    'Female 0-12': 0,
                    'Female 13-21': 0,
                    'Female 22-35': 0,
                    'Female 36-59': 0,
                    'Female 60+': 0,
                };
            }

            const prefix = entry.gender === 'male' ? 'Male' : 'Female';

            // Map age groups with gender prefix
            AGE_GROUPS.forEach(ageGroup => {
                const dataKey = `${prefix} ${ageGroup}`;
                grouped[categoryKey][dataKey] = entry[ageGroup] || 0;
            });
        });

        return Object.values(grouped);
    };

    const chartData = transformData(data);

    return (
        <ResponsiveContainer width="100%" height={height || '100%'}>
            <BarChart
                data={chartData}
                margin={{
                    top: 0,
                    right: 0,
                    left: 12,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#d9dee7" />
                <XAxis
                    dataKey="category"
                    interval={0}
                    textAnchor="middle"
                    tickMargin={10} 
                    tick={{ fontSize: 14 }}
                />
                <YAxis
                    tick={{ fontSize: 14 }}
                    width={40}
                    allowDecimals={false}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fontSize: 14 } }}
                />
                <Tooltip
                    contentStyle={{ fontSize: 14 }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: 16 }}
                    iconSize={18}
                />
                {/* Male bars (blue shades) */}
                {AGE_GROUPS.map((ageGroup, index) => (
                    <Bar
                        key={`male-${ageGroup}`}
                        dataKey={`Male ${ageGroup}`}
                        stackId="a"
                        fill={MALE_COLORS[ageGroup]}
                        radius={index === AGE_GROUPS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                ))}
                {/* Female bars (red shades) */}
                {AGE_GROUPS.map((ageGroup) => (
                    <Bar
                        key={`female-${ageGroup}`}
                        dataKey={`Female ${ageGroup}`}
                        stackId="b"
                        fill={FEMALE_COLORS[ageGroup]}
                        radius={ageGroup === '60+' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};
