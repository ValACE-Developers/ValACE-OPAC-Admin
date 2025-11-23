import { useState, useCallback } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export const useNotification = () => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((type, message, duration = 5000) => {
        const id = Date.now();
        const notification = { id, type, message };

        setNotifications((prev) => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const success = useCallback(
        (message, duration) => addNotification("success", message, duration),
        [addNotification]
    );
    const error = useCallback(
        (message, duration) => addNotification("error", message, duration),
        [addNotification]
    );
    const info = useCallback(
        (message, duration) => addNotification("info", message, duration),
        [addNotification]
    );
    const warning = useCallback(
        (message, duration) => addNotification("warning", message, duration),
        [addNotification]
    );

    return {
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        info,
        warning,
    };
};

export const NotificationContainer = ({
    notifications,
    removeNotification,
}) => {
    if (notifications.length === 0) return null;

    return (
        <div className="w-[350px]  fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`max-w-sm w-full bg-white shadow-md rounded-lg pointer-events-auto ring-1 ring-[var(--main-color)]/20 ring-opacity-5 overflow-hidden ${
                        notification.type === "success"
                            ? "border-l-4 border-green-400"
                            : notification.type === "error"
                            ? "border-l-4 border-red-400"
                            : notification.type === "warning"
                            ? "border-l-4 border-yellow-400"
                            : "border-l-4 border-blue-400"
                    } `}
                >
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {notification.type === "success" && (
                                    <CheckCircle className="h-6 w-6 text-green-400" />
                                )}
                                {notification.type === "error" && (
                                    <AlertCircle className="h-6 w-6 text-red-400" />
                                )}
                                {notification.type === "warning" && (
                                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                                )}
                                {notification.type === "info" && (
                                    <Info className="h-6 w-6 text-blue-400" />
                                )}
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-gray-900">
                                    {notification.message}
                                </p>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button
                                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-color)]"
                                    onClick={() =>
                                        removeNotification(notification.id)
                                    }
                                >
                                    <span className="sr-only">Close</span>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
