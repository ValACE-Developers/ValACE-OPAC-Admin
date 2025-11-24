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

export const StackedBarChartGenderComponent = ({ data, height = 300, timeFrame = 'daily' }) => {
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
        if (!rawData || rawData.length === 0) return [];
        
        // Group by date and separate male/female data
        const grouped = {};
        
        rawData.forEach(entry => {
            const dateKey = entry.date;
            
            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    date: entry.date,
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
                grouped[dateKey][dataKey] = entry[ageGroup] || 0;
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
                    allowDecimals={false}
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
