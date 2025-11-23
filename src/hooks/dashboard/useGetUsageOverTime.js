import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useGetUsageOverTime = (params, options = {}) => {
    return useQuery({
        queryKey: ["usageOverTime", params],
        queryFn: async () => {
            const data = await ApiService.DashboardService.getUsageOverTime(params);
            return data;
        },
        ...options,
    });
};
