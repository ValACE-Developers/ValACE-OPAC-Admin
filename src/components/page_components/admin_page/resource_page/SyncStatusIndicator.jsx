import React from 'react';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

const SyncStatusIndicator = ({ 
    syncStatus, 
    isRealtime = false, 
    className = "" 
}) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'SYNCING':
                return {
                    icon: RefreshCw,
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-100',
                    text: 'Syncing',
                    animate: true
                };
            case 'COMPLETED':
                return {
                    icon: CheckCircle,
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                    text: 'Completed',
                    animate: false
                };
            case 'FAILED':
                return {
                    icon: XCircle,
                    color: 'text-red-600',
                    bgColor: 'bg-red-100',
                    text: 'Failed',
                    animate: false
                };
            case 'IDLE':
            default:
                return {
                    icon: Clock,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    text: 'Idle',
                    animate: false
                };
        }
    };

    const config = getStatusConfig(syncStatus);
    const IconComponent = config.icon;

    return (
        <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} ${className}`}>
            <IconComponent 
                className={`w-3 h-3 ${config.animate ? 'animate-spin' : ''}`} 
            />
            <span>{config.text}</span>
            {isRealtime && (
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" title="Real-time updates" />
            )}
        </div>
    );
};

export default SyncStatusIndicator;
