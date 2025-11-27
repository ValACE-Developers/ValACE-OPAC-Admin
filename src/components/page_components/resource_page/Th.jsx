const Th = ({ title, align = "left" }) => (
    <th
        className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}
    >
        {title}
    </th>
);

export default Th;
