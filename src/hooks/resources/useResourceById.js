import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useResourceById = (id, options = {}) => {
    return useQuery({
        queryKey: ["resource", id],
        queryFn: async () => {
            const data = await ApiService.ResourceService.getResourceById(
                id
            );
            return data;
        },
        enabled: !!id,
        ...options,
    });
};
