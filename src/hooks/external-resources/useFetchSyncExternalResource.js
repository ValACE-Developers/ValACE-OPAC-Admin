import { useMutation } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useFetchSyncExternalResource = (options = {}) => {
    return useMutation({
        mutationFn: async ({ api_resource_id, debug = false }) => {
            const data = await ApiService.ExternalResourceService.fetchSync(
                api_resource_id,
                debug
            );
            return data;
        },
        ...options,
    });
};
