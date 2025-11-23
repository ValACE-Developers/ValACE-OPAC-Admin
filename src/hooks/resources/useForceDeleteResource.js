import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useForceDeleteResource = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const data =
                await ApiService.ResourceService.forceDeleteResource(id);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["resources"]);
        },
        ...options,
    });
};
