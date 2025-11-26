import { useState, useRef, useEffect } from "react";
import { useLaravelLogs } from "../hooks/system-logs/useLaravelLogs";
import { useSuccessInfoLogs } from "../hooks/system-logs/useSuccessInfoLogs";
import { useErrorLogs } from "../hooks/system-logs/useErrorLogs";
import { useClearAllLogs } from "../hooks/system-logs/useClearLogs";
import { FileText, AlertCircle, CheckCircle, Clock, Trash2, AlertTriangle } from "lucide-react";
import Header from "../components/layout/Header";
import { LogTab } from "../components/page_components/admin_page/logs_page/index";

export const LogsPage = () => {
    const [activeTab, setActiveTab] = useState("system");
    const [autoFetchEnabled, setAutoFetchEnabled] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(5); // Default 5 seconds
    const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

    const {
        data: logsData,
        isLoading: logsLoading,
        isFetching: logsFetching,
        error: logsError,
        refetch: refetchLogs,
    } = useLaravelLogs({
        refetchInterval: autoFetchEnabled ? refreshInterval * 1000 : false,
    });
    const {
        data: successInfoData,
        isLoading: successInfoLoading,
        isFetching: successInfoFetching,
        error: successInfoError,
        refetch: refetchSuccessInfo,
    } = useSuccessInfoLogs({
        refetchInterval: autoFetchEnabled ? refreshInterval * 1000 : false,
    });
    const {
        data: errorData,
        isLoading: errorLoading,
        isFetching: errorFetching,
        error: errorError,
        refetch: refetchErrors,
    } = useErrorLogs({
        refetchInterval: autoFetchEnabled ? refreshInterval * 1000 : false,
    });
    
    const clearAllLogs = useClearAllLogs();
    const logsContainerRef = useRef(null);
    const successInfoContainerRef = useRef(null);
    const errorContainerRef = useRef(null);

    // Toggle auto-fetch function
    const toggleAutoFetch = () => {
        setAutoFetchEnabled(!autoFetchEnabled);
    };

    // Handle interval change
    const handleIntervalChange = (newInterval) => {
        setRefreshInterval(newInterval);
    };
    
    // Handle clear all logs
    const handleClearAllLogs = () => {
        clearAllLogs.mutate();
        setShowClearAllConfirm(false);
    };
    
    // Check if any logs have content
    const hasAnyLogs = (logsData && logsData.trim().length > 0) || 
                      (successInfoData && successInfoData.trim().length > 0) || 
                      (errorData && errorData.trim().length > 0);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (logsData && logsContainerRef.current) {
            logsContainerRef.current.scrollTop =
                logsContainerRef.current.scrollHeight;
        }
    }, [logsData]);

    useEffect(() => {
        if (successInfoData && successInfoContainerRef.current) {
            successInfoContainerRef.current.scrollTop =
                successInfoContainerRef.current.scrollHeight;
        }
    }, [successInfoData]);

    useEffect(() => {
        if (errorData && errorContainerRef.current) {
            errorContainerRef.current.scrollTop =
                errorContainerRef.current.scrollHeight;
        }
    }, [errorData]);

    const tabs = [
        {
            id: "system",
            label: "System / Framework Logs",
            icon: <FileText className="w-4 h-4" />,
            description: "Laravel default logs with real-time monitoring",
            content: (
                <LogTab
                    title="System Logs"
                    description="Real-time monitoring of system logs"
                    data={logsData}
                    isLoading={logsLoading}
                    isFetching={logsFetching}
                    error={logsError}
                    onRefresh={refetchLogs}
                    containerRef={logsContainerRef}
                    type="system"
                />
            ),
        },
        {
            id: "info",
            label: "Application Info Logs",
            icon: <CheckCircle className="w-4 h-4" />,
            description: "Success and information logs from the application",
            content: (
                <LogTab
                    title="Application Info Logs"
                    description="Success and information logs of the application"
                    data={successInfoData}
                    isLoading={successInfoLoading}
                    isFetching={successInfoFetching}
                    error={successInfoError}
                    onRefresh={refetchSuccessInfo}
                    containerRef={successInfoContainerRef}
                    type="success-info"
                />
            ),
        },
        {
            id: "error",
            label: "Application Error Logs",
            icon: <AlertCircle className="w-4 h-4" />,
            description: "Error logs from the application",
            content: (
                <LogTab
                    title="Application Error Logs"
                    description="Error logs of the application"
                    data={errorData}
                    isLoading={errorLoading}
                    isFetching={errorFetching}
                    error={errorError}
                    onRefresh={refetchErrors}
                    containerRef={errorContainerRef}
                    type="error"
                />
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="w-full">
                {/* Page Header */}
                <Header
                    title="System Logs"
                    description="Monitor system logs, application info, and error logs in real-time"
                />

                {/* Auto-fetch Controls */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Auto-refresh:
                                </span>
                                <button
                                    onClick={toggleAutoFetch}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2 ${
                                        autoFetchEnabled
                                            ? "bg-[var(--main-color)]"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                            autoFetchEnabled
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                                <span className="text-sm text-gray-500">
                                    {autoFetchEnabled ? "Enabled" : "Disabled"}
                                </span>
                            </div>
                            
                            {/* Clear All Logs Button */}
                            {hasAnyLogs && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setShowClearAllConfirm(true)}
                                        disabled={clearAllLogs.isPending}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50 flex items-center gap-2 transition-colors"
                                    >
                                        {clearAllLogs.isPending ? (
                                            <>
                                                <Clock className="w-4 h-4 animate-spin" />
                                                <span>Clearing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                <span>Clear All Logs</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                            
                            {autoFetchEnabled && (
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">Interval:</span>
                                    <select
                                        value={refreshInterval}
                                        onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
                                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent"
                                    >
                                        <option value={1}>1 second</option>
                                        <option value={2}>2 seconds</option>
                                        <option value={3}>3 seconds</option>
                                        <option value={5}>5 seconds</option>
                                        <option value={10}>10 seconds</option>
                                        <option value={15}>15 seconds</option>
                                        <option value={30}>30 seconds</option>
                                        <option value={60}>1 minute</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        
                        <div className="text-sm text-gray-500">
                            {autoFetchEnabled 
                                ? `Refreshing every ${refreshInterval} ${refreshInterval === 1 ? 'second' : 'seconds'}`
                                : "Auto-refresh disabled"
                            }
                        </div>
                    </div>
                </div>

                {/* Clear All Confirmation Modal */}
                {showClearAllConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Clear All Logs?
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                This action will permanently clear all system, info, and error logs. This cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                                    onClick={() => setShowClearAllConfirm(false)}
                                    disabled={clearAllLogs.isPending}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
                                    onClick={handleClearAllLogs}
                                    disabled={clearAllLogs.isPending}
                                >
                                    {clearAllLogs.isPending ? "Clearing..." : "Clear All Logs"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                                        activeTab === tab.id
                                            ? "border-[var(--main-color)] text-[var(--main-color)]"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {tabs.find((tab) => tab.id === activeTab)?.content}
                    </div>
                </div>
            </div>
        </div>
    );
};
