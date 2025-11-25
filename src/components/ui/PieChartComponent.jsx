import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const exampleData = [
	{ name: 'First Floor', value: 12, color: '#1f2937' }, // dark navy
	{ name: 'Second Floor', value: 12, color: '#3b82f6' }, // blue
	{ name: 'Third Floor', value: 12, color: '#10b981' }, // green
	{ name: 'Internet Access (IA)', value: 12, color: '#f59e0b' }, // amber
];

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		const color = payload[0].payload.color || '#3b82f6';
		return (
			<div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
				<div className="flex items-center gap-2 mb-1">
					<div 
						className="w-3 h-3 rounded-full" 
						style={{ backgroundColor: color }}
					/>
					<p className="font-semibold text-gray-900">{payload[0].name}</p>
				</div>
				<p className="text-sm text-gray-600">
					Value: <span className="font-medium text-[#00104A]">{payload[0].value}</span>
				</p>
			</div>
		);
	}
	return null;
};

export const PieChartComponent = ({ data, height = 500, innerRadius = 75, outerRadius = 150, centerLabel = 'Visitors' }) => {
	const chartData = Array.isArray(data) && data.length > 0 ? data : exampleData;
	const total = chartData.reduce((sum, item) => sum + (item.value || 0), 0);

	return (
		<div className="relative" style={{ height }}>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={chartData}
						dataKey="value"
						nameKey="name"
						innerRadius={innerRadius}
						outerRadius={outerRadius}
						paddingAngle={3}
						startAngle={90}
						endAngle={-270}
					>
						{chartData.map((entry, idx) => (
							<Cell 
								key={`cell-${idx}`} 
								fill={entry.color || '#3b82f6'}
								style={{ cursor: 'pointer' }}
							/>
						))}
					</Pie>
					<Tooltip content={<CustomTooltip />} />
				</PieChart>
			</ResponsiveContainer>
			{/* Center label overlay */}
			<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
				<p className="text-5xl font-bold text-[#00104A]">{total}</p>
				<p className="text-lg text-gray-600">{centerLabel}</p>
			</div>
		</div>
	);
};
