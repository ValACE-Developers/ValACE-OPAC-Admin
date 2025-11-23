import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useFeaturedSelection = (params = {}, options = {}) => {
    return useQuery({
        queryKey: ["featuredSelection", params],
        queryFn: async () => {
            const data =
                await ApiService.ExternalBookDataService.fetchBooksForFeaturedSelection(
                    params
                );
            return data;
        },
        ...options,
    });
};
