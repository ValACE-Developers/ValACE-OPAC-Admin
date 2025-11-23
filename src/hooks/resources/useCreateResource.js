import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useCreateResource = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const data = await ApiService.ResourceService.createResource(
                payload
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["resources"]);
        },
        ...options,
    });
};
