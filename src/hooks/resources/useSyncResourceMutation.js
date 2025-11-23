/**
 * Author: Jerry Castrudes
 * Date: September 19, 2025
 * Description: React Query hooks for API resource synchronization
 * Version: 1.0.0
 * Last Updated: September 19, 2025
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncResource } from "../../api/ApiSyncService";

/**
 * Hook to sync all endpoints under a specific API resource
 */
export const useSyncResourceMutation = (options = {}) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (resourceId) => {
            const data = await syncResource(resourceId);
            return data;
        },
        onSuccess: (data, resourceId) => {
            // Invalidate resource queries to refresh status
            queryClient.invalidateQueries(["resources"]);
            queryClient.invalidateQueries(["resource", resourceId]);
            
            // Also invalidate any status queries
            queryClient.invalidateQueries(["resourceStatus", resourceId]);
        },
        ...options,
    });
};