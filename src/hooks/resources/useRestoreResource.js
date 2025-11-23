import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useRestoreResource = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const data = await ApiService.ResourceService.restoreResource(
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
