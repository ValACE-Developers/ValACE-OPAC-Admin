/**
 * Author: Jerry Castrudes
 * Date: September 19, 2025
 * Description: React Query hooks for API endpoint status monitoring
 * Version: 1.0.0
 * Last Updated: September 19, 2025
 */

import { useQuery } from "@tanstack/react-query";
import { getEndpointStatus, getResourceStatus } from "../../api/ApiSyncService";

/**
 * Hook to get current sync status for an endpoint
 */
export const useEndpointStatusQuery = (endpointId, options = {}) => {
    return useQuery({
        queryKey: ["endpointStatus", endpointId],
        queryFn: async () => {
            const data = await getEndpointStatus(endpointId);
            return data;
        },
        enabled: !!endpointId,
        refetchInterval: (data) => {
            // Poll every 3 seconds if endpoint is syncing, otherwise every 30 seconds
            return data?.data?.sync_status === 'SYNCING' ? 3000 : 30000;
        },
        ...options,
    });
};

/**
 * Hook to get current sync status for a resource and all its endpoints
 */
export const useResourceStatusQuery = (resourceId, options = {}) => {
    return useQuery({
        queryKey: ["resourceStatus", resourceId],
        queryFn: async () => {
            const data = await getResourceStatus(resourceId);
            return data;
        },
        enabled: !!resourceId,
        refetchInterval: (data) => {
            // Check if any endpoint is syncing
            const hasActiveSyncEndpoints = data?.data?.endpoints?.some(
                endpoint => endpoint.sync_status === 'SYNCING'
            );
            // Poll every 3 seconds if any endpoint is syncing, otherwise every 30 seconds
            return hasActiveSyncEndpoints ? 3000 : 30000;
        },
        ...options,
    });
};