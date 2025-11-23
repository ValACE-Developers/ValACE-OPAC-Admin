import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const exampleData = [
	{ category: 'Valenzuela City\nLibrary Resources', male: 12, female: 18 },
	{ category: 'Featured\nBooks', male: 22, female: 18 },
	{ category: 'NLP\neResources', male: 30, female: 30 },
	{ category: 'DOST -\nSTARBOOKS\neResources', male: 12, female: 18 },
	{ category: "Let's Read", male: 22, female: 18 },
	{ category: 'Other\nResources', male: 30, female: 30 },
];

export const BarChartComponent = ({ data, height = 300, xKey = 'category', maleKey = 'male', femaleKey = 'female', yMax = 5 }) => {
	// Y-axis for age index (0-5)
	const yTicks = [0, 1, 2, 3, 4, 5];
	const formatAgeIndex = (v) => {
		if (v === 0) return 'No data';
		if (v === 1) return '0-12';
		if (v === 2) return '13-21';
		if (v === 3) return '22-35';
		if (v === 4) return '36-59';
		if (v === 5) return '60+';
		return v;
	};

	return (
		<ResponsiveContainer width="100%" height={height || '100%'}>
			<BarChart
				data={data || exampleData}
				margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
			>
				<CartesianGrid strokeDasharray="3 3" stroke="#d9dee7" />
				<XAxis dataKey={xKey} interval={0} tickMargin={8} tick={{ fontSize: 16 }} />
				<YAxis domain={[0, yMax]} ticks={yTicks} tickFormatter={formatAgeIndex} width={100} tick={{ fontSize: 16 }} />
				<Tooltip 
					formatter={(value, name) => {
						const ageGroup = formatAgeIndex(value);
						return [ageGroup === 'No data' ? '0' : ageGroup, name];
					}} 
					wrapperStyle={{ fontSize: 24 }} 
				/>
				<Legend verticalAlign="top" align="right" iconType="plainline" wrapperStyle={{ fontSize: 24 }} />
				<Bar dataKey={maleKey} name="Male" fill="#3b82f6" radius={[2, 2, 0, 0]} />
				<Bar dataKey={femaleKey} name="Female" fill="#ef4444" radius={[2, 2, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
};
