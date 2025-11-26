import { useState } from "react";
import { RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import LogContainer from "./LogContainer";
import { useClearLaravelLog, useClearInfoLog, useClearErrorLog } from "../../../../hooks/system-logs/useClearLogs";

const LogTab = ({
    title,
    description,
    data,
    isLoading,
    isFetching,
    error,
    onRefresh,
    containerRef,
    type = "default",
}) => {
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    
    // Clear log mutations based on type
    const clearLaravelLog = useClearLaravelLog();
    const clearInfoLog = useClearInfoLog();
    const clearErrorLog = useClearErrorLog();
    
    const getClearMutation = () => {
        switch (type) {
            case "system":
                return clearLaravelLog;
            case "success-info":
                return clearInfoLog;
            case "error":
                return clearErrorLog;
            default:
                return null;
        }
    };
    
    const clearMutation = getClearMutation();
    
    const handleClearLog = () => {
        if (clearMutation) {
            clearMutation.mutate();
            setShowClearConfirm(false);
        }
    };
    
    const hasLogs = data && data.trim().length > 0;
    return (
        <div className="space-y-4">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isLoading || isFetching
                                ? "bg-yellow-600 text-white"
                                : "bg-green-600 text-white"
                        }`}
                    >
                        {isLoading || isFetching ? "Connecting" : "Connected"}
                    </span>
                    
                    {/* Clear Log Button */}
                    {clearMutation && hasLogs && (
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50 flex items-center gap-2"
                            onClick={() => setShowClearConfirm(true)}
                            disabled={clearMutation.isPending}
                        >
                            {clearMutation.isPending ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Clearing...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    <span>Clear Logs</span>
                                </>
                            )}
                        </button>
                    )}
                    
                    <button
                        className="bg-[var(--main-color)] hover:bg-[var(--main-color)] text-white px-4 py-2 rounded-md disabled:opacity-50"
                        onClick={onRefresh}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="flex items-center gap-2">
                                <span>Refreshing...</span>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Refresh</span>
                                <RefreshCw className="w-4 h-4" />
                            </div>
                        )}
                    </button>
                </div>
            </header>

            {/* Error Display */}
            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    <strong>Error:</strong> {error.message}
                </div>
            )}
            
            {/* Clear Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Clear {title}?
                            </h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            This action will permanently clear all {title.toLowerCase()}. This cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                                onClick={() => setShowClearConfirm(false)}
                                disabled={clearMutation?.isPending}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
                                onClick={handleClearLog}
                                disabled={clearMutation?.isPending}
                            >
                                {clearMutation?.isPending ? "Clearing..." : "Clear Logs"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logs Container */}
            <LogContainer
                logData={data}
                containerRef={containerRef}
                isLoading={isLoading}
                isFetching={isFetching}
                type={type}
            />
        </div>
    );
};

export default LogTab;
