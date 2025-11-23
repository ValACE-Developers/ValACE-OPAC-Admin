import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useDeleteFeaturedBook = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const data =
                await ApiService.ExternalBookDataService.deleteFeaturedBook(id);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["curatedFeaturedBooks"]);
            queryClient.invalidateQueries(["featuredSelection"]);
        },
        ...options,
    });
};
