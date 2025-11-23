import { useMutation } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useFetchSpecificExternalResource = (options = {}) => {
    return useMutation({
        mutationFn: async ({ api_resource_id, debug = false }) => {
            const data = await ApiService.ExternalResourceService.fetchSpecific(
                api_resource_id,
                debug
            );
            return data;
        },
        ...options,
    });
};
