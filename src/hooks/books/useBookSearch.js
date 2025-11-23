import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useBookSearch = (
    keyword = "",
    filterType = "NONE",
    resourceIds = "",
    page = 1,
    perPage = 20,
    enabled = true,
    options = {},
) => {
    return useQuery({
        queryKey: [
            "bookSearch",
            keyword,
            filterType,
            resourceIds,
            page,
            perPage,
        ],
        queryFn: async () => {
            const params = {
                keyword: keyword,
                filter_type: filterType,
                page,
                per_page: perPage,
            };

            if (resourceIds && resourceIds.trim().length > 0) {
                params.api_resource_id = resourceIds;
            }

            const data = await ApiService.ExternalBookDataService.searchBooks(
                params
            );
            console.log("useBookSearch - Fetched Data:", data);
            return data;
        },
        enabled: enabled,
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        retry: 2,
        retryDelay: 1000,
        ...options,
    });
};
