import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const exampleData = [
	{ name: 'First Floor', value: 12, color: '#1f2937' }, // dark navy
	{ name: 'Second Floor', value: 12, color: '#3b82f6' }, // blue
	{ name: 'Third Floor', value: 12, color: '#10b981' }, // green
	{ name: 'Internet Access (IA)', value: 12, color: '#f59e0b' }, // amber
];

export const PieChartComponent = ({ data, height = 280, innerRadius = 60, outerRadius = 80, centerLabel = 'Visitors' }) => {
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
							<Cell key={`cell-${idx}`} fill={entry.color || '#3b82f6'} />
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
			{/* Center label overlay */}
			<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
				<p className="text-3xl font-bold text-[#00104A]">{total}</p>
				<p className="text-sm text-gray-600">{centerLabel}</p>
			</div>
		</div>
	);
};
