import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const exampleData = [
    { date: '2025-10-01', male: 5, female: 12 },
    { date: '2025-10-02', male: 12, female: 10 },
    { date: '2025-10-03', male: 10, female: 14 },
    { date: '2025-10-04', male: 22, female: 28 },
    { date: '2025-10-05', male: 26, female: 26 },
    { date: '2025-10-06', male: 29, female: 24 },
    { date: '2025-10-07', male: 23, female: 27 },
    { date: '2025-10-08', male: 16, female: 28 },
    { date: '2025-10-09', male: 37, female: 30 },
    { date: '2025-10-10', male: 34, female: 38 },
];

export const LineChartComponent = ({ data, height = 300, timeFrame = 'daily' }) => {
    const ageGroups = ['0-12', '13-21', '22-35', '36-59', '60+'];
    
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
        // Format: week number (1-52/53) -> Week 1, Week 2, etc.
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

    // Map age index (1-5) to age group labels
    const indexToAgeGroup = (index) => {
        const rounded = Math.round(index);
        // Index 1-5 maps to array index 0-4
        return ageGroups[rounded - 1] || ageGroups[0];
    };

    const transformData = (rawData) => {
        if (!rawData || rawData.length === 0) return [];
        
        // API format: [{ date, gender, average_age_index }]
        // Transform to: [{ date, male, female }] where values are the index numbers
        
        const grouped = {};
        
        rawData.forEach(entry => {
            const key = entry.date;
            
            if (!grouped[key]) {
                grouped[key] = {
                    date: entry.date,
                    male: 0,
                    female: 0
                };
            }
            
            if (entry.gender === 'male') {
                grouped[key].male = entry.average_age_index;
            } else if (entry.gender === 'female') {
                grouped[key].female = entry.average_age_index;
            }
        });
        
        return Object.values(grouped);
    };      

    return (
        <ResponsiveContainer width="100%" height={height || '100%'}>
            <LineChart
                data={transformData(data)}
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
                    type="number"
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    tickFormatter={(value) => {
                        if (value === 0) return 'No data';
                        return ageGroups[value - 1] || value;
                    }}
                    tick={{ fontSize: 16 }} 
                    width={70}
                />
                <Tooltip 
                    labelFormatter={(label) => formatXAxis(label)} 
                    formatter={(value, name) => {
                        if (value === null || value === undefined) return ['No data', name];
                        if (value === 0) return ['No data', name];
                        const ageGroup = indexToAgeGroup(value);
                        return [`${ageGroup} (${value})`, name];
                    }} 
                    contentStyle={{ fontSize: 14 }} 
                />
                <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="plainline" 
                    wrapperStyle={{ fontSize: 16 }} 
                />
                <Line 
                    type="monotone" 
                    dataKey="male" 
                    name="Male" 
                    stroke="#3b82f6" 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 8 }} 
                    strokeWidth={3}
                    connectNulls={true}
                />
                <Line 
                    type="monotone" 
                    dataKey="female" 
                    name="Female" 
                    stroke="#ef4444" 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 8 }} 
                    strokeWidth={3}
                    connectNulls={true}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
