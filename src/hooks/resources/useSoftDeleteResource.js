import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useSoftDeleteResource = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const data = await ApiService.ResourceService.softDeleteResource(
                id
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["resources"]);
        },
        ...options,
    });
};
