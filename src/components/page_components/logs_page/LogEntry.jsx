import React from "react";

const LogEntry = ({ line, index, type = "default" }) => {
    if (!line.trim()) return null;

    // Parse Laravel log format: [timestamp] level: message {json_data}
    const logMatch = line.match(
        /^\[([^\]]+)\]\s+(\w+)\.(\w+):\s+(.+?)(?:\s+(\{.*\}))?\s*$/
    );

    if (logMatch) {
        const [, timestamp, environment, level, message, jsonData] = logMatch;

        return (
            <div key={index} className="mb-2">
                <div className="flex items-start">
                    <span className="text-gray-400 mr-3 font-mono text-xs min-w-[3rem]">
                        {index + 1}
                    </span>
                    <span className="text-gray-500 mr-2">[{timestamp}]</span>
                    <span
                        className={`mr-2 px-2 py-1 rounded text-xs font-bold ${
                            level === "ERROR"
                                ? "bg-red-600 text-white"
                                : level === "WARNING"
                                ? "bg-yellow-600 text-white"
                                : level === "INFO"
                                ? "bg-blue-600 text-white"
                                : level === "NOTICE"
                                ? "bg-green-600 text-white"
                                : "bg-gray-600 text-white"
                        }`}
                    >
                        {environment}.{level}
                    </span>
                    <span className="text-gray-800 flex-1">{message}</span>
                </div>
                {jsonData && (
                    <div className="ml-11 mt-1">
                        <pre className="text-yellow-600 text-xs overflow-x-auto bg-yellow-50 p-2 rounded">
                            {JSON.stringify(JSON.parse(jsonData), null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        );
    }

    // If it doesn't match the expected format, just display as is
    return (
        <div key={index} className="mb-2">
            <div className="flex items-start">
                <span className="text-gray-400 mr-3 font-mono text-xs min-w-[3rem]">
                    {index + 1}
                </span>
                <span className="text-gray-800 flex-1">{line}</span>
            </div>
        </div>
    );
};

export default LogEntry;
