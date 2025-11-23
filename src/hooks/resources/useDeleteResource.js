import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useDeleteResource = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const data = await ApiService.ResourceService.deleteResource(id);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["resources"]);
        },
        ...options,
    });
};
