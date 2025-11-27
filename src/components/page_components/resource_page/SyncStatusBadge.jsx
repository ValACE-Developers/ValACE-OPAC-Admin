/**
 * Author: Jerry Castrudes
 * Date: September 19, 2025
 * Description: Sync status badge component for displaying sync states
 * Version: 1.0.0
 * Last Updated: September 19, 2025
 */

import React from "react";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";

const SyncStatusBadge = ({ syncStatus = 'IDLE', className = '' }) => {
    const getStatusConfig = (status) => {
        switch (status?.toUpperCase()) {
            case 'SYNCING':
                return {
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700',
                    icon: <RefreshCw className="w-3 h-3 animate-spin" />,
                    label: 'Syncing'
                };
            case 'COMPLETED':
                return {
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-700',
                    icon: <CheckCircle className="w-3 h-3" />,
                    label: 'Completed'
                };
            case 'FAILED':
                return {
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-700',
                    icon: <XCircle className="w-3 h-3" />,
                    label: 'Failed'
                };
            case 'IDLE':
            default:
                return {
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-700',
                    icon: null,
                    label: 'Idle'
                };
        }
    };

    const config = getStatusConfig(syncStatus);

    return (
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.textColor} ${className}`}>
            {config.icon}
            {config.label}
        </span>
    );
};

export default SyncStatusBadge;