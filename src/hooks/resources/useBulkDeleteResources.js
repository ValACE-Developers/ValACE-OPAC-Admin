import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useBulkDeleteResources = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            const data =
                await ApiService.ResourceService.deleteMultipleResources(
                    ids
                );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["resources"]);
        },
        ...options,
    });
};
