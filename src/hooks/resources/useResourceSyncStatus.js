import { useQuery } from "@tanstack/react-query";
import { getResourceStatus } from "../../api/ApiSyncService";

/**
 * Hook to get real-time sync status for a resource and its endpoints
 * This will poll the status endpoint to get live updates
 */
export const useResourceSyncStatus = (resourceId, options = {}) => {
    return useQuery({
        queryKey: ["resourceSyncStatus", resourceId],
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
            // Poll every 2 seconds if any endpoint is syncing, otherwise every 30 seconds
            return hasActiveSyncEndpoints ? 2000 : 30000;
        },
        ...options,
    });
};
