import { useState, useEffect, useRef, useMemo } from "react";
import { Send, Upload, ChevronUp, ChevronDown } from "lucide-react";
import { EntriesDropdown } from "../components/ui/EntriesDropdown";
import { Pagination } from "../components/ui/Pagination";
import { Header } from "../components/layout/Header";
import { useSurveyData, useExportSurveyData, useEmailSurveyData } from "../hooks/reports";

export const ReportsPage = () => {
    const [location, setLocation] = useState("All");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(20);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [emailAddress, setEmailAddress] = useState("");
    const [emailFormat, setEmailFormat] = useState("CSV");
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Location options
    const locationOptions = [
        { value: "All", label: "All Locations" },
        { value: "outside", label: "Outside" },
        { value: "1st_floor", label: "1st Floor" },
        { value: "2nd_floor", label: "2nd Floor" },
        { value: "3rd_floor", label: "3rd Floor" },
    ];

    // Build query params
    const queryParams = useMemo(() => {
        const params = {
            page,
            per_page: entriesPerPage,
        };

        if (location !== "All") params.location = location;
        if (fromDate) params.date_from = fromDate;
        if (toDate) params.date_to = toDate;
        if (sortColumn) {
            params.sort_by = sortColumn;
            params.sort_order = sortDirection;
        }

        return params;
    }, [location, fromDate, toDate, page, entriesPerPage, sortColumn, sortDirection]);

    // Fetch survey data using React Query
    const { data: surveyResponse, isLoading, error } = useSurveyData(queryParams, {
        keepPreviousData: true,
    });

    // Export mutation
    const exportMutation = useExportSurveyData({
        onError: (error) => {
            alert(error.message || "Export failed");
        },
    });

    // Email mutation
    const emailMutation = useEmailSurveyData({
        onSuccess: (data) => {
            alert(`Report sent successfully to ${emailAddress}`);
            setEmailAddress("");
            setShowEmailModal(false);
        },
        onError: (error) => {
            console.log(error);
            alert(error.message || "Email sending failed");
        },
    });

    // Extract data from response
    const reportData = surveyResponse?.data?.data || [];
    const totalData = surveyResponse?.data?.total || 0;
    const paginationData = surveyResponse?.data ? {
        currentPage: surveyResponse.data.current_page || 1,
        lastPage: surveyResponse.data.last_page || 1,
        from: ((surveyResponse.data.current_page || 1) - 1) * (surveyResponse.data.per_page || entriesPerPage) + 1,
        to: Math.min((surveyResponse.data.current_page || 1) * (surveyResponse.data.per_page || entriesPerPage), surveyResponse.data.total || 0),
        total: surveyResponse.data.total || 0
    } : null;

    // Handle export functionality
    const handleExport = (format) => {
        const params = {
            format: format,
        };

        if (location !== "All") params.location = location;
        if (fromDate) params.date_from = fromDate;
        if (toDate) params.date_to = toDate;

        exportMutation.mutate(params);
    };

    // Handle email report functionality
    const handleEmailReport = () => {
        if (!emailAddress) {
            alert("Please enter an email address");
            return;
        }

        const params = {
            file_type: emailFormat,
            email: emailAddress,
        };

        if (location !== "All") params.location = location;
        if (fromDate) params.date_from = fromDate;
        if (toDate) params.date_to = toDate;

        emailMutation.mutate(params);
    };

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowExportDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle entries per page change
    const handleEntriesChange = (newEntriesPerPage) => {
        setEntriesPerPage(newEntriesPerPage);
        setPage(1);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSort = (column) => {
        let newColumn = column;
        let newDirection = "asc";

        if (sortColumn === column) {
            if (sortDirection === "asc") {
                newDirection = "desc";
            } else if (sortDirection === "desc") {
                // Third click - reset to default
                newColumn = null;
                newDirection = "asc";
            }
        }

        setSortColumn(newColumn);
        setSortDirection(newDirection);
        setPage(1);
    };

    const SortableHeader = ({ column, children }) => (
        <th className="px-4 py-3 text-left text-sm font-semibold text-white">
            <button
                onClick={() => handleSort(column)}
                className="flex items-center gap-2 hover:text-gray-200 transition"
            >
                {children}
                <div className="flex flex-col">
                    <ChevronUp
                        className={`w-4 h-4 -mb-1 ${sortColumn === column && sortDirection === "asc"
                            ? "text-white"
                            : "text-white/40"
                            }`}
                    />
                    <ChevronDown
                        className={`w-4 h-4 ${sortColumn === column && sortDirection === "desc"
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
                <Header
                    title="Reports"
                    description="View an overview of reports based on selected filters."
                />

                {/* Filters and Actions */}
                <div>
                    <div className="flex items-center justify-between w-full mb-6">
                        {/* Location Filter */}
                        <div className="flex gap-2">
                            <label className="text-base font-medium text-[var(--main-color)]">
                                Location :
                            </label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="border-2 border-[var(--main-color)] rounded-lg px-4 py-2 focus:outline-none text-[var(--main-color)]"
                            >
                                {locationOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 justify-end">
                            {/* Send Report Modal Trigger */}
                            <button 
                                onClick={() => setShowEmailModal(true)}
                                className="flex items-center gap-2 px-6 py-2 border-2 border-[var(--main-color)] text-[var(--main-color)] rounded-lg hover:bg-[var(--main-color)] hover:text-white transition"
                                disabled={isLoading || exportMutation.isLoading || emailMutation.isLoading}
                            >
                                <Send className="w-4 h-4" />
                                <span>Send Report</span>
                            </button>
                            {/* Export Dropdown */}
                            <div className="relative inline-block text-left" ref={dropdownRef}>
                                <div>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowExportDropdown(!showExportDropdown)}
                                        className="flex items-center gap-2 px-6 py-2 bg-[var(--main-color)] text-white rounded-lg hover:bg-[var(--main-color)]/90 transition"
                                        disabled={isLoading || exportMutation.isLoading || emailMutation.isLoading}
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>Export</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                                {showExportDropdown && (
                                    <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <button
                                                onClick={() => { handleExport('CSV'); setShowExportDropdown(false); }}
                                                className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                                                disabled={exportMutation.isLoading}
                                            >
                                                CSV
                                            </button>
                                            <button
                                                onClick={() => { handleExport('PDF'); setShowExportDropdown(false); }}
                                                className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                                                disabled={exportMutation.isLoading}
                                            >
                                                PDF
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
                        {error.message || "An error occurred"}
                    </div>
                )}


                {/* Data Table */}
                <div>
                    {/* Table Header with Entries Dropdown */}
                    <div className="py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            {paginationData 
                                ? `Showing ${paginationData.from || 0} to ${paginationData.to || 0} of ${paginationData.total || 0} entries`
                                : `Showing ${reportData.length > 0 ? (page - 1) * entriesPerPage + 1 : 0} to ${Math.min(page * entriesPerPage, totalData)} of ${totalData} entries`
                            }
                        </div>
                        <EntriesDropdown
                            entriesPerPage={entriesPerPage}
                            setEntriesPerPage={handleEntriesChange}
                            setPage={setPage}
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-[var(--main-color)]">
                                <tr>
                                    <SortableHeader column="created_at">Date Time</SortableHeader>
                                    <SortableHeader column="age">Age</SortableHeader>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                                        Gender
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                                        Location
                                    </th>
                                    <th className="px-3 py-3 text-center text-sm font-semibold text-white w-20">
                                        VCL
                                    </th>
                                    <th className="px-3 py-3 text-center text-sm font-semibold text-white w-20">
                                        Books
                                    </th>
                                    <th className="px-3 py-3 text-center text-sm font-semibold text-white w-20">
                                        NLP
                                    </th>
                                    <th className="px-3 py-3 text-center text-sm font-semibold text-white w-20">
                                        DOST
                                    </th>
                                    <th className="px-3 py-3 text-center text-sm font-semibold text-white w-20">
                                        Read
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-32 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color)]"></div>
                                                <p className="text-lg text-gray-600 mt-4">Loading...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : reportData.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-32 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-2xl text-gray-400 font-kulim-park italic">
                                                    No data found for the selected filters
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    reportData.map((row, index) => (
                                        <tr key={row.survey_id || index} className={`transition ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/90'} hover:bg-gray-200`}>
                                            <td className="px-4 py-3 text-sm font-medium text-[var(--main-color)]">
                                                {new Date(row.date).toLocaleString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'short', 
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-[var(--main-color)]">
                                                {row.age}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-[var(--main-color)]">
                                                {row.gender}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-[var(--main-color)]">
                                                {row.location}
                                            </td>
                                            <td className="px-3 py-3 text-sm text-center font-semibold" title="VCL Resource">
                                                <span className={`px-2 py-1 rounded ${(row.visited_resources?.vcl_resource || 0) > 0 ? 'bg-green-100 text-green-800' : 'text-gray-400'}`}>
                                                    {row.visited_resources?.vcl_resource || 0}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-sm text-center font-semibold" title="Featured Books">
                                                <span className={`px-2 py-1 rounded ${(row.visited_resources?.featured_books || 0) > 0 ? 'bg-green-100 text-green-800' : 'text-gray-400'}`}>
                                                    {row.visited_resources?.featured_books || 0}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-sm text-center font-semibold" title="NLP Resource">
                                                <span className={`px-2 py-1 rounded ${(row.visited_resources?.nlp_resource || 0) > 0 ? 'bg-green-100 text-green-800' : 'text-gray-400'}`}>
                                                    {row.visited_resources?.nlp_resource || 0}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-sm text-center font-semibold" title="DOST Resource">
                                                <span className={`px-2 py-1 rounded ${(row.visited_resources?.dost_resource || 0) > 0 ? 'bg-green-100 text-green-800' : 'text-gray-400'}`}>
                                                    {row.visited_resources?.dost_resource || 0}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-sm text-center font-semibold" title="Let's Read Resource">
                                                <span className={`px-2 py-1 rounded ${(row.visited_resources?.lets_read_resource || 0) > 0 ? 'bg-green-100 text-green-800' : 'text-gray-400'}`}>
                                                    {row.visited_resources?.lets_read_resource || 0}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {reportData.length > 0 && (
                        <Pagination
                            page={page}
                            setPage={handlePageChange}
                            total={totalData}
                            entriesPerPage={entriesPerPage}
                            paginationData={paginationData}
                        />
                    )}
                </div>
            </div>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Send Report via Email</h3>
                            <button 
                                onClick={() => setShowEmailModal(false)}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="Enter email address" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent" 
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    File Format
                                </label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                                    value={emailFormat}
                                    onChange={(e) => setEmailFormat(e.target.value)}
                                >
                                    <option value="CSV">CSV</option>
                                    <option value="PDF">PDF</option>
                                    <option value="BOTH">Both (CSV & PDF)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button 
                                onClick={() => setShowEmailModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleEmailReport}
                                disabled={emailMutation.isLoading || !emailAddress}
                                className="px-4 py-2 bg-[var(--main-color)] text-white rounded-md hover:bg-[var(--main-color)]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {emailMutation.isLoading ? "Sending..." : "Send Report"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};