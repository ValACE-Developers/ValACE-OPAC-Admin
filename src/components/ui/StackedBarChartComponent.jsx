import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for demonstration - realistic library usage patterns
const sampleData = [
    { date: '2025-01-01', '0-12': 12, '13-21': 45, '22-35': 68, '36-59': 34, '60+': 8 },
    { date: '2025-01-02', '0-12': 18, '13-21': 52, '22-35': 72, '36-59': 38, '60+': 11 },
    { date: '2025-01-03', '0-12': 25, '13-21': 58, '22-35': 85, '36-59': 42, '60+': 14 },
    { date: '2025-01-04', '0-12': 22, '13-21': 48, '22-35': 78, '36-59': 36, '60+': 9 },
    { date: '2025-01-05', '0-12': 8, '13-21': 28, '22-35': 45, '36-59': 22, '60+': 6 },
    { date: '2025-01-06', '0-12': 15, '13-21': 62, '22-35': 91, '36-59': 48, '60+': 15 },
    { date: '2025-01-07', '0-12': 28, '13-21': 72, '22-35': 95, '36-59': 52, '60+': 18 },
    { date: '2025-01-08', '0-12': 30, '13-21': 68, '22-35': 88, '36-59': 45, '60+': 16 },
    { date: '2025-01-09', '0-12': 26, '13-21': 64, '22-35': 82, '36-59': 41, '60+': 13 },
    { date: '2025-01-10', '0-12': 20, '13-21': 55, '22-35': 75, '36-59': 38, '60+': 12 },
    { date: '2025-01-11', '0-12': 14, '13-21': 42, '22-35': 65, '36-59': 32, '60+': 9 },
    { date: '2025-01-12', '0-12': 10, '13-21': 32, '22-35': 48, '36-59': 24, '60+': 7 },
    { date: '2025-01-13', '0-12': 24, '13-21': 66, '22-35': 89, '36-59': 46, '60+': 17 },
    { date: '2025-01-14', '0-12': 32, '13-21': 78, '22-35': 98, '36-59': 55, '60+': 20 },
];

const AGE_GROUPS = ['0-12', '13-21', '22-35', '36-59', '60+'];

const AGE_GROUP_COLORS = {
    '0-12': '#8b5cf6',    // Purple
    '13-21': '#3b82f6',   // Blue
    '22-35': '#10b981',   // Green
    '36-59': '#f59e0b',   // Orange
    '60+': '#ef4444',     // Red
};

export const StackedBarChartComponent = ({ data, height = 300, timeFrame = 'daily' }) => {
    const formatTime = (hour) => {
        const h = parseInt(hour);
        if (h === 0) return '12 AM';
        if (h === 12) return '12 PM';
        if (h < 12) return `${h} AM`;
        if (h > 12) return `${h - 12} PM`;
        return hour;
    };
    
    const formatDateDisplay = (date) => {
        try {
            const d = new Date(date);
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${mm}/${dd}`;
        } catch {
            return date;
        }
    };
    
    const formatWeek = (weekNum) => {
        const num = parseInt(weekNum);
        return `Week ${num}`;
    };
    
    const formatMonth = (monthNum) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = parseInt(monthNum);
        return months[m - 1] || monthNum;
    };
    
    const formatYear = (year) => {
        return year.toString();
    };
    
    const formatXAxis = (value) => {
        if (timeFrame === 'hourly') {
            return formatTime(value);
        }
        if (timeFrame === 'daily') {
            return formatDateDisplay(value);
        }
        if (timeFrame === 'weekly') {
            return formatWeek(value);
        }
        if (timeFrame === 'monthly') {
            return formatMonth(value);
        }
        if (timeFrame === 'yearly') {
            return formatYear(value);
        }
        return value;
    };

    const transformData = (rawData) => {
        if (!rawData || rawData.length === 0) return sampleData;
        
        // API format: [{ date, age_group, count }]
        // Transform to: [{ date, '0-12': count, '13-21': count, '22-35': count, '36-59': count, '60+': count }]
        
        const grouped = {};
        
        rawData.forEach(entry => {
            const key = entry.date;
            
            if (!grouped[key]) {
                grouped[key] = {
                    date: entry.date,
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
                    dataKey="date" 
                    tickFormatter={formatXAxis} 
                    interval="preserveStartEnd" 
                    tickMargin={8} 
                    tick={{ fontSize: 16 }} 
                />
                <YAxis 
                    tick={{ fontSize: 16 }} 
                    width={70}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fontSize: 16 } }}
                />
                <Tooltip 
                    labelFormatter={(label) => formatXAxis(label)} 
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
