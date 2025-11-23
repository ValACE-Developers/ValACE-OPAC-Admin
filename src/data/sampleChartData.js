/**
 * Sample Chart Data for Dashboard Stacked Bar Charts
 * This file contains realistic sample data for different time frames and categories
 */

// ============================================================================
// USAGE OVER TIME DATA (for StackedBarChartComponent)
// ============================================================================

/**
 * Daily usage data - 2 weeks of library visits
 * Pattern: Lower on weekends, higher mid-week, 22-35 age group dominates
 */
export const dailyUsageData = [
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

/**
 * Hourly usage data - typical day from 8 AM to 8 PM
 * Pattern: Peak hours 10 AM - 4 PM, lunch dip at 12 PM
 */
export const hourlyUsageData = [
    { date: '8', '0-12': 5, '13-21': 8, '22-35': 12, '36-59': 6, '60+': 2 },
    { date: '9', '0-12': 12, '13-21': 18, '22-35': 25, '36-59': 14, '60+': 4 },
    { date: '10', '0-12': 18, '13-21': 32, '22-35': 45, '36-59': 22, '60+': 8 },
    { date: '11', '0-12': 22, '13-21': 38, '22-35': 52, '36-59': 28, '60+': 10 },
    { date: '12', '0-12': 15, '13-21': 28, '22-35': 38, '36-59': 18, '60+': 6 },
    { date: '13', '0-12': 20, '13-21': 42, '22-35': 58, '36-59': 32, '60+': 12 },
    { date: '14', '0-12': 25, '13-21': 48, '22-35': 65, '36-59': 38, '60+': 14 },
    { date: '15', '0-12': 28, '13-21': 52, '22-35': 68, '36-59': 42, '60+': 16 },
    { date: '16', '0-12': 24, '13-21': 45, '22-35': 62, '36-59': 36, '60+': 13 },
    { date: '17', '0-12': 18, '13-21': 35, '22-35': 48, '36-59': 28, '60+': 9 },
    { date: '18', '0-12': 12, '13-21': 25, '22-35': 35, '36-59': 18, '60+': 6 },
    { date: '19', '0-12': 8, '13-21': 15, '22-35': 22, '36-59': 12, '60+': 4 },
    { date: '20', '0-12': 4, '13-21': 8, '22-35': 12, '36-59': 6, '60+': 2 },
];

/**
 * Weekly usage data - 12 weeks (3 months)
 * Pattern: Gradual increase towards semester end, slight dip during holidays
 */
export const weeklyUsageData = [
    { date: '1', '0-12': 85, '13-21': 245, '22-35': 385, '36-59': 185, '60+': 52 },
    { date: '2', '0-12': 92, '13-21': 268, '22-35': 412, '36-59': 198, '60+': 58 },
    { date: '3', '0-12': 88, '13-21': 252, '22-35': 395, '36-59': 192, '60+': 55 },
    { date: '4', '0-12': 95, '13-21': 285, '22-35': 438, '36-59': 215, '60+': 62 },
    { date: '5', '0-12': 78, '13-21': 225, '22-35': 358, '36-59': 172, '60+': 48 },
    { date: '6', '0-12': 102, '13-21': 298, '22-35': 465, '36-59': 228, '60+': 68 },
    { date: '7', '0-12': 108, '13-21': 315, '22-35': 485, '36-59': 242, '60+': 72 },
    { date: '8', '0-12': 98, '13-21': 288, '22-35': 445, '36-59': 218, '60+': 65 },
    { date: '9', '0-12': 105, '13-21': 305, '22-35': 472, '36-59': 235, '60+': 70 },
    { date: '10', '0-12': 112, '13-21': 325, '22-35': 502, '36-59': 252, '60+': 75 },
    { date: '11', '0-12': 118, '13-21': 342, '22-35': 528, '36-59': 265, '60+': 78 },
    { date: '12', '0-12': 125, '13-21': 365, '22-35': 562, '36-59': 282, '60+': 85 },
];

/**
 * Monthly usage data - 12 months (1 year)
 * Pattern: Lower during summer break (Apr-May), peaks during school year
 */
export const monthlyUsageData = [
    { date: '1', '0-12': 385, '13-21': 1245, '22-35': 1885, '36-59': 885, '60+': 252 },
    { date: '2', '0-12': 412, '13-21': 1328, '22-35': 2012, '36-59': 948, '60+': 278 },
    { date: '3', '0-12': 445, '13-21': 1425, '22-35': 2168, '36-59': 1025, '60+': 305 },
    { date: '4', '0-12': 328, '13-21': 1085, '22-35': 1648, '36-59': 768, '60+': 228 },
    { date: '5', '0-12': 298, '13-21': 985, '22-35': 1495, '36-59': 698, '60+': 208 },
    { date: '6', '0-12': 468, '13-21': 1565, '22-35': 2385, '36-59': 1128, '60+': 335 },
    { date: '7', '0-12': 485, '13-21': 1628, '22-35': 2475, '36-59': 1175, '60+': 352 },
    { date: '8', '0-12': 502, '13-21': 1685, '22-35': 2562, '36-59': 1218, '60+': 365 },
    { date: '9', '0-12': 528, '13-21': 1765, '22-35': 2685, '36-59': 1275, '60+': 382 },
    { date: '10', '0-12': 545, '13-21': 1825, '22-35': 2775, '36-59': 1325, '60+': 395 },
    { date: '11', '0-12': 512, '13-21': 1728, '22-35': 2628, '36-59': 1248, '60+': 372 },
    { date: '12', '0-12': 425, '13-21': 1385, '22-35': 2105, '36-59': 998, '60+': 298 },
];

/**
 * Yearly usage data - 5 years
 * Pattern: Steady growth showing library's increasing popularity
 */
export const yearlyUsageData = [
    { date: '2021', '0-12': 4250, '13-21': 12850, '22-35': 19500, '36-59': 9250, '60+': 2750 },
    { date: '2022', '0-12': 4580, '13-21': 13825, '22-35': 21000, '36-59': 9950, '60+': 2950 },
    { date: '2023', '0-12': 4920, '13-21': 14875, '22-35': 22600, '36-59': 10725, '60+': 3180 },
    { date: '2024', '0-12': 5285, '13-21': 16000, '22-35': 24300, '36-59': 11550, '60+': 3425 },
    { date: '2025', '0-12': 5685, '13-21': 17200, '22-35': 26150, '36-59': 12425, '60+': 3685 },
];

// ============================================================================
// CATEGORY USAGE DATA (for StackedBarChartCategoryComponent)
// ============================================================================

/**
 * Resource usage by category and age group
 * Pattern: Featured Books most popular, age distribution varies by resource type
 */
export const categoryUsageData = [
    { 
        category: 'Valenzuela City\nLibrary Resources', 
        '0-12': 245, 
        '13-21': 728, 
        '22-35': 1186, 
        '36-59': 592, 
        '60+': 124 
    },
    { 
        category: 'Featured\nBooks', 
        '0-12': 368, 
        '13-21': 845, 
        '22-35': 1203, 
        '36-59': 715, 
        '60+': 238 
    },
    { 
        category: 'NLP\neResources', 
        '0-12': 122, 
        '13-21': 595, 
        '22-35': 967, 
        '36-59': 478, 
        '60+': 98 
    },
    { 
        category: 'DOST -\nSTARBOOKS\neResources', 
        '0-12': 238, 
        '13-21': 612, 
        '22-35': 845, 
        '36-59': 468, 
        '60+': 115 
    },
    { 
        category: "Let's Read", 
        '0-12': 452, 
        '13-21': 588, 
        '22-35': 724, 
        '36-59': 356, 
        '60+': 122 
    },
];

/**
 * Alternative category data with different patterns
 * Useful for testing different scenarios
 */
export const categoryUsageDataAlt = [
    { 
        category: 'Valenzuela City\nLibrary Resources', 
        '0-12': 180, 
        '13-21': 625, 
        '22-35': 1050, 
        '36-59': 520, 
        '60+': 105 
    },
    { 
        category: 'Featured\nBooks', 
        '0-12': 420, 
        '13-21': 920, 
        '22-35': 1380, 
        '36-59': 780, 
        '60+': 260 
    },
    { 
        category: 'NLP\neResources', 
        '0-12': 95, 
        '13-21': 540, 
        '22-35': 890, 
        '36-59': 420, 
        '60+': 85 
    },
    { 
        category: 'DOST -\nSTARBOOKS\neResources', 
        '0-12': 310, 
        '13-21': 680, 
        '22-35': 920, 
        '36-59': 510, 
        '60+': 140 
    },
    { 
        category: "Let's Read", 
        '0-12': 580, 
        '13-21': 640, 
        '22-35': 780, 
        '36-59': 380, 
        '60+': 140 
    },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get sample data based on time frame
 * @param {string} timeFrame - 'hourly', 'daily', 'weekly', 'monthly', 'yearly'
 * @returns {Array} Sample data array
 */
export const getUsageDataByTimeFrame = (timeFrame) => {
    switch (timeFrame) {
        case 'hourly':
            return hourlyUsageData;
        case 'daily':
            return dailyUsageData;
        case 'weekly':
            return weeklyUsageData;
        case 'monthly':
            return monthlyUsageData;
        case 'yearly':
            return yearlyUsageData;
        default:
            return dailyUsageData;
    }
};

/**
 * Generate random usage data for testing
 * @param {number} days - Number of days to generate
 * @returns {Array} Generated data array
 */
export const generateRandomUsageData = (days = 7) => {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (days - 1 - i));
        
        const dateStr = date.toISOString().split('T')[0];
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const multiplier = isWeekend ? 0.6 : 1;
        
        data.push({
            date: dateStr,
            '0-12': Math.floor((Math.random() * 30 + 10) * multiplier),
            '13-21': Math.floor((Math.random() * 60 + 40) * multiplier),
            '22-35': Math.floor((Math.random() * 80 + 60) * multiplier),
            '36-59': Math.floor((Math.random() * 40 + 30) * multiplier),
            '60+': Math.floor((Math.random() * 15 + 5) * multiplier),
        });
    }
    
    return data;
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
    dailyUsageData,
    hourlyUsageData,
    weeklyUsageData,
    monthlyUsageData,
    yearlyUsageData,
    categoryUsageData,
    categoryUsageDataAlt,
    getUsageDataByTimeFrame,
    generateRandomUsageData,
};
