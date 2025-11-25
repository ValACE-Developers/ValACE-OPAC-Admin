import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/api/ApiService";

export const useGetPerCategoryUsage = (params, options = {}) => {
    return useQuery({
        queryKey: ["perCategoryUsage", params],
        queryFn: async () => {
            const data = await ApiService.DashboardService.getPerCategoryUsage(params);
            return data;
        },
        ...options,
    });
};
