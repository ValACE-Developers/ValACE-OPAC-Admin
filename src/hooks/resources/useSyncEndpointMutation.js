/**
 * Author: Jerry Castrudes
 * Date: September 19, 2025
 * Description: React Query hooks for API endpoint synchronization
 * Version: 1.0.0
 * Last Updated: September 19, 2025
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncEndpoint } from "../../api/ApiSyncService";

/**
 * Hook to sync a single API endpoint
 */
export const useSyncEndpointMutation = (options = {}) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (endpointId) => {
            const data = await syncEndpoint(endpointId);
            return data;
        },
        onSuccess: (data, endpointId) => {
            // Invalidate resource queries to refresh status
            queryClient.invalidateQueries(["resources"]);
            
            // Also invalidate endpoint status queries
            queryClient.invalidateQueries(["endpointStatus", endpointId]);
            
            // If we know the resource ID from the response, invalidate it too
            if (data?.data?.api_resource_id) {
                queryClient.invalidateQueries(["resource", data.data.api_resource_id]);
                queryClient.invalidateQueries(["resourceStatus", data.data.api_resource_id]);
            }
        },
        ...options,
    });
};