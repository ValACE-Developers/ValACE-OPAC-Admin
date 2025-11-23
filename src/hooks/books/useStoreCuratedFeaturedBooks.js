import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useStoreCuratedFeaturedBooks = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (featuredBooksData) => {
            const data =
                await ApiService.ExternalBookDataService.storeCuratedFeaturedBooks(
                    featuredBooksData
                );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["curatedFeaturedBooks"]);
        },
        ...options,
    });
};
