import React from "react";
import LogEntry from "./LogEntry";

const LogContainer = ({
    logData,
    containerRef,
    isLoading,
    isFetching,
    type = "default",
}) => {
    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color)] mx-auto mb-4"></div>
                    <p>Loading logs...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="h-[calc(100vh-300px)] bg-gray-50 text-gray-800 p-4 rounded-md font-mono text-sm overflow-auto scroll-smooth border border-gray-200"
        >
            {typeof logData === "string" ? (
                logData && logData.trim().length > 0 ? (
                    logData
                        .split("\n")
                        .map((line, index) => (
                            <LogEntry
                                key={index}
                                line={line}
                                index={index}
                                type={type}
                            />
                        ))
                ) : (
                    <div className="text-gray-500 text-center py-8">
                        No logs
                    </div>
                )
            ) : Array.isArray(logData) && logData.length > 0 ? (
                logData.map((log, index) => (
                    <div
                        key={index}
                        className="mb-3 p-3 bg-gray-100 rounded border-l-4 border-gray-300"
                    >
                        <div className="flex items-start mb-2">
                            <span className="text-gray-400 mr-3 font-mono text-xs min-w-[3rem]">
                                {index + 1}
                            </span>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-sm text-gray-700">
                                        {log.level ||
                                            (type === "error"
                                                ? "ERROR"
                                                : "INFO")}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {log.timestamp ||
                                            log.created_at ||
                                            "No timestamp"}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-800 mb-1">
                                    {log.message ||
                                        log.log_message ||
                                        "No message"}
                                </div>
                                {log.context && (
                                    <div className="text-xs text-gray-600">
                                        <strong>Context:</strong>{" "}
                                        {JSON.stringify(log.context, null, 2)}
                                    </div>
                                )}
                                {log.stack && (
                                    <div className="text-xs text-gray-600 mt-1">
                                        <strong>Stack:</strong> {log.stack}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-gray-500 text-center py-8">No logs</div>
            )}
        </div>
    );
};

export default LogContainer;
