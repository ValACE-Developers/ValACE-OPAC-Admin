import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useUpdateResourceStatus = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }) => {
            const data =
                await ApiService.ResourceService.updateResourceStatus(
                    id,
                    status
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
