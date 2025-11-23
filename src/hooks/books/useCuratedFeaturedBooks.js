/**
 * This File will be move to the new useGetFeaturedBooks.js hook
 * and this will be deprecated soon.
 */

import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useCuratedFeaturedBooks = (params = {}, options = {}) => {
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
