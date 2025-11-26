import { useState } from "react";
import { Send, Upload, ChevronUp, ChevronDown } from "lucide-react";
import { EntriesDropdown } from "../components/ui/EntriesDropdown";

// NOTE: THIS IS UI ONLY
// TO DO: Correct Data, Correct Filter
export const ReportsPage = () => {
    const [category, setCategory] = useState("All");
    const [fromDate, setFromDate] = useState("2025-06-01");
    const [toDate, setToDate] = useState("2025-06-15");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [isFiltered, setIsFiltered] = useState(false);

    // Sample data - replace with actual API data
    const allReportData = [
        {
            date: "2025-06-01",
            male: 45,
            female: 38,
            age: "18-25",
            category: "Fiction",
            location: "Main Library",
            total: 83
        },
        {
            date: "2025-06-02",
            male: 32,
            female: 41,
            age: "26-35",
            category: "Non-Fiction",
            location: "Branch A",
            total: 73
        },
        {
            date: "2025-06-03",
            male: 28,
            female: 35,
            age: "18-25",
            category: "Science",
            location: "Main Library",
            total: 63
        },
        {
            date: "2025-06-04",
            male: 51,
            female: 47,
            age: "36-45",
            category: "Technology",
            location: "Branch B",
            total: 98
        },
        {
            date: "2025-06-05",
            male: 39,
            female: 44,
            age: "26-35",
            category: "History",
            location: "Main Library",
            total: 83
        },
        {
            date: "2025-06-06",
            male: 25,
            female: 30,
            age: "18-25",
            category: "Fiction",
            location: "Branch A",
            total: 55
        },
        {
            date: "2025-06-07",
            male: 42,
            female: 38,
            age: "46-60",
            category: "Biography",
            location: "Main Library",
            total: 80
        },
        {
            date: "2025-06-08",
            male: 37,
            female: 45,
            age: "26-35",
            category: "Science",
            location: "Branch B",
            total: 82
        },
        {
            date: "2025-06-09",
            male: 48,
            female: 52,
            age: "36-45",
            category: "Technology",
            location: "Main Library",
            total: 100
        },
        {
            date: "2025-06-10",
            male: 33,
            female: 29,
            age: "18-25",
            category: "Fiction",
            location: "Branch A",
            total: 62
        },
        {
            date: "2025-06-11",
            male: 41,
            female: 46,
            age: "26-35",
            category: "Non-Fiction",
            location: "Branch B",
            total: 87
        },
        {
            date: "2025-06-12",
            male: 29,
            female: 34,
            age: "18-25",
            category: "History",
            location: "Main Library",
            total: 63
        },
        {
            date: "2025-06-13",
            male: 46,
            female: 41,
            age: "46-60",
            category: "Biography",
            location: "Branch A",
            total: 87
        },
        {
            date: "2025-06-14",
            male: 35,
            female: 40,
            age: "36-45",
            category: "Science",
            location: "Main Library",
            total: 75
        },
        {
            date: "2025-06-15",
            male: 44,
            female: 48,
            age: "26-35",
            category: "Technology",
            location: "Branch B",
            total: 92
        }
    ];
    
    const [reportData, setReportData] = useState([]);
    const totalData = reportData.length;

    const handleFilter = () => {
        // Filter logic
        let filtered = [...allReportData];
        
        // Filter by category
        if (category !== "All") {
            filtered = filtered.filter(item => item.category === category);
        }
        
        // Filter by date range
        if (fromDate) {
            filtered = filtered.filter(item => item.date >= fromDate);
        }
        if (toDate) {
            filtered = filtered.filter(item => item.date <= toDate);
        }
        
        setReportData(filtered);
        setIsFiltered(true);
        setPage(1);
        console.log("Filtering data:", { category, fromDate, toDate });
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const SortableHeader = ({ column, children }) => (
        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
            <button
                onClick={() => handleSort(column)}
                className="flex items-center gap-2 hover:text-gray-200 transition"
            >
                {children}
                <div className="flex flex-col">
                    <ChevronUp
                        className={`w-6 h-6 -mb-1 ${sortColumn === column && sortDirection === "asc"
                            ? "text-white"
                            : "text-white/40"
                            }`}
                    />
                    <ChevronDown
                        className={`w-6 h-6 ${sortColumn === column && sortDirection === "desc"
                            ? "text-white"
                            : "text-white/40"
                            }`}
                    />
                </div>
            </button>
        </th>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto space-y-6">
                {/* Breadcrumb */}
                {/* <Breadcrumb items={[{ label: "Report", isCurrent: true }]} /> */}

                {/* Header */}
                <header className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-5xl font-khula font-bold text-[var(--main-color)] mb-2">
                                Reports
                            </h1>
                            <p className="text-lg font-kulim-park text-gray-600">
                                View an overview of reports based on selected filters.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Filters and Actions */}
                <div>
                    <div className="flex items-center justify-between w-full mb-6">
                        {/* Category Filter */}
                        <div className="flex gap-2">
                            <label className="text-base font-medium text-[var(--main-color)]">
                                Category :
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="border-2 border-[var(--main-color)] rounded-lg px-4 py-2 focus:outline-none text-[var(--main-color)]"
                            >
                                <option value="All">All</option>
                                <option value="Books">Books</option>
                                <option value="Users">Users</option>
                                <option value="Transactions">Transactions</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 justify-end">
                            <button className="flex items-center gap-2 px-6 py-2 border-2 border-[var(--main-color)] text-[var(--main-color)] rounded-lg hover:bg-[var(--main-color)] hover:text-white transition">
                                <Send className="w-4 h-4" />
                                <span>Send Report</span>
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 bg-[var(--main-color)] text-white rounded-lg hover:bg-[var(--main-color)]/90 transition">
                                <Upload className="w-4 h-4" />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* From Date */}
                        <div className="flex gap-2">
                            <label className="text-base font-medium text-[var(--main-color)]">
                                From :
                            </label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border-2 border-[var(--main-color)] rounded-lg px-4 py-2 focus:outline-none text-[var(--main-color)]"
                            />
                        </div>

                        {/* To Date */}
                        <div className="flex gap-2">
                            <label className="text-base font-medium text-[var(--main-color)]">
                                To :
                            </label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border-2 border-[var(--main-color)] rounded-lg px-4 py-2 focus:outline-none text-[var(--main-color)]"
                            />
                        </div>

                        {/* Filter Button */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleFilter}
                                className="bg-[var(--main-color)] text-white px-6 py-2 rounded-lg hover:bg-[var(--main-color)]/90 transition font-medium"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div>
                    {/* Table Header with Entries Dropdown */}
                    <div className="py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            Showing {reportData.length > 0 ? (page - 1) * entriesPerPage + 1 : 0} to{" "}
                            {Math.min(page * entriesPerPage, totalData)} total data
                        </div>
                        <EntriesDropdown
                            entriesPerPage={entriesPerPage}
                            setEntriesPerPage={setEntriesPerPage}
                            setPage={setPage}
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-[var(--main-color)]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                                        Male
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                                        Female
                                    </th>
                                    <SortableHeader column="age">Age</SortableHeader>
                                    <SortableHeader column="category">Category</SortableHeader>
                                    <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                                        Location
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-32 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-2xl text-gray-400 font-kulim-park italic">
                                                    Select filter to see data
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    reportData
                                        .slice((page - 1) * entriesPerPage, page * entriesPerPage)
                                        .map((row, index) => (
                                            <tr key={index} className={`transition ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/90'} hover:bg-gray-200`}>
                                                <td className="px-6 py-4 text-lg font-medium text-[var(--main-color)]">
                                                    {row.date}
                                                </td>
                                                <td className="px-6 py-4 text-lg font-medium text-[var(--main-color)]">
                                                    {row.male}
                                                </td>
                                                <td className="px-6 py-4 text-lg font-medium text-[var(--main-color)]">
                                                    {row.female}
                                                </td>
                                                <td className="px-6 py-4 text-lg font-medium text-[var(--main-color)]">
                                                    {row.age}
                                                </td>
                                                <td className="px-6 py-4 text-lg font-medium text-[var(--main-color)]">
                                                    {row.category}
                                                </td>
                                                <td className="px-6 py-4 text-lg font-medium text-[var(--main-color)]">
                                                    {row.location}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-[var(--main-color)] font-semibold">
                                                    {row.total}
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};