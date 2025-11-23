import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useResourcesList = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: ["resources", filters],
        queryFn: async () => {
            const data =
                await ApiService.ResourceService.getActiveApiResources(
                    filters
                );
            return data;
        },
        ...options,
    });
};
