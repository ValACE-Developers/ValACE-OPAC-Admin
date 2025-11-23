import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useGetFeaturedBooks = (params = {}, options = {}) => {
    return useQuery({
        queryKey: ["curatedFeaturedBooks", params],
        queryFn: async () => {
            const data =
                await ApiService.ExternalBookDataService.getCuratedFeaturedBooks(
                    params
                );
            return data;
        },
        ...options,
    });
};
