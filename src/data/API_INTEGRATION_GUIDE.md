# API Integration Guide for Stacked Bar Charts

## Quick Start

Replace sample data with API data in your dashboard components.

## 1. Usage Over Time Chart

### Current Implementation (LineGraphDemographic.jsx)

```javascript
// src/components/page_components/admin_page/dashboard/LineGraphDemographic.jsx

const { data, isLoading, error } = useGetUsageOverTime({
    location: location,
    time_frame: timeFrame,
});

const usageOverTimeData = useMemo(() => data?.data || [], [data]);

<StackedBarChartComponent 
    data={usageOverTimeData} 
    height={320} 
    timeFrame={timeFrame} 
/>
```

### Expected API Response Format

Your API endpoint should return:

```json
{
    "data": [
        {
            "date": "2025-01-01",
            "age_group": "0-12",
            "count": 12
        },
        {
            "date": "2025-01-01",
            "age_group": "13-21",
            "count": 45
        },
        {
            "date": "2025-01-01",
            "age_group": "22-35",
            "count": 68
        },
        {
            "date": "2025-01-01",
            "age_group": "36-59",
            "count": 34
        },
        {
            "date": "2025-01-01",
            "age_group": "60+",
            "count": 8
        }
    ]
}
```

### Component Transformation

The `StackedBarChartComponent` automatically transforms this to:

```javascript
[
    {
        date: "2025-01-01",
        '0-12': 12,
        '13-21': 45,
        '22-35': 68,
        '36-59': 34,
        '60+': 8
    }
]
```

## 2. Category Usage Chart

### Current Implementation (BarGraphDemographic.jsx)

```javascript
// src/components/page_components/admin_page/dashboard/BarGraphDemographic.jsx

const { data: apiResponse, isLoading, error } = useGetPerCategoryUsage({
    date: date,
    location: location
});

const chartData = useMemo(() => {
    if (!apiResponse?.data) return null;
    return apiResponse.data;
}, [apiResponse]);

<StackedBarChartCategoryComponent 
    data={chartData} 
    height={320} 
/>
```

### Expected API Response Format

```json
{
    "data": [
        {
            "category": "Valenzuela City Library Resources",
            "age_group": "0-12",
            "count": 245
        },
        {
            "category": "Valenzuela City Library Resources",
            "age_group": "13-21",
            "count": 728
        },
        {
            "category": "Featured Books",
            "age_group": "0-12",
            "count": 368
        }
    ]
}
```

### Component Transformation

The `StackedBarChartCategoryComponent` transforms this to:

```javascript
[
    {
        category: "Valenzuela City Library Resources",
        '0-12': 245,
        '13-21': 728,
        '22-35': 1186,
        '36-59': 592,
        '60+': 124
    }
]
```

## Backend Requirements

### Age Group Field

Your backend must return `age_group` as one of these **exact** strings:

- `"0-12"`
- `"13-21"`
- `"22-35"`
- `"36-59"`
- `"60+"`

### Date Format by Time Frame

| Time Frame | Date Format | Example |
|------------|-------------|---------|
| Hourly | Hour number (0-23) | `"8"`, `"14"`, `"20"` |
| Daily | ISO date (YYYY-MM-DD) | `"2025-01-15"` |
| Weekly | Week number (1-52) | `"1"`, `"25"`, `"52"` |
| Monthly | Month number (1-12) | `"1"`, `"6"`, `"12"` |
| Yearly | Year (YYYY) | `"2021"`, `"2025"` |

### Category Names

Ensure category names match these formats (with line breaks for display):

- `"Valenzuela City\nLibrary Resources"` or `"Valenzuela City Library Resources"`
- `"Featured\nBooks"` or `"Featured Books"`
- `"NLP\neResources"` or `"NLP eResources"`
- `"DOST -\nSTARBOOKS\neResources"` or `"DOST - STARBOOKS eResources"`
- `"Let's Read"`

> **Note**: The `\n` is for multi-line display on X-axis. Backend can return without `\n`.

## Testing with Sample Data

### Temporarily Use Sample Data

```javascript
// For testing without API
import { dailyUsageData } from '@/data/sampleChartData';

<StackedBarChartComponent 
    data={dailyUsageData}  // Use sample instead of API
    height={320} 
    timeFrame="daily" 
/>
```

### Mix Sample & Real Data

```javascript
// Fallback to sample data if API fails
import { dailyUsageData } from '@/data/sampleChartData';

const chartData = useMemo(() => {
    return data?.data?.length > 0 ? data.data : dailyUsageData;
}, [data]);
```

## SQL Query Examples

### Usage Over Time (Daily)

```sql
SELECT 
    DATE(visit_timestamp) as date,
    age_group,
    COUNT(*) as count
FROM visitor_logs
WHERE 
    location = :location
    AND visit_timestamp >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
GROUP BY DATE(visit_timestamp), age_group
ORDER BY date, age_group;
```

### Category Usage

```sql
SELECT 
    r.category_name as category,
    v.age_group,
    COUNT(*) as count
FROM visitor_resource_logs vr
JOIN resources r ON vr.resource_id = r.id
JOIN visitors v ON vr.visitor_id = v.id
WHERE 
    DATE(vr.access_timestamp) = :date
    AND vr.location = :location
GROUP BY r.category_name, v.age_group
ORDER BY r.category_name, v.age_group;
```

## Debugging

### Check API Response Structure

```javascript
useEffect(() => {
    if (data?.data) {
        console.log('API Response:', data.data);
        console.log('First item:', data.data[0]);
        console.log('Age groups present:', [...new Set(data.data.map(d => d.age_group))]);
    }
}, [data]);
```

### Verify Transformation

```javascript
const chartData = useMemo(() => {
    const transformed = transformData(data?.data);
    console.log('Transformed data:', transformed);
    return transformed;
}, [data]);
```

## Common Issues

### Issue: Bars not stacking properly
**Solution**: Ensure all records for the same date have all 5 age groups (even if count is 0)

### Issue: Missing age groups
**Solution**: Backend must return all age groups. Use LEFT JOIN or UNION ALL to include 0 counts.

### Issue: Date formatting inconsistent
**Solution**: Backend should return dates as strings in consistent format per time frame.

### Issue: Colors not showing
**Solution**: Verify age_group values match exactly: `"0-12"`, `"13-21"`, `"22-35"`, `"36-59"`, `"60+"`

## Performance Tips

1. **Pagination**: For large datasets, limit results server-side
2. **Caching**: Cache frequent queries (today's data, this week, etc.)
3. **Indexing**: Add indexes on `date`, `age_group`, `location`, `category`
4. **Aggregation**: Pre-aggregate data for yearly/monthly views

## Next Steps

1. ✅ Update backend API endpoints to return data in expected format
2. ✅ Add age_group field to visitor records if not present
3. ✅ Test API endpoints with different time frames
4. ✅ Replace sample data imports with API calls
5. ✅ Add error handling for empty/invalid responses

---

**Need Help?**
- Review: `src/data/SAMPLE_DATA_README.md`
- Check: Component files in `src/components/ui/`
- Test with: `generateRandomUsageData()` function
