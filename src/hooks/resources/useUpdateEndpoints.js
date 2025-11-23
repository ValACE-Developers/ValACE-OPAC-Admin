import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useUpdateEndpoints = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }) => {
            const data = await ApiService.ResourceService.updateEndpoints(
                id,
                payload
            );
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["resources"]);
            if (variables?.id) {
                queryClient.invalidateQueries(["resource", variables.id]);
            }
        },
        ...options,
    });
};
