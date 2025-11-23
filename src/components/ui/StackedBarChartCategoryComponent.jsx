import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for demonstration - realistic resource usage by age group
const sampleData = [
    { category: 'Valenzuela City\nLibrary Resources', '0-12': 45, '13-21': 128, '22-35': 186, '36-59': 92, '60+': 24 },
    { category: 'Featured\nBooks', '0-12': 68, '13-21': 145, '22-35': 203, '36-59': 115, '60+': 38 },
    { category: 'NLP\neResources', '0-12': 22, '13-21': 95, '22-35': 167, '36-59': 78, '60+': 18 },
    { category: 'DOST -\nSTARBOOKS\neResources', '0-12': 38, '13-21': 112, '22-35': 145, '36-59': 68, '60+': 15 },
    { category: "Let's Read", '0-12': 52, '13-21': 88, '22-35': 124, '36-59': 56, '60+': 22 },
];

const AGE_GROUPS = ['0-12', '13-21', '22-35', '36-59', '60+'];

const AGE_GROUP_COLORS = {
    '0-12': '#8b5cf6',    // Purple
    '13-21': '#3b82f6',   // Blue
    '22-35': '#10b981',   // Green
    '36-59': '#f59e0b',   // Orange
    '60+': '#ef4444',     // Red
};

export const StackedBarChartCategoryComponent = ({ data, height = 300 }) => {
    const transformData = (rawData) => {
        if (!rawData || rawData.length === 0) return sampleData;
        
        // API format: [{ category, age_group, count }]
        // Transform to: [{ category, '0-12': count, '13-21': count, '22-35': count, '36-59': count, '60+': count }]
        
        const grouped = {};
        
        rawData.forEach(entry => {
            const key = entry.category;
            
            if (!grouped[key]) {
                grouped[key] = {
                    category: entry.category,
                    '0-12': 0,
                    '13-21': 0,
                    '22-35': 0,
                    '36-59': 0,
                    '60+': 0
                };
            }
            
            // Map age_group to proper key
            if (entry.age_group && AGE_GROUPS.includes(entry.age_group)) {
                grouped[key][entry.age_group] = entry.count || 0;
            }
        });
        
        return Object.values(grouped);
    };

    const chartData = transformData(data);

    return (
        <ResponsiveContainer width="100%" height={height || '100%'}>
            <BarChart
                data={chartData}
                margin={{
                    top: 10,
                    right: 16,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#d9dee7" />
                <XAxis 
                    dataKey="category" 
                    interval={0} 
                    tickMargin={8} 
                    tick={{ fontSize: 16 }} 
                />
                <YAxis 
                    tick={{ fontSize: 16 }} 
                    width={70}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fontSize: 16 } }}
                />
                <Tooltip 
                    contentStyle={{ fontSize: 14 }} 
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Legend 
                    verticalAlign="top" 
                    align="right" 
                    wrapperStyle={{ fontSize: 16 }} 
                />
                {AGE_GROUPS.map((ageGroup) => (
                    <Bar 
                        key={ageGroup}
                        dataKey={ageGroup} 
                        stackId="a"
                        fill={AGE_GROUP_COLORS[ageGroup]} 
                        radius={ageGroup === '60+' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};
