# Stacked Bar Chart Sample Data Documentation

## 📊 Overview

This document provides comprehensive information about the sample data used in the dashboard's stacked bar charts. The sample data demonstrates realistic library usage patterns across different age groups and time frames.

## 🎯 Age Groups

All charts use the following age group segmentation:

| Age Group | Color Code | Hex Color | Description |
|-----------|-----------|-----------|-------------|
| **0-12** | Purple | `#8b5cf6` | Children & Pre-teens |
| **13-21** | Blue | `#3b82f6` | Teens & Young Adults |
| **22-35** | Green | `#10b981` | Adults (Primary demographic) |
| **36-59** | Orange | `#f59e0b` | Middle-aged Adults |
| **60+** | Red | `#ef4444` | Seniors |

## 📈 Usage Over Time Data

### Data Structure
```javascript
{
    date: 'YYYY-MM-DD' or 'number',  // Date or time identifier
    '0-12': number,                   // Count for age group 0-12
    '13-21': number,                  // Count for age group 13-21
    '22-35': number,                  // Count for age group 22-35
    '36-59': number,                  // Count for age group 36-59
    '60+': number                     // Count for age group 60+
}
```

### Available Time Frames

#### 1. **Daily Usage** (14 days)
- **Pattern**: Lower on weekends, peaks mid-week
- **Best for**: Short-term trend analysis
- **Date format**: `YYYY-MM-DD` (e.g., `2025-01-01`)
- **Sample range**: 2 weeks of data

```javascript
import { dailyUsageData } from '@/data/sampleChartData';
```

**Key Insights**:
- Weekday average: ~167 visitors
- Weekend average: ~109 visitors
- Peak age group: 22-35 (40-45% of traffic)

#### 2. **Hourly Usage** (8 AM - 8 PM)
- **Pattern**: Peak hours 10 AM - 4 PM, lunch dip at noon
- **Best for**: Staffing optimization
- **Date format**: Hour number (e.g., `8`, `9`, `10`)
- **Sample range**: 13 hours (typical library day)

```javascript
import { hourlyUsageData } from '@/data/sampleChartData';
```

**Key Insights**:
- Peak hour: 3 PM (~219 visitors)
- Slowest hour: 8 PM (~32 visitors)
- Lunch dip: 12 PM (~105 visitors)

#### 3. **Weekly Usage** (12 weeks)
- **Pattern**: Gradual increase, slight holiday dips
- **Best for**: Quarterly performance review
- **Date format**: Week number (e.g., `1`, `2`, `3`)
- **Sample range**: 3 months

```javascript
import { weeklyUsageData } from '@/data/sampleChartData';
```

**Key Insights**:
- Growth trend: ~10% increase over 12 weeks
- Average weekly visitors: ~1,000
- Consistent age group distribution

#### 4. **Monthly Usage** (12 months)
- **Pattern**: Summer break dips (Apr-May), school year peaks
- **Best for**: Annual planning and budgeting
- **Date format**: Month number (e.g., `1`, `2`, `3`)
- **Sample range**: 1 full year

```javascript
import { monthlyUsageData } from '@/data/sampleChartData';
```

**Key Insights**:
- Peak month: October (~6,865 visitors)
- Lowest month: May (~3,684 visitors)
- Summer drop: ~30% decrease

#### 5. **Yearly Usage** (5 years)
- **Pattern**: Steady 8-10% annual growth
- **Best for**: Long-term strategic planning
- **Date format**: Year (e.g., `2021`, `2022`)
- **Sample range**: 2021-2025

```javascript
import { yearlyUsageData } from '@/data/sampleChartData';
```

**Key Insights**:
- 5-year growth: ~35%
- Consistent demographic split
- Increasing engagement across all age groups

## 📚 Category Usage Data

### Data Structure
```javascript
{
    category: 'string',  // Resource category name
    '0-12': number,      // Count for age group 0-12
    '13-21': number,     // Count for age group 13-21
    '22-35': number,     // Count for age group 22-35
    '36-59': number,     // Count for age group 36-59
    '60+': number        // Count for age group 60+
}
```

### Available Categories

| Category | Primary Age Group | Total Usage |
|----------|------------------|-------------|
| **Valenzuela City Library Resources** | 22-35 (41%) | 2,875 |
| **Featured Books** | 22-35 (35%) | 3,369 |
| **NLP eResources** | 22-35 (42%) | 2,260 |
| **DOST - STARBOOKS eResources** | 22-35 (38%) | 2,278 |
| **Let's Read** | 0-12 (20%) | 2,242 |

```javascript
import { categoryUsageData } from '@/data/sampleChartData';
```

## 🛠️ Helper Functions

### 1. Get Data by Time Frame
Automatically select the appropriate dataset based on time frame:

```javascript
import { getUsageDataByTimeFrame } from '@/data/sampleChartData';

const data = getUsageDataByTimeFrame('daily');
// Returns: dailyUsageData
```

**Parameters**:
- `timeFrame`: `'hourly'` | `'daily'` | `'weekly'` | `'monthly'` | `'yearly'`

### 2. Generate Random Data
Create randomized test data for development:

```javascript
import { generateRandomUsageData } from '@/data/sampleChartData';

const testData = generateRandomUsageData(30); // 30 days
```

**Parameters**:
- `days`: Number of days to generate (default: 7)

**Features**:
- Weekend traffic reduction (40% lower)
- Realistic age group distribution
- Date-based generation (backwards from today)

## 📝 Usage Examples

### Example 1: Basic Implementation

```javascript
import { StackedBarChartComponent } from '@/components/ui';
import { dailyUsageData } from '@/data/sampleChartData';

function MyDashboard() {
    return (
        <StackedBarChartComponent 
            data={dailyUsageData} 
            height={320} 
            timeFrame="daily" 
        />
    );
}
```

### Example 2: Dynamic Time Frame Selection

```javascript
import { StackedBarChartComponent } from '@/components/ui';
import { getUsageDataByTimeFrame } from '@/data/sampleChartData';
import { useState } from 'react';

function DynamicChart() {
    const [timeFrame, setTimeFrame] = useState('daily');
    const data = getUsageDataByTimeFrame(timeFrame);

    return (
        <>
            <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
            </select>
            
            <StackedBarChartComponent 
                data={data} 
                height={320} 
                timeFrame={timeFrame} 
            />
        </>
    );
}
```

### Example 3: Category Chart

```javascript
import { StackedBarChartCategoryComponent } from '@/components/ui';
import { categoryUsageData } from '@/data/sampleChartData';

function CategoryChart() {
    return (
        <StackedBarChartCategoryComponent 
            data={categoryUsageData} 
            height={320} 
        />
    );
}
```

### Example 4: Random Test Data

```javascript
import { StackedBarChartComponent } from '@/components/ui';
import { generateRandomUsageData } from '@/data/sampleChartData';
import { useMemo } from 'react';

function TestChart() {
    const testData = useMemo(() => generateRandomUsageData(14), []);

    return (
        <StackedBarChartComponent 
            data={testData} 
            height={320} 
            timeFrame="daily" 
        />
    );
}
```

## 🔄 API Integration

When integrating with real API data, your backend should return data in this format:

### For Usage Over Time:
```javascript
[
    {
        date: "2025-01-01",
        age_group: "0-12",
        count: 12
    },
    {
        date: "2025-01-01",
        age_group: "13-21",
        count: 45
    },
    // ... more entries
]
```

The chart component will automatically transform this to the required format.

### For Category Usage:
```javascript
[
    {
        category: "Valenzuela City Library Resources",
        age_group: "0-12",
        count: 245
    },
    {
        category: "Valenzuela City Library Resources",
        age_group: "13-21",
        count: 728
    },
    // ... more entries
]
```

## 📊 Data Patterns & Insights

### Realistic Library Usage Patterns

1. **Weekly Cycles**
   - Monday-Friday: Higher traffic (students/workers)
   - Saturday-Sunday: 40% drop

2. **Daily Cycles**
   - Morning ramp-up: 8-10 AM
   - Peak hours: 10 AM - 4 PM
   - Lunch dip: 12-1 PM
   - Evening decline: After 5 PM

3. **Seasonal Patterns**
   - School year: Peak usage (Sept-Nov, Jan-Mar)
   - Summer break: 30% reduction (Apr-May)
   - Holidays: Noticeable dips

4. **Age Group Behaviors**
   - **0-12**: Weekend readers, afternoon visits
   - **13-21**: After-school surge, evening study
   - **22-35**: Consistent throughout day (largest group)
   - **36-59**: Morning and lunch hours
   - **60+**: Morning hours, weekdays

## 🎨 Customization

### Changing Colors

Edit the color constants in the chart components:

```javascript
const AGE_GROUP_COLORS = {
    '0-12': '#8b5cf6',    // Your purple
    '13-21': '#3b82f6',   // Your blue
    '22-35': '#10b981',   // Your green
    '36-59': '#f59e0b',   // Your orange
    '60+': '#ef4444',     // Your red
};
```

### Adding More Time Frames

Create new datasets following the same structure:

```javascript
export const quarterlyUsageData = [
    { date: 'Q1', '0-12': 1242, '13-21': 3998, ... },
    { date: 'Q2', '0-12': 1094, '13-21': 3635, ... },
    // ...
];
```

## 🐛 Troubleshooting

### Chart Not Showing
- Verify data format matches expected structure
- Check that all age groups are present
- Ensure date/category fields are strings

### Incorrect Stacking
- All bars must have the same `stackId` prop
- Verify data transformation in the component

### Date Format Issues
- Use ISO format for dates: `YYYY-MM-DD`
- Ensure consistent formatting across dataset

## 📚 Additional Resources

- [Recharts Documentation](https://recharts.org/)
- [Stacked Bar Chart Examples](https://recharts.org/en-US/examples/StackedBarChart)
- [Component Source Files](../components/ui/)

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Maintained by**: Arima (Frontend Web Developer)
