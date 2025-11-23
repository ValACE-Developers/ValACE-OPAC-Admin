import { useMutation } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useFetchAllExternalResources = (options = {}) => {
    return useMutation({
        mutationFn: async (debug = false) => {
            const data =
                await ApiService.ExternalResourceService.fetchAllChunked(debug);
            return data;
        },
        ...options,
    });
};
